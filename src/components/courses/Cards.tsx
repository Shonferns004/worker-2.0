import { useEffect, useMemo } from "react";
import { Image, StyleSheet, Text, TouchableOpacity } from "react-native";
import { useI18n } from "@/i18n/I18nProvider";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

const copyMap = {
  en: { lessons: "Lessons" },
  hi: { lessons: "पाठ" },
  bn: { lessons: "পাঠ" },
  ta: { lessons: "பாடங்கள்" },
  te: { lessons: "పాఠాలు" },
  mr: { lessons: "धडे" },
} as const;

export function CourseCard({ image, title, lessons, onPress, isLoading }: any) {
  const { language } = useI18n();
  const copy = useMemo(() => copyMap[language] ?? copyMap.en, [language]);
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(withTiming(1, { duration: 1000 }), -1, true);
  }, []);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  if (isLoading) {
    return <Animated.View style={[styles.skeleton, style]} />;
  }

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={{ uri: image }} style={styles.image} />
      <Text style={styles.title} numberOfLines={2}>
        {title}
      </Text>
      <Text style={styles.meta}>
        {lessons} {copy.lessons}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 12,
    gap: 8,
  },
  image: {
    height: 120,
    borderRadius: 14,
  },
  title: {
    fontSize: 14,
    fontWeight: "800",
    color: "#161b0e",
  },
  meta: {
    fontSize: 10,
    fontWeight: "700",
    color: "#161b0e66",
  },
  skeleton: {
    width: "48%",
    height: 200,
    borderRadius: 20,
    backgroundColor: "#eee",
  },
});
