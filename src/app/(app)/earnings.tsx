import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import {
  createWithdrawalRequest,
  getMyWithdrawalRequests,
  getWorkerJobHistory,
} from "@/service/apiService";

export default function EarningsScreen() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    try {
      const [jobHistory, withdrawalRequests] = await Promise.all([
        getWorkerJobHistory(),
        getMyWithdrawalRequests(),
      ]);

      setJobs(jobHistory);
      setRequests(withdrawalRequests);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const summary = useMemo(() => {
    const completedJobs = jobs.filter((job) => job.status === "COMPLETED");
    const total = completedJobs.reduce(
      (sum, job) => sum + Number(job.final_total ?? job.estimated_total ?? 0),
      0,
    );
    const onlineCompletedJobs = completedJobs.filter(
      (job) => String(job.payment_method ?? "ONLINE").toUpperCase() !== "CASH",
    );
    const onlineTotal = onlineCompletedJobs.reduce(
      (sum, job) => sum + Number(job.final_total ?? job.estimated_total ?? 0),
      0,
    );
    const cashTotal = Math.max(total - onlineTotal, 0);

    const visitFees = completedJobs.reduce(
      (sum, job) => sum + Number(job.visit_fee ?? 0),
      0,
    );

    const lockedWithdrawals = requests
      .filter((request) => ["PENDING", "APPROVED"].includes(request.status))
      .reduce((sum, request) => sum + Number(request.amount ?? 0), 0);
    const paidWithdrawals = requests
      .filter((request) => request.status === "PAID")
      .reduce((sum, request) => sum + Number(request.amount ?? 0), 0);
    const totalRequested = requests
      .filter((request) => request.status !== "REJECTED")
      .reduce((sum, request) => sum + Number(request.amount ?? 0), 0);
    const totalPlatformFees = requests
      .filter((request) => request.status !== "REJECTED")
      .reduce((sum, request) => sum + Number(request.platform_fee ?? 0), 0);

    return {
      completedCount: completedJobs.length,
      total,
      onlineTotal,
      cashTotal,
      visitFees,
      average:
        completedJobs.length > 0 ? Math.round(total / completedJobs.length) : 0,
      lockedWithdrawals,
      paidWithdrawals,
      totalRequested,
      totalPlatformFees,
    };
  }, [jobs, requests]);

  const availableBalance = Math.max(summary.onlineTotal - summary.totalRequested, 0);

  const requestWithdrawal = async () => {
    const parsedAmount = Number(amount);

    if (!parsedAmount || parsedAmount <= 0) {
      Alert.alert("Invalid amount", "Enter a valid withdrawal amount.");
      return;
    }

    if (parsedAmount > availableBalance) {
      Alert.alert(
        "Amount too high",
        "Withdrawal amount is more than your available balance.",
      );
      return;
    }

    try {
      setSubmitting(true);
      await createWithdrawalRequest({ amount: parsedAmount, note });
      setAmount("");
      setNote("");
      Alert.alert(
        "Request sent",
        "Your withdrawal request has been sent to admin for payment.",
      );
      await loadData();
    } catch (error: any) {
      Alert.alert(
        "Unable to request withdrawal",
        error?.response?.data?.message || "Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color="#a1e633" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={20} color="#0f172a" />
          </Pressable>
          <View style={styles.headerCopy}>
            <Text style={styles.title}>Earnings & Payouts</Text>
            <Text style={styles.subtitle}>
              Track completed work, available balance, and withdrawal requests.
            </Text>
          </View>
        </View>

        <View style={styles.heroCard}>
          <Text style={styles.heroLabel}>TOTAL EARNINGS</Text>
          <Text style={styles.heroValue}>Rs {summary.total}</Text>
          <Text style={styles.heroSub}>
            Based on {summary.completedCount} completed jobs.
          </Text>

          <View style={styles.heroMetaRow}>
            <View style={styles.heroMetaChip}>
              <Text style={styles.heroMetaLabel}>Available</Text>
              <Text style={styles.heroMetaValue}>Rs {availableBalance}</Text>
            </View>
            <View style={styles.heroMetaChip}>
              <Text style={styles.heroMetaLabel}>Pending</Text>
              <Text style={styles.heroMetaValue}>Rs {summary.lockedWithdrawals}</Text>
            </View>
          </View>
        </View>

        <View style={styles.grid}>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Completed Jobs</Text>
            <Text style={styles.cardValue}>{summary.completedCount}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Online Earnings</Text>
            <Text style={styles.cardValue}>Rs {summary.onlineTotal}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Cash Collected</Text>
            <Text style={styles.cardValue}>Rs {summary.cashTotal}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Available Balance</Text>
            <Text style={styles.cardValue}>Rs {availableBalance}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Paid Withdrawals</Text>
            <Text style={styles.cardValue}>Rs {summary.paidWithdrawals}</Text>
          </View>
        </View>

        <View style={styles.withdrawCard}>
          <Text style={styles.withdrawTitle}>Withdraw Money</Text>
          <Text style={styles.withdrawSubtitle}>
            Send a payout request to admin. They can approve and mark it paid from
            the admin panel. A regular platform fee is applied on each withdrawal.
          </Text>

          <View style={styles.feeBanner}>
            <Text style={styles.feeBannerTitle}>Regular platform charge</Text>
            <Text style={styles.feeBannerText}>
              Rs {requests.find((request) => request.platform_fee)?.platform_fee ?? 10} is tracked on every withdrawal request.
            </Text>
          </View>

          <TextInput
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            placeholder="Amount in Rs"
            style={styles.input}
            placeholderTextColor="#94a3b8"
          />

          <TextInput
            value={note}
            onChangeText={setNote}
            placeholder="Add UPI / bank note for admin"
            style={[styles.input, styles.noteInput]}
            multiline
            placeholderTextColor="#94a3b8"
          />

          <Pressable
            style={[styles.withdrawButton, submitting && styles.disabledButton]}
            onPress={requestWithdrawal}
            disabled={submitting}
          >
            <Text style={styles.withdrawButtonText}>
              {submitting ? "Sending..." : "Request Withdrawal"}
            </Text>
          </Pressable>
        </View>

        <View style={styles.requestsCard}>
          <Text style={styles.withdrawTitle}>Recent Requests</Text>
          {requests.length === 0 ? (
            <Text style={styles.emptyText}>No withdrawal requests yet.</Text>
          ) : (
            requests.slice(0, 4).map((request) => (
              <View key={request.id} style={styles.requestRow}>
                <View>
                  <Text style={styles.requestAmount}>Rs {request.amount}</Text>
                  <Text style={styles.requestMeta}>
                    {request.requested_at
                      ? new Date(request.requested_at).toLocaleString()
                      : "Just now"}
                  </Text>
                  <Text style={styles.requestMeta}>
                    Fee Rs {Number(request.platform_fee ?? 0)} • You receive Rs{" "}
                    {Math.max(
                      Number(
                        request.payout_amount ??
                          Number(request.amount ?? 0) -
                            Number(request.platform_fee ?? 0),
                      ),
                      0,
                    )}
                  </Text>
                </View>
                <View
                  style={[
                    styles.statusBadge,
                    request.status === "PAID"
                      ? styles.statusPaid
                      : request.status === "REJECTED"
                        ? styles.statusRejected
                        : request.status === "APPROVED"
                          ? styles.statusApproved
                          : styles.statusPending,
                  ]}
                >
                  <Text style={styles.statusText}>{request.status}</Text>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f8fafc" },
  content: {
    padding: 20,
    gap: 18,
    paddingBottom: 40,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8fafc",
  },
  header: { flexDirection: "row", gap: 14, alignItems: "flex-start" },
  headerCopy: { flex: 1 },
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
  heroCard: {
    backgroundColor: "#0f172a",
    borderRadius: 28,
    padding: 24,
    overflow: "hidden",
  },
  heroLabel: {
    color: "#a3e635",
    fontWeight: "800",
    letterSpacing: 1.2,
  },
  heroValue: {
    marginTop: 10,
    fontSize: 36,
    fontWeight: "900",
    color: "#ffffff",
  },
  heroSub: {
    marginTop: 8,
    color: "#cbd5e1",
  },
  heroMetaRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 18,
  },
  heroMetaChip: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 18,
    padding: 14,
  },
  heroMetaLabel: {
    color: "#94a3b8",
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  heroMetaValue: {
    color: "#ffffff",
    marginTop: 6,
    fontSize: 18,
    fontWeight: "900",
  },
  grid: {
    gap: 14,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  cardLabel: {
    color: "#64748b",
    fontWeight: "800",
    marginBottom: 8,
  },
  cardValue: {
    color: "#0f172a",
    fontSize: 26,
    fontWeight: "900",
  },
  withdrawCard: {
    backgroundColor: "#ffffff",
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    gap: 12,
  },
  withdrawTitle: {
    color: "#0f172a",
    fontSize: 20,
    fontWeight: "900",
  },
  withdrawSubtitle: {
    color: "#64748b",
    lineHeight: 20,
  },
  feeBanner: {
    borderRadius: 16,
    backgroundColor: "#ecfccb",
    padding: 14,
    borderWidth: 1,
    borderColor: "#bef264",
  },
  feeBannerTitle: {
    color: "#365314",
    fontWeight: "900",
  },
  feeBannerText: {
    marginTop: 4,
    color: "#4d7c0f",
    fontWeight: "700",
  },
  input: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    backgroundColor: "#f8fafc",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 14,
    color: "#0f172a",
    fontWeight: "600",
  },
  noteInput: {
    minHeight: 88,
    textAlignVertical: "top",
  },
  withdrawButton: {
    backgroundColor: "#0f172a",
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: "center",
  },
  disabledButton: {
    opacity: 0.6,
  },
  withdrawButtonText: {
    color: "#ffffff",
    fontWeight: "900",
    fontSize: 15,
  },
  requestsCard: {
    backgroundColor: "#ffffff",
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    gap: 12,
  },
  emptyText: {
    color: "#94a3b8",
    fontWeight: "600",
  },
  requestRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
    paddingTop: 12,
  },
  requestAmount: {
    color: "#0f172a",
    fontWeight: "900",
    fontSize: 18,
  },
  requestMeta: {
    marginTop: 4,
    color: "#64748b",
    fontSize: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
  },
  statusPending: {
    backgroundColor: "#fef3c7",
  },
  statusApproved: {
    backgroundColor: "#dbeafe",
  },
  statusPaid: {
    backgroundColor: "#dcfce7",
  },
  statusRejected: {
    backgroundColor: "#fee2e2",
  },
  statusText: {
    fontWeight: "900",
    fontSize: 11,
    color: "#0f172a",
  },
});
