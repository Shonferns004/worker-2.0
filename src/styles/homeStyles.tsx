import { Colors } from "@/utils/Constants";
import { StyleSheet } from "react-native";

export const homeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    marginTop: 30,
  },
  earningsCard: {
    marginHorizontal: 24,
    marginBottom: 12,
    borderRadius: 28,
    backgroundColor: "#0f172a",
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  earningsLabel: {
    color: "#a1e633",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.2,
  },
  earningsValue: {
    marginTop: 10,
    color: "#ffffff",
    fontSize: 28,
    fontWeight: "900",
  },
  earningsSub: {
    marginTop: 6,
    color: "#cbd5e1",
    fontSize: 13,
    fontWeight: "600",
  },
  scrollContainer: {
    backgroundColor: "white",
    paddingHorizontal: 10,
  },
});
