import { View, Text, StyleSheet, StatusBar, Image } from 'react-native'
import React, { useCallback, useState } from 'react'
import { useFocusEffect } from 'expo-router';
import { getUser } from '@/config/supabase';
import { useUser } from '@/context/UserContext';

const Header = () => {

    const [skillPoints, setSkillPoints] = useState(0);
    const { user } = useUser();
    
    useFocusEffect(
      useCallback(() => {
        const fetchPoints = async () => {
          const data = await getUser();
          setSkillPoints(data?.skill_points ?? 0);
        };
    
        fetchPoints();
      }, [])
    );
    
  return (
    <View style={styles.header}>
              <View style={styles.headerRow}>
                <View style={styles.profileRow}>
                  <Image
                    source={{
                      uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuAWXCc0O3_vkc_QlLSoXYUG2brus8jzI9FXyziLdOM7M_ueqYw8BkbVcxoJkv6IWlyIxAz6OILmlcnZOxE45H9TtJzrhJIiq4mfBhsS5w04xp7El0rtRAmfrFLKVERe-dxgZNcsEEU_mmtVMqq8EboNGJTiWtlD1T8mWnxnORelAC01dv9puNyw4nKVbDaHSuwXb5JnsaWk266zWrmqaNCqybPlPEgTeXV4f_7UEmefsVLH_2XpPex3w288TaL06cvIMLzLcxUj38A",
                    }}
                    style={styles.avatar}
                  />
                  <View>
                    <Text style={styles.welcome}>Welcome back,</Text>
                    <Text style={styles.username}>{user?.name.toUpperCase()}</Text>
                  </View>
                </View>
    
                <View style={styles.xpBox}>
                  <Text style={styles.xpLabel}>SKILL POINTS</Text>
                  <Text style={styles.xpValue}>⚡ {skillPoints} XP</Text>
                </View>
              </View>
            </View>
  )
}

export default Header

const PRIMARY = "#a1e633";
const DARK = "#161b0e";

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#f9f9f8",
    marginTop: StatusBar.currentHeight,
  },
  root: {
    flex: 1,
    backgroundColor: "#f9f9f8",
  },

  header: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 999,
  },

  welcome: {
    fontSize: 10,
    color: `${DARK}66`,
    fontWeight: "600",
  },

  username: {
    fontSize: 16,
    fontWeight: "800",
    color: DARK,
  },

  xpBox: {
    alignItems: "flex-end",
  },

  xpLabel: {
    fontSize: 8,
    fontWeight: "700",
    color: `${DARK}66`,
  },

  xpValue: {
    fontSize: 14,
    fontWeight: "800",
    color: DARK,
  },

  section: {
    gap: 16,
  },

  sectionHeader: {
    paddingHorizontal: 24,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: DARK,
  },

  primaryText: {
    fontSize: 10,
    color: PRIMARY,
    fontWeight: "700",
  },

  courseCard: {
    width: 280,
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 16,
    marginLeft: 24,
  },

  imageWrapper: {
    height: 128,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 12,
  },

  courseImage: {
    width: "100%",
    height: "100%",
  },

  tag: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },

  tagText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#fff",
  },

  courseTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: DARK,
  },

  lessonText: {
    fontSize: 10,
    color: `${DARK}66`,
    fontWeight: "700",
    marginBottom: 8,
  },

  progressBar: {
    height: 6,
    backgroundColor: "#f0f4e8",
    borderRadius: 999,
    overflow: "hidden",
    marginBottom: 12,
  },

  progressFill: {
    height: "100%",
    backgroundColor: PRIMARY,
  },

  primaryButton: {
    backgroundColor: PRIMARY,
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: "center",
  },

  primaryButtonText: {
    fontSize: 12,
    fontWeight: "800",
    color: DARK,
  },
});