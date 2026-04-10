import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { supabase } from "@/config/supabase";
import { completeActiveJob } from "@/service/apiService";

const CANCELLED_STATUSES = [
  "CANCELLED",
  "CANCELLED_BY_USER",
  "CANCELLED_BY_WORKER",
  "AUTO_CANCELLED",
  "EXPIRED",
];

export default function WorkInProgressScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [jobData, setJobData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    "CASH" | "ONLINE"
  >("ONLINE");

  useEffect(() => {
    if (!id) return;

    const handleStatus = (job: any) => {
      setJobData(job);

      if (job.status === "COMPLETED") {
        if (String(job.payment_method ?? "ONLINE").toUpperCase() === "ONLINE") {
          router.replace({
            pathname: "/(app)/(jobs)/payment-qr",
            params: { id: job.id },
          });
        } else {
          router.replace("/(app)/(tabs)");
        }
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
      .channel(`work-progress-${id}`)
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

  const handleDoneWork = async () => {
    if (!id) return;

    try {
      setSubmitting(true);
      const success = await completeActiveJob(
        id as string,
        selectedPaymentMethod,
      );

      if (!success) {
        Alert.alert("Unable to complete job", "Please try again.");
        return;
      }

      if (selectedPaymentMethod === "ONLINE") {
        router.replace({
          pathname: "/(app)/(jobs)/payment-qr",
          params: { id: id as string },
        });
      } else {
        Alert.alert("Cash collected", "The cash payment has been recorded.");
        router.replace("/(app)/(tabs)");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#65a30d" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.heroCard}>
        <View style={styles.heroIcon}>
          <MaterialIcons name="construction" size={42} color="#ffffff" />
        </View>
        <Text style={styles.heroTitle}>Work In Progress</Text>
        <Text style={styles.heroSubtitle}>
          Finish the service, then tap done to open the company payment QR for
          the customer.
        </Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.sectionLabel}>Service</Text>
        <Text style={styles.serviceName}>{jobData?.type ?? "Assigned job"}</Text>
        <Text style={styles.metaText}>
          Size: {jobData?.worker_confirmed_size ?? jobData?.user_selected_size ?? "--"}
        </Text>
        <Text style={styles.metaText}>
          Final amount: Rs {jobData?.final_total ?? 0}
        </Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.sectionLabel}>Payment Method</Text>
        <Text style={styles.helperText}>
          Cash jobs count in total earnings but not in withdrawable balance. Online jobs count in both.
        </Text>
        <View style={styles.paymentRow}>
          {[
            { value: "ONLINE", label: "Online" },
            { value: "CASH", label: "Cash" },
          ].map((option) => {
            const active = selectedPaymentMethod === option.value;
            return (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.paymentChip,
                  active && styles.paymentChipActive,
                ]}
                onPress={() =>
                  setSelectedPaymentMethod(option.value as "CASH" | "ONLINE")
                }
              >
                <Text
                  style={[
                    styles.paymentChipText,
                    active && styles.paymentChipTextActive,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <TouchableOpacity
        style={[styles.doneButton, submitting && styles.disabledButton]}
        disabled={submitting}
        onPress={handleDoneWork}
      >
        <Text style={styles.doneButtonText}>
          {submitting ? "Completing..." : "Done Work"}
        </Text>
      </TouchableOpacity>
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
    justifyContent: "space-between",
    paddingBottom: 36,
  },
  heroCard: {
    backgroundColor: "#0f172a",
    borderRadius: 30,
    padding: 24,
    alignItems: "center",
  },
  heroIcon: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: "#16a34a",
    alignItems: "center",
    justifyContent: "center",
  },
  heroTitle: {
    marginTop: 18,
    color: "#ffffff",
    fontSize: 28,
    fontWeight: "900",
  },
  heroSubtitle: {
    marginTop: 10,
    color: "#cbd5e1",
    textAlign: "center",
    lineHeight: 22,
  },
  infoCard: {
    backgroundColor: "#ffffff",
    borderRadius: 28,
    padding: 22,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  sectionLabel: {
    color: "#64748b",
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1,
    fontSize: 11,
  },
  serviceName: {
    marginTop: 8,
    color: "#0f172a",
    fontSize: 26,
    fontWeight: "900",
    textTransform: "capitalize",
  },
  metaText: {
    marginTop: 8,
    color: "#475569",
    fontSize: 15,
  },
  helperText: {
    marginTop: 8,
    color: "#64748b",
    lineHeight: 20,
  },
  paymentRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
  paymentChip: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#cbd5e1",
    alignItems: "center",
  },
  paymentChipActive: {
    backgroundColor: "#0f172a",
    borderColor: "#0f172a",
  },
  paymentChipText: {
    color: "#334155",
    fontWeight: "800",
  },
  paymentChipTextActive: {
    color: "#ffffff",
  },
  doneButton: {
    borderRadius: 22,
    backgroundColor: "#111827",
    paddingVertical: 20,
    alignItems: "center",
  },
  disabledButton: {
    opacity: 0.6,
  },
  doneButtonText: {
    color: "#ffffff",
    fontWeight: "900",
    fontSize: 17,
  },
});
