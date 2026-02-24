import React, { useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { SelectedChapterIndexContext } from "@/context/SelectedChapterContext";
import { router } from "expo-router";

type Props = {
  title: string;
  progressText: string;
  isOpen: boolean;
  onToggle: () => void;
  index:any;
  id:any;
  children?: React.ReactNode;
};

export default function ChapterAccordion({
  title,
  progressText,
  isOpen,
  onToggle,
  children,
  index,
  id
}: Props) {

  const context = useContext(SelectedChapterIndexContext);
    if (!context) {
      throw new Error(
        "SelectedChapterIndexContext must be used within its Provider",
      );
    }
  
    const { setSelectedIndex } = context;
  return (
    <View style={styles.card}>
      <TouchableOpacity style={styles.cardHeader} onPress={onToggle}>
        <View>
          <TouchableOpacity onPress={()=>{
            setSelectedIndex(index)
            router.push({
              pathname:"/(app)/(course)/content",
              params:{
                id: id
              }
            })
          }}>
            <Text style={styles.cardTitle}>{title}</Text>
          </TouchableOpacity>
          <Text
            style={[
              styles.cardProgress,
              progressText === "0% Complete" && styles.muted,
            ]}
          >
            {progressText}
          </Text>
        </View>

        <MaterialIcons
          name={isOpen ? "expand-less" : "expand-more"}
          size={22}
          color="#9ca3af"
        />
      </TouchableOpacity>

      {isOpen && <View style={styles.cardBody}>{children}</View>}
    </View>
  );
}

const PRIMARY = "#a1e633";

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginBottom: 16,
    overflow: "hidden",
  },

  cardHeader: {
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#f9fafb",
  },

  cardTitle: { fontSize: 14, fontWeight: "800" },

  cardProgress: {
    fontSize: 10,
    fontWeight: "800",
    color: PRIMARY,
  },

  muted: { color: "#9ca3af" },

  cardBody: { padding: 16, gap: 12 },
});
