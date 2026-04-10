import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { getWorkerJobHistory } from "@/service/apiService";

export default function WorkerHistoryScreen() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadJobs = async () => {
      try {
        const data = await getWorkerJobHistory();
        setJobs(data);
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, []);

  const history = useMemo(
    () =>
      jobs.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      ),
    [jobs],
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color="#a1e633" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={20} color="#0f172a" />
        </Pressable>
        <View>
          <Text style={styles.title}>Job History</Text>
          <Text style={styles.subtitle}>
            Review completed, cancelled, and scheduled work.
          </Text>
        </View>
      </View>

      <FlatList
        data={history}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No jobs yet</Text>
            <Text style={styles.emptyText}>
              Once you start receiving bookings, they will show up here.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={{ flex: 1, gap: 6 }}>
              <Text style={styles.cardTitle}>
                {(item.type ?? "Service").toString().toUpperCase()}
              </Text>
              <Text style={styles.cardMeta}>
                {item.destination?.address ?? "Location unavailable"}
              </Text>
              <Text style={styles.cardMeta}>
                {new Date(item.created_at).toLocaleString("en-IN")}
              </Text>
            </View>
            <View style={styles.rightCol}>
              <Text style={styles.status}>{item.status}</Text>
              <Text style={styles.amount}>
                Rs {item.final_total ?? item.estimated_total ?? 0}
              </Text>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f8fafc" },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8fafc",
  },
  header: {
    flexDirection: "row",
    gap: 14,
    padding: 20,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  title: { fontSize: 24, fontWeight: "900", color: "#0f172a" },
  subtitle: { marginTop: 4, color: "#64748b" },
  listContent: { padding: 20, gap: 14, flexGrow: 1 },
  emptyCard: {
    minHeight: 320,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  emptyTitle: { fontSize: 22, fontWeight: "900", color: "#0f172a" },
  emptyText: { marginTop: 8, color: "#64748b", textAlign: "center" },
  card: {
    flexDirection: "row",
    gap: 14,
    backgroundColor: "#ffffff",
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  cardTitle: { fontSize: 17, fontWeight: "800", color: "#0f172a" },
  cardMeta: { color: "#64748b" },
  rightCol: { alignItems: "flex-end", gap: 8 },
  status: {
    fontWeight: "800",
    color: "#365314",
    backgroundColor: "#ecfccb",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  amount: { fontSize: 18, fontWeight: "900", color: "#0f172a" },
});
