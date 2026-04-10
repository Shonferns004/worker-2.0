import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import dayjs from "dayjs";
import { MaterialIcons } from "@expo/vector-icons";
import Animated, {
  SlideInLeft,
  SlideOutRight,
  Layout,
} from "react-native-reanimated";

import { useWorkerStore } from "@/store/workerStore";
import { calculateDistance } from "@/utils/mapUtils";
import { estimateETA } from "@/utils/eta";
import { getWorkerId, supabase } from "@/config/supabase";

const PRIMARY = "#a3e635";
const URGENT = "#ef4444";

type Job = {
  id: string;
  offer_id?: string;
  type: string;
  destination: any;
  address: string;
  price: number;
  received_at_ms?: number;
  expires_at_ms?: number;
  expires_at: string | Date;
};

type Props = {
  jobs: Job[];
  onAccept?: (job: Job) => void;
};

/* ---------------- UTIL ---------------- */

function formatTime(ms: number) {
  if (ms <= 0) return "00:00";
  const total = Math.floor(ms / 1000);
  const m = String(Math.floor(total / 60)).padStart(2, "0");
  const s = String(total % 60).padStart(2, "0");
  return `${m}:${s}`;
}

/* ---------------- EMPTY ---------------- */

const EmptyFeed = () => (
  <View style={styles.emptyContainer}>
    <Image
      source={require("@/assets/icons/bike.png")}
      style={styles.emptyImage}
      resizeMode="contain"
    />
    <Text style={styles.emptyTitle}>Waiting for nearby jobs</Text>
    <Text style={styles.emptySub}>
      Stay online. Jobs around your location will appear instantly.
    </Text>
  </View>
);

/* ---------------- CARD ---------------- */

const JobCard = ({
  job,
  now,
  onAccept,
}: {
  job: Job;
  now: dayjs.Dayjs;
  onAccept?: (job: Job) => void;
}) => {
  const remaining =
    typeof job.expires_at_ms === "number"
      ? job.expires_at_ms - now.valueOf()
      : dayjs(job.expires_at).diff(now);
  const { location } = useWorkerStore();

  const distance =
    location &&
    calculateDistance(
      job?.destination?.latitude,
      job?.destination?.longitude,
      location?.latitude,
      location?.longitude,
    );

  const etaMinutes = distance ? estimateETA(distance) : null;
  const isUrgent = remaining <= 15000;
  const isHot = remaining <= 30000;

  const borderColor = isUrgent ? URGENT : isHot ? "#f97316" : "#e2e8f0";
  const buttonColor = isUrgent ? URGENT : isHot ? "#f97316" : PRIMARY;
  const timerBg = isUrgent ? "#fee2e2" : isHot ? "#ffedd5" : "#f1f5f9";
  const timerText = isUrgent ? "#dc2626" : isHot ? "#ea580c" : "#475569";

  return (
    <Animated.View
      entering={SlideInLeft.springify().damping(18).stiffness(160)}
      exiting={SlideOutRight.duration(220)}
      layout={Layout.springify()}
      style={[styles.card, { borderLeftColor: borderColor }]}
    >
      {/* urgent icon */}
      {isUrgent && (
        <View style={styles.fire}>
          <MaterialIcons
            name="local-fire-department"
            size={20}
            color={URGENT}
          />
        </View>
      )}

      <View style={styles.cardInner}>
        {/* TOP ROW */}
        <View style={styles.rowBetween}>
          <View style={{ flex: 1, paddingRight: 10 }}>
            <Text style={[styles.title, isUrgent && { color: URGENT }]}>
              {job.type}
            </Text>

            <View style={styles.locationRow}>
              <MaterialIcons name="near-me" size={14} color="#64748b" />

              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={styles.metaText}>
                  {distance ? distance.toFixed(2) : "--"} km
                </Text>

                <Text style={styles.dot}>•</Text>

                <MaterialIcons name="schedule" size={13} color="#64748b" />

                <Text style={[styles.metaText, { fontWeight: "700" }]}>
                  {etaMinutes ? `${etaMinutes} min` : "--"}
                </Text>
              </View>

              <Text style={styles.dot}>•</Text>
            </View>
            <Text numberOfLines={2} style={styles.metaText}>
              {job.address}
            </Text>
          </View>

          <Text style={styles.price}>₹{job.price}</Text>
        </View>

        {/* BOTTOM ROW */}
        <View style={styles.bottomRow}>
          <View style={[styles.timerBox, { backgroundColor: timerBg }]}>
            <MaterialIcons name="timer" size={16} color={timerText} />
            <Text style={[styles.timerText, { color: timerText }]}>
              {formatTime(remaining)}
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.acceptBtn, { backgroundColor: buttonColor }]}
            activeOpacity={0.85}
            onPress={() => onAccept?.(job)}
          >
            <Text
              style={[
                styles.acceptText,
                { color: isUrgent ? "#fff" : "#0f172a" },
              ]}
            >
              {isUrgent ? "ACCEPT NOW" : "Accept Job"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
};

/* ---------------- MAIN ---------------- */

export default function PriorityFeed({ jobs, onAccept }: Props) {
  const [now, setNow] = useState(dayjs());

  const handleAccept = async (item: Job) => {
  const workerId = await getWorkerId()

  await supabase
    .from("job_offers")
    .update({
      response: "ACCEPTED",
      responded_at: new Date(),
    })
    .eq("job_id", item.id)
    .eq("worker_id", workerId);

  onAccept?.(item);
};

  /* global realtime ticker */
  useEffect(() => {
    const interval = setInterval(() => setNow(dayjs()), 1000);
    return () => clearInterval(interval);
  }, []);

  const visibleJobs = useMemo(() => {
    return jobs
      .map((j) => ({
        ...j,
        remaining:
          typeof j.expires_at_ms === "number"
            ? j.expires_at_ms - now.valueOf()
            : dayjs(j.expires_at).diff(now),
      }))
      .filter((j) => j.remaining > 0)
      .sort((a, b) => a.remaining - b.remaining);
  }, [jobs, now]);

  return (
    <FlatList
      data={visibleJobs}
      extraData={now}
      ListEmptyComponent={EmptyFeed}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <JobCard job={item} now={now} onAccept={handleAccept} />
      )}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
    />
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 140,
    paddingHorizontal: 14,
    paddingTop: 10,
    flexGrow: 1,
  },

  card: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    marginBottom: 14,
    borderLeftWidth: 6,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },

  cardInner: {
    paddingVertical: 16,
    paddingHorizontal: 14,
  },

  fire: {
    position: "absolute",
    top: 8,
    right: 8,
    zIndex: 5,
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  title: {
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 0.2,
  },

  price: {
    fontSize: 22,
    fontWeight: "900",
    color: "#16a34a",
  },

  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },

  metaText: {
    fontSize: 13,
    color: "#475569",
    marginLeft: 4,
    maxWidth: 900,
  },

  dot: {
    marginHorizontal: 6,
    color: "#cbd5e1",
  },

  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 14,
    gap: 10,
  },

  timerBox: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
  },

  timerText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: "800",
  },

  acceptBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },

  acceptText: {
    fontSize: 14,
    fontWeight: "800",
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },

  emptyImage: {
    width: 200,
    height: 200,
    opacity: 0.9,
    marginBottom: 20,
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#0f172a",
    marginBottom: 6,
  },

  emptySub: {
    fontSize: 13,
    color: "#64748b",
    textAlign: "center",
    lineHeight: 18,
  },
});
