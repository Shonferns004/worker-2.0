import { Ionicons } from "@expo/vector-icons";
import { useEffect } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing
} from "react-native-reanimated";


export function ListCourse({
  image,
  title,
  meta,
  duration,
  onStart,
  isLoading,
}: any) {
  const opacity = useSharedValue(0.3);
    
    useEffect(() => {
      opacity.value = withRepeat(
        withTiming(1, { duration: 1000 }),
        -1,
        true
      );
    }, []);
    
    const style = useAnimatedStyle(() => ({
      opacity: opacity.value,
    }));
    
      if (isLoading) {
        return <Animated.View style={[styles.skeleton, style]} />;
      }
  
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.8}>
      <Image source={{ uri: image }} style={styles.image} />

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>

        <Text style={styles.meta} numberOfLines={1}>
          {meta}
        </Text>

        <View style={styles.footer}>
          <Text style={styles.duration}>
            <Ionicons name="time-outline" size={12} /> {duration}
          </Text>

          <TouchableOpacity
            style={styles.startButton}
            onPress={onStart}
            activeOpacity={0.8}
          >
            <Ionicons name="play" size={12} color="#161b0e" />
            <Text style={styles.startText}>Start Learning</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}


const PRIMARY = "#a1e633";
const DARK = "#161b0e";

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    gap: 16,
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 24,
  },

  image: {
    width: 96,
    height: 96,
    borderRadius: 16,
  },

  content: {
    flex: 1,
    gap: 6,
    justifyContent: "space-between",
  },

  title: {
    fontSize: 16,
    fontWeight: "800",
    color: DARK,
  },

  meta: {
    fontSize: 10,
    fontWeight: "700",
    color: `${DARK}66`,
  },

  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  duration: {
    fontSize: 10,
    fontWeight: "700",
    color: `${DARK}66`,
  },

  startButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: PRIMARY,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },

  startText: {
    fontSize: 10,
    fontWeight: "800",
    color: DARK,
  },
  skeleton: {
   flexDirection: "row",
    gap: 16,
    backgroundColor: "#eee",
    padding: 12,
    borderRadius: 24,
    height:100
  },
});
