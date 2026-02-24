import { useEffect } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing
} from "react-native-reanimated";



export function CourseCard({ image, title, lessons, onPress, isLoading }: any) {

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
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={{ uri: image }} style={styles.image} />
      <Text style={styles.title} numberOfLines={2}>
        {title}
      </Text>
      <Text style={styles.meta}>{lessons} Lessons</Text>
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
