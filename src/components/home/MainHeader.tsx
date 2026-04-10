import { View, Text, StyleSheet, Pressable, ActivityIndicator } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { useWorkerStore } from "@/store/workerStore";
import { supabase } from "@/config/supabase";
import * as Location from "expo-location";
import { useUser } from "@/context/UserContext";
import { toogleOndutyButton } from "@/service/apiService";
import { router } from "expo-router";
import { getWorkerJobHistory } from "@/service/apiService";

const PRIMARY = "#a1e633";

const MainHeader = () => {
  const { setOnDuty, onDuty, setLocation } = useWorkerStore();
  const { user, refreshUser } = useUser();

  const [loading, setLoading] = useState(false);
  const [todayEarnings, setTodayEarnings] = useState(0);
  const channelRef = useRef<any>(null);

  /* =========================================================
     INITIAL LOAD + REALTIME SYNC
  ========================================================= */

  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;
      if (!user || !isMounted) return;

      // initial load
      const { data } = await supabase
        .from("workers")
        .select("on_duty")
        .eq("id", user.id) // make sure your schema matches this
        .single();

      if (data && isMounted) {
        setOnDuty(data.on_duty);
      }

      // realtime subscription
      channelRef.current = supabase
        .channel(`worker-duty-${user.id}`)
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "workers",
            filter: `id=eq.${user.id}`,
          },
          (payload) => {
            setOnDuty(payload.new.on_duty);
          },
        )
        .subscribe();
    };

    init();

    return () => {
      isMounted = false;
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [setOnDuty]);

  useEffect(() => {
    let active = true;

    const loadTodayEarnings = async () => {
      try {
        const jobs = await getWorkerJobHistory();
        if (!active) return;

        const today = new Date();
        const total = jobs
          .filter((job: any) => {
            if (job.status !== "COMPLETED") return false;
            const completedAt = new Date(job.completed_at ?? job.updated_at ?? job.created_at);
            return completedAt.toDateString() === today.toDateString();
          })
          .reduce(
            (sum: number, job: any) =>
              sum + Number(job.final_total ?? job.estimated_total ?? 0),
            0,
          );

        setTodayEarnings(total);
      } catch {
        if (active) {
          setTodayEarnings(0);
        }
      }
    };

    loadTodayEarnings();

    return () => {
      active = false;
    };
  }, []);

  /* =========================================================
     DUTY TOGGLE (SAFE + OPTIMISTIC)
  ========================================================= */

  const handleToggle = async () => {
    if (loading) return; // prevent rapid double taps
    setLoading(true);

    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;

    if (!user) {
      setLoading(false);
      return;
    }

    const newState = !onDuty;

    // optimistic UI update
    setOnDuty(newState);

    try {
      if (newState) {
        // going ON duty

        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== "granted") {
          setOnDuty(false); // revert
          setLoading(false);
          return;
        }

        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        const { latitude, longitude, heading } = location.coords;

        // update local store immediately
        setLocation({
          latitude,
          longitude,
          heading: heading || 0,
          address: "Somewhere",
        });

        await supabase
          .from("workers")
          .update({
            on_duty: true,
            latitude,
            longitude,
            heading,
          })
          .eq("id", user.id);

        await toogleOndutyButton(true);

      } else {
        // going OFF duty
        await supabase
          .from("workers")
          .update({ on_duty: false })
          .eq("id", user.id);

        await toogleOndutyButton(false);
      }

      await refreshUser();
    } catch {
      // revert on failure
      setOnDuty(!newState);
    }

    setLoading(false);
  };

  /* ========================================================= */

  return (
    <View style={styles.header}>
      <View style={styles.heroCard}>
        <View style={styles.headerRow}>
        <Pressable
          style={styles.profileRow}
          onPress={() => router.push("/profile")}
        >
          <View style={styles.avatarWrapper}>
            <Text style={styles.avatarText}>
              {(user?.name ?? "W").slice(0, 1).toUpperCase()}
            </Text>
          </View>

          <View>
            <Text style={styles.greeting}>GOOD MORNING</Text>
            <Text style={styles.name}>{user?.name ?? "Worker"}</Text>
            <Text style={styles.serviceType}>
              {(user as any)?.service_type
                ? String((user as any).service_type).toUpperCase()
                : "SERVICE PARTNER"}
            </Text>
          </View>
        </Pressable>

        <View style={styles.earningsPanel}>
          <Text style={styles.smallLabel}>TODAY'S EARNINGS</Text>
          <Text style={styles.smallValue}>₹ {todayEarnings}</Text>
          <Text style={styles.tinyValue}>{(user as any)?.skill_points ?? 0} XP</Text>
        </View>
      </View>

      {/* DUTY CARD */}
      <View style={styles.dutyCard}>
        <View style={styles.dutyLeft}>
          <Pressable
            onPress={handleToggle}
            disabled={loading}
            style={[
              styles.toggleShell,
              onDuty ? styles.toggleShellActive : styles.toggleShellInactive,
              loading && styles.toggleDisabled,
            ]}
          >
            <View
              style={[
                styles.toggleThumb,
                onDuty ? styles.toggleThumbActive : styles.toggleThumbInactive,
              ]}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#0f172a" />
              ) : (
                <MaterialIcons
                  name={onDuty ? "check" : "power-settings-new"}
                  size={18}
                  color="#0f172a"
                />
              )}
            </View>
          </Pressable>

          <View>
            <View style={styles.statusRow}>
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: onDuty ? PRIMARY : "#cbd5e1" },
                ]}
              />
              <Text style={styles.dutyText}>
                {onDuty ? "On Duty" : "Offline"}
              </Text>
            </View>

            <Text style={styles.dutySub}>
              {onDuty ? "ACCEPTING NEW TASKS" : "NOT ACCEPTING JOBS"}
            </Text>
          </View>
        </View>

        <View style={styles.iconBox}>
          <MaterialIcons name="sensors" size={22} color={PRIMARY} />
        </View>
      </View>
      </View>
    </View>
  );
};

export default MainHeader;

/* ========================================================= */

const styles = StyleSheet.create({
  header: {
    paddingTop: 40,
    paddingHorizontal: 24,
  },
  heroCard: {
    borderRadius: 32,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    padding: 20,
    shadowColor: "#0f172a",
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 5,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },

  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 14,
  },

  avatarWrapper: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 14,
    borderWidth: 2,
    borderColor: "rgba(161,230,51,0.35)",
    backgroundColor: "#ecfccb",
    alignItems: "center",
    justifyContent: "center",
  },

  avatarText: {
    color: "#365314",
    fontWeight: "900",
    fontSize: 22,
  },

  greeting: {
    fontSize: 10,
    fontWeight: "800",
    color: "#94a3b8",
    letterSpacing: 1.2,
  },

  name: {
    marginTop: 2,
    fontSize: 22,
    fontWeight: "900",
    color: "#0f172a",
  },
  serviceType: {
    marginTop: 5,
    fontSize: 11,
    fontWeight: "800",
    color: "#64748b",
    letterSpacing: 0.8,
  },
  earningsPanel: {
    minWidth: 118,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 20,
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    alignItems: "flex-end",
  },

  smallLabel: {
    fontSize: 9,
    fontWeight: "800",
    color: "#94a3b8",
    letterSpacing: 0.8,
  },

  smallValue: {
    marginTop: 6,
    fontSize: 18,
    fontWeight: "900",
    color: "#0f172a",
  },
  tinyValue: {
    marginTop: 4,
    fontSize: 10,
    fontWeight: "700",
    color: "#64748b",
  },

  dutyCard: {
    paddingHorizontal: 18,
    paddingVertical: 18,
    borderRadius: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },

  dutyLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  toggleShell: {
    width: 70,
    height: 38,
    borderRadius: 20,
    padding: 4,
    justifyContent: "center",
  },
  toggleShellActive: {
    backgroundColor: "#dcfce7",
    alignItems: "flex-end",
  },
  toggleShellInactive: {
    backgroundColor: "#e2e8f0",
    alignItems: "flex-start",
  },
  toggleThumb: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  toggleThumbActive: {
    backgroundColor: PRIMARY,
  },
  toggleThumbInactive: {
    backgroundColor: "#ffffff",
  },
  toggleDisabled: {
    opacity: 0.7,
  },

  statusRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: PRIMARY,
    marginRight: 6,
  },

  dutyText: {
    fontSize: 17,
    fontWeight: "800",
    color: "#0f172a",
  },

  dutySub: {
    fontSize: 10,
    color: "#94a3b8",
    fontWeight: "700",
    marginTop: 3,
    letterSpacing: 0.6,
  },

  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 18,
    backgroundColor: "#f8fcf0",
    alignItems: "center",
    justifyContent: "center",
  },
});
