import { Colors } from "@/utils/Constants";
import { StyleSheet } from "react-native";

export const homeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    marginTop: 30,
  },
  scrollContainer: {
    backgroundColor: "white",
    paddingHorizontal: 10,
  },
});
