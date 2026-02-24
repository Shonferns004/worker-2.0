import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import React, { useEffect } from "react";
import { useRouter } from "expo-router";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  cancelAnimation,
} from "react-native-reanimated";

type Props = {
  courseId?: string;
  image?: string;
  tag?: string;
  title?: string;
  progress?: number; // percentage (0–100)
  isLoading?: boolean;
};

function CourseCard({
  courseId,
  image,
  tag,
  title,
  progress = 0,
  isLoading = false,
}: Props) {
  const router = useRouter();
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    if (isLoading) {
      opacity.value = withRepeat(
        withTiming(1, { duration: 1000 }),
        -1,
        true
      );
    } else {
      cancelAnimation(opacity); // ✅ stop animation when not loading
      opacity.value = 1;        // ✅ reset opacity
    }
  }, [isLoading]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  // Skeleton Loading (unchanged)
  if (isLoading) {
    return <Animated.View style={[styles.skeleton, animatedStyle]} />;
  }

  // Clamp progress safely between 0 and 100
  const safeProgress = Math.min(100, Math.max(0, progress));

  return (
    <View style={styles.courseCard}>
      <View style={styles.imageWrapper}>
        <Image source={{ uri: image }} style={styles.courseImage} />
        <View style={styles.tag}>
          <Text style={styles.tagText}>{tag}</Text>
        </View>
      </View>

      <Text style={styles.courseTitle}>{title}</Text>
      <Text style={styles.lessonText}>{safeProgress}% Completed</Text>

      <View style={styles.progressBar}>
        <View
          style={[
            styles.progressFill,
            { width: `${safeProgress}%` },
          ]}
        />
      </View>

      <TouchableOpacity
        onPress={() => {
          if (!courseId) return; // unchanged guard
          router.push({
            pathname: "/(app)/(course)/[id]",
            params: { id: courseId },
          });
        }}
        style={styles.primaryButton}
      >
        <Text style={styles.primaryButtonText}>
          {safeProgress === 100 ? "Completed ✓" : "Continue ▶"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default CourseCard;

const PRIMARY = "#a1e633";
const DARK = "#161b0e";

const styles = StyleSheet.create({
  courseCard: {
    width: 280,
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 16,
    marginLeft: 24,
  },

  imageWrapper: {
    height: 128,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 12,
  },

  courseImage: {
    width: "100%",
    height: "100%",
  },

  tag: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },

  tagText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#fff",
  },

  courseTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: DARK,
  },

  lessonText: {
    fontSize: 10,
    color: `${DARK}66`,
    fontWeight: "700",
    marginBottom: 8,
  },

  progressBar: {
    height: 6,
    backgroundColor: "#f0f4e8",
    borderRadius: 999,
    overflow: "hidden",
    marginBottom: 12,
  },

  progressFill: {
    height: "100%",
    backgroundColor: PRIMARY,
  },

  primaryButton: {
    backgroundColor: PRIMARY,
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: "center",
  },

  primaryButtonText: {
    fontSize: 12,
    fontWeight: "800",
    color: DARK,
  },

  skeleton: {
    width: 280,
    height: 200,
    borderRadius: 20,
    backgroundColor: "#eee",
    marginLeft: 24,
  },
});
