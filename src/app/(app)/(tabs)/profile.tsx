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
import { useI18n } from "@/i18n/I18nProvider";
import { Language } from "@/i18n/translations";
const DARK = "#0f172a";

export default function ProfileScreen() {
  const router = useRouter();
  const { user } = useUser();
  const { language, setLanguage, t } = useI18n();

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const actions = [
    {
      icon: "payments" as const,
      title: t("profile.earningsTitle"),
      subtitle: t("profile.earningsSubtitle"),
      onPress: () => router.push("/earnings"),
    },
    {
      icon: "history" as const,
      title: t("profile.historyTitle"),
      subtitle: t("profile.historySubtitle"),
      onPress: () => router.push("/history"),
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
          <Text style={styles.topTitle}>{t("common.profile")}</Text>
          <View style={styles.topSpacer} />
        </View>

        <View style={styles.hero}>
          <View style={styles.heroGlow} />
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {(user?.name ?? "W").slice(0, 1).toUpperCase()}
            </Text>
          </View>

          <Text style={styles.name}>{user?.name ?? t("home.workerFallback")}</Text>
          <Text style={styles.subtitle}>{t("profile.heroSubtitle")}</Text>

          <View style={styles.xpPill}>
            <MaterialIcons name="workspace-premium" size={16} color="#365314" />
            <Text style={styles.xpText}>{(user as any)?.skill_points ?? 0} XP</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("common.language")}</Text>
          <View style={styles.languageRow}>
            {([
              ["en", t("common.english")],
              ["hi", t("common.hindi")],
              ["bn", t("common.bengali")],
              ["ta", t("common.tamil")],
              ["te", t("common.telugu")],
              ["mr", t("common.marathi")],
            ] as [Language, string][]).map(([code, label]) => {
              const active = language === code;
              return (
                <Pressable
                  key={code}
                  style={[
                    styles.languageChip,
                    active && styles.languageChipActive,
                  ]}
                  onPress={() => setLanguage(code)}
                >
                  <Text
                    style={[
                      styles.languageChipText,
                      active && styles.languageChipTextActive,
                    ]}
                  >
                    {label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("profile.workspace")}</Text>
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
          <Text style={styles.logoutText}>{t("common.logout")}</Text>
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
  section: {
    gap: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: DARK,
    marginLeft: 4,
  },
  languageRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  languageChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    backgroundColor: "#ffffff",
  },
  languageChipActive: {
    borderColor: "#84cc16",
    backgroundColor: "#ecfccb",
  },
  languageChipText: {
    fontWeight: "700",
    color: "#475569",
  },
  languageChipTextActive: {
    color: "#365314",
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
    gap: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: DARK,
  },
  cardSubtitle: {
    color: "#64748b",
    lineHeight: 20,
  },
  logoutButton: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: "#ffffff",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#fecaca",
    paddingVertical: 16,
  },
  logoutText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#dc2626",
  },
});
