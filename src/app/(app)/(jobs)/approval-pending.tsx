import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { supabase } from "@/config/supabase";

const CANCELLED_STATUSES = [
  "CANCELLED",
  "CANCELLED_BY_USER",
  "CANCELLED_BY_WORKER",
  "AUTO_CANCELLED",
  "EXPIRED",
];

export default function ApprovalPendingScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [jobData, setJobData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const handleStatus = (job: any) => {
      setJobData(job);

      if (job.status === "IN_PROGRESS") {
        router.replace({
          pathname: "/(app)/(jobs)/work-in-progress",
          params: { id: job.id },
        });
        return;
      }

      if (CANCELLED_STATUSES.includes(job.status)) {
        router.replace("/(app)/(tabs)");
      }
    };

    const fetchJob = async () => {
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("id", id)
        .single();

      if (!data || error) {
        router.replace("/(app)/(tabs)");
        return;
      }

      handleStatus(data);
      setLoading(false);
    };

    fetchJob();

    const channel = supabase
      .channel(`approval-pending-${id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "jobs",
          filter: `id=eq.${id}`,
        },
        (payload) => handleStatus(payload.new),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id, router]);

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#65a30d" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.hero}>
        <View style={styles.iconWrap}>
          <MaterialIcons name="hourglass-top" size={44} color="#365314" />
        </View>
        <Text style={styles.title}>Waiting For Customer Approval</Text>
        <Text style={styles.subtitle}>
          Your final inspection price has been sent. Keep this screen open while
          the customer approves the work.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Current final amount</Text>
        <Text style={styles.amount}>Rs {jobData?.final_total ?? 0}</Text>
        <Text style={styles.note}>
          Once the customer approves, we will move you to the active work screen
          automatically.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8fafc",
  },
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    paddingHorizontal: 24,
    paddingTop: 36,
  },
  hero: {
    marginTop: 40,
    alignItems: "center",
  },
  iconWrap: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: "#d9f99d",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    marginTop: 24,
    fontSize: 28,
    fontWeight: "900",
    color: "#0f172a",
    textAlign: "center",
  },
  subtitle: {
    marginTop: 12,
    textAlign: "center",
    color: "#475569",
    lineHeight: 22,
  },
  card: {
    marginTop: 34,
    backgroundColor: "#ffffff",
    borderRadius: 28,
    padding: 22,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  label: {
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: 1,
    fontWeight: "800",
    fontSize: 11,
  },
  amount: {
    marginTop: 10,
    fontSize: 34,
    fontWeight: "900",
    color: "#16a34a",
  },
  note: {
    marginTop: 12,
    color: "#475569",
    lineHeight: 21,
  },
});
