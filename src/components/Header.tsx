import { View, Text, StyleSheet, Image } from "react-native";
import React, { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { getUser } from "@/config/supabase";
import { useUser } from "@/context/UserContext";

type HeaderProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
};

const Header = ({ eyebrow, title, subtitle }: HeaderProps) => {
  const [skillPoints, setSkillPoints] = useState(0);
  const { user } = useUser();

  useFocusEffect(
    useCallback(() => {
      const fetchPoints = async () => {
        const data = await getUser();
        setSkillPoints(data?.skill_points ?? 0);
      };

      fetchPoints();
    }, []),
  );

  return (
    <View style={styles.header}>
      <View style={styles.heroCard}>
        <View style={styles.topRow}>
          <View style={styles.profileRow}>
            <View style={styles.avatarShell}>
              <Image
                source={{
                  uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuAWXCc0O3_vkc_QlLSoXYUG2brus8jzI9FXyziLdOM7M_ueqYw8BkbVcxoJkv6IWlyIxAz6OILmlcnZOxE45H9TtJzrhJIiq4mfBhsS5w04xp7El0rtRAmfrFLKVERe-dxgZNcsEEU_mmtVMqq8EboNGJTiWtlD1T8mWnxnORelAC01dv9puNyw4nKVbDaHSuwXb5JnsaWk266zWrmqaNCqybPlPEgTeXV4f_7UEmefsVLH_2XpPex3w288TaL06cvIMLzLcxUj38A",
                }}
                style={styles.avatar}
              />
            </View>

            <View style={styles.copy}>
              <Text style={styles.eyebrow}>{eyebrow.toUpperCase()}</Text>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.subtitle}>{subtitle}</Text>
            </View>
          </View>

          <View style={styles.xpPill}>
            <Ionicons name="flash" size={14} color="#365314" />
            <Text style={styles.xpText}>{skillPoints} XP</Text>
          </View>
        </View>

        <View style={styles.footerRow}>
          <View style={styles.userChip}>
            <Ionicons name="person-circle-outline" size={15} color="#365314" />
            <Text style={styles.userChipText}>
              {(user?.name ?? "Worker").toUpperCase()}
            </Text>
          </View>

          <View style={styles.sparkBadge}>
            <Ionicons name="sparkles" size={14} color="#0f172a" />
          </View>
        </View>
      </View>
    </View>
  );
};

export default Header;

const DARK = "#161b0e";

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 12,
  },
  heroCard: {
    backgroundColor: "#ffffff",
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 20,
    shadowColor: "#0f172a",
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
    gap: 16,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    flex: 1,
  },
  avatarShell: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: "#ecfccb",
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 14,
  },
  copy: {
    flex: 1,
    gap: 3,
  },
  eyebrow: {
    fontSize: 10,
    fontWeight: "800",
    color: "#84a13a",
    letterSpacing: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "900",
    color: DARK,
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 18,
    color: "#64748b",
    maxWidth: 240,
  },
  xpPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#ecfccb",
  },
  xpText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#365314",
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  userChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  userChipText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#334155",
  },
  sparkBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#a1e633",
    alignItems: "center",
    justifyContent: "center",
  },
});
