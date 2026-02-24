import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

type PlayingLessonProps = {
  title: string;
  description?: string;
  duration?: string;
  progress?: number; // 0–100 (optional)
  thumbnail: string;
  status?: "PLAYING" | "ONGOING" | "COMPLETED";
};

export default function PlayingLesson({
  title,
  description,
  duration,
  progress,
  thumbnail,
//   status = "PLAYING",
}: PlayingLessonProps) {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {/* Thumbnail */}
        <View style={styles.thumbWrapper}>
          <Image source={{ uri: thumbnail }} style={styles.thumb} />
          <View style={styles.playOverlay}>
            <MaterialIcons
              name="play-circle-fill"
              size={36}
              color="#fff"
            />
          </View>
        </View>

        {/* Info */}
        <View style={styles.info}>
          <View style={styles.headerRow}>
            <Text style={styles.title} numberOfLines={1}>
              {title}
            </Text>

          </View>

          {description && (
            <Text style={styles.desc} numberOfLines={1}>
              {description}
            </Text>
          )}

          {duration && (
            <View style={styles.durationRow}>
              <MaterialIcons
                name="schedule"
                size={12}
                color="#9ca3af"
              />
              <Text style={styles.duration}>{duration}</Text>
            </View>
          )}
        </View>
      </View>

      {/* Progress (optional) */}
      {typeof progress === "number" && (
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              { width: `${Math.min(progress, 100)}%` },
            ]}
          />
        </View>
      )}
    </View>
  );
}

const PRIMARY = "#a1e633";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(161,230,51,0.1)",
    borderWidth: 1,
    borderColor: "rgba(161,230,51,0.3)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },

  row: {
    flexDirection: "row",
    gap: 16,
  },

  thumbWrapper: {
    width: 96,
    height: 64,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#e5e7eb",
  },

  thumb: {
    width: "100%",
    height: "100%",
  },

  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.25)",
    alignItems: "center",
    justifyContent: "center",
  },

  info: {
    flex: 1,
    minWidth: 0,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: {
    fontSize: 14,
    fontWeight: "800",
    flex: 1,
    marginRight: 6,
  },

  badge: {
    fontSize: 10,
    fontWeight: "800",
    backgroundColor: PRIMARY,
    color: "#161b0e",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    textTransform: "uppercase",
  },

  desc: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 4,
  },

  durationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 8,
  },

  duration: {
    fontSize: 10,
    color: "#9ca3af",
    fontWeight: "800",
    textTransform: "uppercase",
  },

  progressTrack: {
    marginTop: 12,
    height: 4,
    backgroundColor: "rgba(161,230,51,0.3)",
    borderRadius: 999,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    backgroundColor: PRIMARY,
    borderRadius: 999,
  },
});
