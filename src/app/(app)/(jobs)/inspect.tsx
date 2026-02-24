import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  Alert,
} from "react-native";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { supabase } from "@/config/supabase";
import { screenHeight } from "@/utils/Constants";
import { verifyTaskType } from "@/service/apiService";

export default function VerifyTask() {
  const bottomSheetRef = useRef<BottomSheet>(null);

  const snapPoints = useMemo(() => ["70%"], []);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [jobData, setJobData] = useState<any>(null);
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [difficulty, setDifficulty] = useState<
    "Small" | "Medium" | "Large" | null
  >();
  /* ---------- SHEET CONTROL ---------- */

  const openSheet = () => {
    setSheetOpen(true);
    bottomSheetRef.current?.expand();
  };

  const closeSheet = () => {
    bottomSheetRef.current?.close();
  };

  const handleSheetChange = (index: number) => {
    // when user drags down manually
    setSheetOpen(index >= 0);
  };

  const selectDifficulty = (level: "Small" | "Medium" | "Large") => {
    setDifficulty(level);
  };

  useEffect(() => {
    if (!id) return;

    const fetchJob = async () => {
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("id", id)
        .single();

      if (!data || error) {
        Alert.alert("Job not found");
        router.replace("/(app)/(tabs)");
        return;
      }

      setJobData(data);
      setDifficulty(data?.user_selected_size.toUpperCase());
    };

    fetchJob();
  }, [id]);

  useEffect(() => {
    if (!id) return;

    const channel = supabase
      .channel(`worker-job-${id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "jobs",
          filter: `id=eq.${id}`,
        },
        (payload) => {
          const job = payload.new;
          setJobData(job);

          if (job.status === "APPROVED") {
            // Alert.alert("Customer cancelled the job");
            router.replace("/(app)/(tabs)/temp");
          }

          if (job.status === "COMPLETED") {
            Alert.alert("Job finished");
            router.replace("/(app)/(tabs)/temp");
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id]);

  const handleVerifyTaskType = async () => {
    const success = await verifyTaskType(
      id as string,
      difficulty?.toLowerCase() as string,
    );
    if (success) {
      Alert.alert("Task type verified");
      router.replace("/(app)/(tabs)");
    } else {
      Alert.alert("Failed to verify task type");
    }
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Verify Task Type</Text>
      </View>

      {/* CARD */}
      <View style={styles.card}>
        <View style={styles.cardRow}>
          <View>
            <Text style={styles.label}>TASK TYPE</Text>
            <Text style={styles.title}>{difficulty}</Text>
            <Text style={styles.subtitle}>General cleaning & organizing</Text>
          </View>

          <TouchableOpacity style={styles.editBtn} onPress={openSheet}>
            <MaterialIcons name="edit" size={18} color="#65a30d" />
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* INFO TEXT */}
      <Text style={styles.info}>
        Please confirm the task type level is accurate based on the on-site
        assessment before starting the work.
      </Text>

      <View style={{ flex: 1 }} />

      {/* CONTINUE BUTTON */}
      <View style={styles.bottomArea}>
        <TouchableOpacity
          onPress={handleVerifyTaskType}
          style={styles.continueBtn}
        >
          <Text style={styles.continueText}>Continue to Task</Text>
        </TouchableOpacity>
      </View>

      {/* OVERLAY — only when open */}
      {sheetOpen && <Pressable style={styles.overlay} onPress={closeSheet} />}

      {/* BOTTOM SHEET */}
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        index={-1}
        onChange={handleSheetChange}
        enablePanDownToClose
        backgroundStyle={styles.sheetBg}
        handleIndicatorStyle={styles.handle}
      >
        <BottomSheetView style={styles.sheetContent}>
          <Text style={styles.sheetTitle}>Change Difficulty</Text>
          <Text style={styles.sheetSubtitle}>
            Select the appropriate task level
          </Text>

          <DifficultyOption
            title="Small"
            description="Basic maintenance or single items"
            icon="eco"
            selected={difficulty === "Small"}
            onPress={() => selectDifficulty("Small")}
          />

          <DifficultyOption
            title="Medium"
            description="General cleaning & organizing"
            icon="cleaning-services"
            selected={difficulty === "Medium"}
            onPress={() => selectDifficulty("Medium")}
          />

          <DifficultyOption
            title="Large"
            description="Deep cleaning or heavy moving"
            icon="precision-manufacturing"
            selected={difficulty === "Large"}
            onPress={() => selectDifficulty("Large")}
          />

          <TouchableOpacity style={styles.confirmBtn} onPress={closeSheet}>
            <Text style={styles.confirmText}>Confirm Selection</Text>
          </TouchableOpacity>
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
}

/* ---------- OPTION COMPONENT ---------- */

function DifficultyOption({
  title,
  description,
  icon,
  selected,
  onPress,
}: any) {
  return (
    <TouchableOpacity
      style={[styles.option, selected && styles.optionSelected]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={styles.iconBox}>
        <MaterialIcons name={icon} size={24} color="#65a30d" />
      </View>

      <View style={{ flex: 1 }}>
        <Text style={styles.optionTitle}>{title}</Text>
        <Text style={styles.optionDesc}>{description}</Text>
      </View>

      <View style={[styles.radio, selected && styles.radioActive]}>
        {selected && <MaterialIcons name="check" size={16} color="#0f172a" />}
      </View>
    </TouchableOpacity>
  );
}

/* ---------- STYLES ---------- */

const PRIMARY = "#a3e635";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    paddingHorizontal: 24,
    paddingTop: 60,
  },

  header: {
    marginTop: screenHeight * 0.05,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: screenHeight * 0.08,
  },

  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#020617",
  },

  card: {
    backgroundColor: "white",
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },

  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  label: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1,
    color: "#94a3b8",
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 2,
  },

  subtitle: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 4,
  },

  editBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#ecfccb",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },

  editText: {
    color: "#65a30d",
    fontWeight: "600",
    fontSize: 14,
  },

  info: {
    textAlign: "center",
    fontSize: 11,
    color: "#94a3b8",
    marginTop: 18,
    paddingHorizontal: 30,
    lineHeight: 16,
  },

  bottomArea: {
    paddingBottom: 40,
  },

  continueBtn: {
    backgroundColor: "black",
    paddingVertical: 20,
    borderRadius: 20,
    alignItems: "center",
  },

  continueText: {
    fontSize: 18,
    fontWeight: "700",
    color: "white",
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(15,23,42,0.6)",
  },

  sheetBg: {
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },

  handle: {
    width: 50,
    backgroundColor: "#e2e8f0",
  },

  sheetContent: {
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 40,
  },

  sheetTitle: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
  },

  sheetSubtitle: {
    textAlign: "center",
    color: "#64748b",
    marginBottom: 20,
    marginTop: 4,
  },

  option: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: "#f1f5f9",
    marginBottom: 12,
  },

  optionSelected: {
    borderColor: PRIMARY,
    backgroundColor: "#f7fee7",
  },

  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#ecfccb",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },

  optionTitle: {
    fontSize: 16,
    fontWeight: "700",
  },

  optionDesc: {
    fontSize: 12,
    color: "#64748b",
  },

  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#e2e8f0",
    alignItems: "center",
    justifyContent: "center",
  },

  radioActive: {
    backgroundColor: PRIMARY,
    borderColor: PRIMARY,
  },

  confirmBtn: {
    backgroundColor: PRIMARY,
    paddingVertical: 18,
    borderRadius: 20,
    alignItems: "center",
    marginTop: 16,
  },

  confirmText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#020617",
  },
});
