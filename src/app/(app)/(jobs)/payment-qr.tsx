import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { supabase } from "@/config/supabase";

const COMPANY_UPI_ID = "hirekar.company@upi";
const COMPANY_NAME = "HireKar Services";

export default function PaymentQrScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [jobData, setJobData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

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

      setJobData(data);
      setLoading(false);
    };

    fetchJob();
  }, [id, router]);

  const paymentUrl = useMemo(() => {
    const amount = jobData?.final_total ?? 0;
    return `upi://pay?pa=${encodeURIComponent(COMPANY_UPI_ID)}&pn=${encodeURIComponent(
      COMPANY_NAME,
    )}&am=${amount}&cu=INR&tn=${encodeURIComponent(`HireKar job ${id}`)}`;
  }, [id, jobData?.final_total]);

  const qrImageUrl = useMemo(() => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(paymentUrl)}`;
  }, [paymentUrl]);

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#65a30d" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Company Payment QR</Text>
      <Text style={styles.subtitle}>
        Ask the customer to scan this company QR and complete the payment for
        the finished job.
      </Text>

      <View style={styles.card}>
        <Image source={{ uri: qrImageUrl }} style={styles.qrImage} />
        <Text style={styles.amount}>Rs {jobData?.final_total ?? 0}</Text>
        <Text style={styles.companyName}>{COMPANY_NAME}</Text>
        <Text style={styles.upiId}>{COMPANY_UPI_ID}</Text>
        <Text style={styles.note}>
          Replace the placeholder company UPI ID above with your real company
          payment ID before production release.
        </Text>
      </View>

      <TouchableOpacity
        style={styles.finishButton}
        onPress={() => router.replace("/(app)/(tabs)")}
      >
        <Text style={styles.finishButtonText}>Back To Home</Text>
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
    paddingTop: 30,
    paddingBottom: 36,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 30,
    fontWeight: "900",
    color: "#0f172a",
    textAlign: "center",
  },
  subtitle: {
    marginTop: 10,
    textAlign: "center",
    color: "#475569",
    lineHeight: 22,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 30,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  qrImage: {
    width: 240,
    height: 240,
    borderRadius: 18,
  },
  amount: {
    marginTop: 18,
    fontSize: 30,
    fontWeight: "900",
    color: "#16a34a",
  },
  companyName: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "800",
    color: "#0f172a",
  },
  upiId: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: "700",
    color: "#475569",
  },
  note: {
    marginTop: 14,
    color: "#64748b",
    textAlign: "center",
    lineHeight: 20,
  },
  finishButton: {
    borderRadius: 22,
    backgroundColor: "#111827",
    paddingVertical: 18,
    alignItems: "center",
  },
  finishButtonText: {
    color: "#ffffff",
    fontWeight: "900",
    fontSize: 17,
  },
});
