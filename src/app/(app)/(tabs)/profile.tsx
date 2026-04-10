import React from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { supabase } from "@/config/supabase";
import { useUser } from "@/context/UserContext";

const PRIMARY = "#a1e633";
const DARK = "#0f172a";

export default function ProfileScreen() {
  const router = useRouter();
  const { user } = useUser();

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const actions = [
    {
      icon: "payments" as const,
      title: "Earnings",
      subtitle: "Track payouts, balance, and completed work income.",
      onPress: () => router.push("/earnings"),
    },
    {
      icon: "history" as const,
      title: "Job History",
      subtitle: "Look back at completed and cancelled service requests.",
      onPress: () => router.push("/history"),
    },
    {
      icon: "school" as const,
      title: "Courses",
      subtitle: "Keep building your skills and unlock more XP.",
      onPress: () => router.push("/(app)/(tabs)/learn"),
    },
  ];

  const profileStats = [
    {
      label: "XP",
      value: `${(user as any)?.skill_points ?? 0}`,
    },
    {
      label: "Phone",
      value: user?.phone ?? "Not available",
    },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topBar}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={22} color={DARK} />
          </Pressable>
          <Text style={styles.topTitle}>Profile</Text>
          <View style={styles.topSpacer} />
        </View>

        <View style={styles.hero}>
          <View style={styles.heroGlow} />
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {(user?.name ?? "W").slice(0, 1).toUpperCase()}
            </Text>
          </View>

          <Text style={styles.name}>{user?.name ?? "Worker"}</Text>
          <Text style={styles.subtitle}>
            Manage your account, earnings, and work tools from one place.
          </Text>

          <View style={styles.xpPill}>
            <MaterialIcons name="workspace-premium" size={16} color="#365314" />
            <Text style={styles.xpText}>{(user as any)?.skill_points ?? 0} XP</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Workspace</Text>
          {actions.map((action) => (
            <Pressable key={action.title} style={styles.card} onPress={action.onPress}>
              <View style={styles.cardIcon}>
                <MaterialIcons name={action.icon} size={24} color="#365314" />
              </View>
              <View style={styles.cardCopy}>
                <Text style={styles.cardTitle}>{action.title}</Text>
                <Text style={styles.cardSubtitle}>{action.subtitle}</Text>
              </View>
              <MaterialIcons name="chevron-right" size={22} color="#94a3b8" />
            </Pressable>
          ))}
        </View>

        <Pressable style={styles.logoutButton} onPress={signOut}>
          <MaterialIcons name="logout" size={18} color="#dc2626" />
          <Text style={styles.logoutText}>Logout</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  container: {
    padding: 20,
    paddingBottom: 40,
    gap: 18,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    alignItems: "center",
    justifyContent: "center",
  },
  topTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: DARK,
  },
  topSpacer: {
    width: 46,
    height: 46,
  },
  hero: {
    position: "relative",
    overflow: "hidden",
    backgroundColor: "#ffffff",
    borderRadius: 32,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    padding: 24,
    alignItems: "center",
  },
  heroGlow: {
    position: "absolute",
    top: -40,
    right: -20,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "rgba(161,230,51,0.18)",
  },
  avatar: {
    width: 98,
    height: 98,
    borderRadius: 49,
    backgroundColor: "#d9f99d",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
    borderWidth: 4,
    borderColor: "#f7fee7",
  },
  avatarText: {
    fontSize: 38,
    fontWeight: "900",
    color: "#365314",
  },
  name: {
    fontSize: 28,
    fontWeight: "900",
    color: DARK,
  },
  subtitle: {
    marginTop: 8,
    textAlign: "center",
    color: "#64748b",
    lineHeight: 21,
    maxWidth: 280,
  },
  xpPill: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#ecfccb",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  xpText: {
    fontWeight: "800",
    color: "#365314",
  },
  statsRow: {
    width: "100%",
    marginTop: 20,
    gap: 10,
  },
  statCard: {
    backgroundColor: "#f8fafc",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: "#94a3b8",
    letterSpacing: 0.8,
  },
  statValue: {
    marginTop: 6,
    fontSize: 15,
    fontWeight: "800",
    color: DARK,
  },
  section: {
    gap: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: DARK,
    marginLeft: 4,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: "#ffffff",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    padding: 18,
  },
  cardIcon: {
    width: 50,
    height: 50,
    borderRadius: 18,
    backgroundColor: "#ecfccb",
    alignItems: "center",
    justifyContent: "center",
  },
  cardCopy: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: DARK,
  },
  cardSubtitle: {
    marginTop: 4,
    color: "#64748b",
    lineHeight: 19,
  },
  logoutButton: {
    marginTop: 6,
    backgroundColor: "#ffffff",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#fecaca",
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  logoutText: {
    color: "#dc2626",
    fontWeight: "800",
  },
});
