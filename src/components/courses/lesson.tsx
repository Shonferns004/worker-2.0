import React, { useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";

type Props = {
  title: string;
};

export default function LessonItem({ title }: Props) {
  return (
    <View style={[styles.row]}>
      <View style={[styles.icon]}>
        <MaterialIcons name={"lock"} size={18} color={"#9ca3af"} />
      </View>

      <View style={{ flex: 1 }}>
        <Text style={[styles.muted]}>{title}</Text>
      </View>
    </View>
  );
}

const PRIMARY = "#a1e633";

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 16,
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },

  active: {
    backgroundColor: "rgba(161,230,51,0.15)",
    borderColor: "rgba(161,230,51,0.3)",
  },

  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
  },

  // playIcon: { backgroundColor: PRIMARY },

  title: { fontWeight: "700" },
  muted: { color: "#6b7280" },

  subtitle: {
    fontSize: 10,
    color: "#9ca3af",
    fontWeight: "700",
  },

  playing: {
    color: PRIMARY,
    fontWeight: "800",
  },
});
