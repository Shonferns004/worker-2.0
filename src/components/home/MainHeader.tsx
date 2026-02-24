import { View, Text, Image, Switch, StyleSheet } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { useWorkerStore } from "@/store/workerStore";
import { supabase } from "@/config/supabase";
import * as Location from "expo-location";

const PRIMARY = "#a1e633";

const MainHeader = () => {
  const { setOnDuty, onDuty, setLocation } = useWorkerStore();

  const [loading, setLoading] = useState(false);
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
      } else {
        // going OFF duty
        await supabase
          .from("workers")
          .update({ on_duty: false })
          .eq("id", user.id);
      }
    } catch (error) {
      // revert on failure
      setOnDuty(!newState);
    }

    setLoading(false);
  };

  /* ========================================================= */

  return (
    <View style={styles.header}>
      <View style={styles.headerRow}>
        <View style={styles.profileRow}>
          <View style={styles.avatarWrapper}>
            <Image
              source={{
                uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuAWXCc0O3_vkc_QlLSoXYUG2brus8jzI9FXyziLdOM7M_ueqYw8BkbVcxoJkv6IWlyIxAz6OILmlcnZOxE45H9TtJzrhJIiq4mfBhsS5w04xp7El0rtRAmfrFLKVERe-dxgZNcsEEU_mmtVMqq8EboNGJTiWtlD1T8mWnxnORelAC01dv9puNyw4nKVbDaHSuwXb5JnsaWk266zWrmqaNCqybPlPEgTeXV4f_7UEmefsVLH_2XpPex3w288TaL06cvIMLzLcxUj38A",
              }}
              style={styles.avatar}
            />
          </View>

          <View>
            <Text style={styles.greeting}>GOOD MORNING</Text>
            <Text style={styles.name}>Alex Rivera</Text>
          </View>
        </View>

        <View style={{ alignItems: "flex-end" }}>
          <Text style={styles.smallLabel}>SKILL POINTS</Text>
          <Text style={styles.smallValue}>2,450 XP</Text>
        </View>
      </View>

      {/* DUTY CARD */}
      <View style={[styles.dutyCard, { backgroundColor: "#ffffff" }]}>
        <View style={styles.dutyLeft}>
          <Switch
            value={onDuty}
            onValueChange={handleToggle}
            disabled={loading}
            trackColor={{ true: PRIMARY }}
          />

          <View>
            <View style={styles.statusRow}>
              <View style={styles.statusDot} />
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
  );
};

export default MainHeader;

/* ========================================================= */

const styles = StyleSheet.create({
  header: {
    paddingTop: 40,
    paddingHorizontal: 24,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },

  profileRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  avatarWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: "hidden",
    marginRight: 12,
    borderWidth: 2,
    borderColor: "rgba(161,230,51,0.2)",
  },

  avatar: {
    width: "100%",
    height: "100%",
  },

  greeting: {
    fontSize: 10,
    fontWeight: "700",
    opacity: 0.4,
  },

  name: {
    fontSize: 18,
    fontWeight: "800",
  },

  smallLabel: {
    fontSize: 8,
    fontWeight: "800",
    opacity: 0.4,
  },

  smallValue: {
    fontSize: 12,
    fontWeight: "800",
  },

  dutyCard: {
    padding: 20,
    borderRadius: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  dutyLeft: {
    flexDirection: "row",
    alignItems: "center",
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
    fontSize: 18,
    fontWeight: "800",
  },

  dutySub: {
    fontSize: 10,
    opacity: 0.4,
    fontWeight: "700",
    marginTop: 2,
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
