import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { supabase } from "@/config/supabase";
import { useUser } from "@/context/UserContext";

const PRIMARY = "#a1e633";
const BG_LIGHT = "#f6f7f2";
const BG_DARK = "#12140e";
const SURFACE_LIGHT = "#ffffff";
const SURFACE_DARK = "#1c2115";
const TEXT_LIGHT = "#1a1d16";

export default function ProfileScreen() {

  const [showLogoutModal, setShowLogoutModal] = useState(false);
      const { user } = useUser();
  




  const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new Error(error.message);
  }
};
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.avatarWrapper}>
            <View style={styles.avatar}>
              <Image
                source={{
                  uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuAWXCc0O3_vkc_QlLSoXYUG2brus8jzI9FXyziLdOM7M_ueqYw8BkbVcxoJkv6IWlyIxAz6OILmlcnZOxE45H9TtJzrhJIiq4mfBhsS5w04xp7El0rtRAmfrFLKVERe-dxgZNcsEEU_mmtVMqq8EboNGJTiWtlD1T8mWnxnORelAC01dv9puNyw4nKVbDaHSuwXb5JnsaWk266zWrmqaNCqybPlPEgTeXV4f_7UEmefsVLH_2XpPex3w288TaL06cvIMLzLcxUj38A",
                }}
                style={styles.avatarImage}
              />
            </View>

            <TouchableOpacity style={styles.editButton}>
              <MaterialIcons name="edit" size={14} color="#161b0e" />
            </TouchableOpacity>
          </View>

          <View style={styles.profileInfo}>
            <Text style={styles.name}>{user?.name}</Text>

            <View style={styles.xpPill}>
              <Text style={styles.skillLabel}>Skill Points</Text>
              <Text style={styles.xpText}>{(user as any)?.skill_points} XP</Text>
            </View>
          </View>
        </View>

        {/* PROFILE SETTINGS */}
        <Section title="Profile Settings">
          <MenuItem icon="person" label="Edit Profile" />
          <MenuItem icon="settings" label="Account Settings" />
        </Section>

        {/* LEARNING & BILLING */}
        

        {/* LOGOUT */}
        <View style={styles.logoutWrapper}>
          <TouchableOpacity onPress={()=>setShowLogoutModal(true)} style={styles.logoutButton}>
            <MaterialIcons name="logout" size={18} color="#ef4444" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>

          <Text style={styles.version}>App Version 2.4.0</Text>
        </View>

        {/* BOTTOM PILL */}
        <View style={styles.bottomWrapper}>
          <View style={styles.bottomBar} />
        </View>
      </ScrollView>
      {showLogoutModal && (
  <View style={styles.modalOverlay}>
    <View style={styles.modalCard}>
      <Text style={styles.modalTitle}>Logout</Text>
      <Text style={styles.modalMessage}>
        Are you sure you want to log out?
      </Text>

      <View style={styles.modalActions}>
        <TouchableOpacity
          style={styles.cancelBtn}
          onPress={() => setShowLogoutModal(false)}
        >
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.confirmBtn}
          onPress={() => {
            setShowLogoutModal(false);
            signOut();
          }}
        >
          <Text style={styles.confirmText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
)}

    </SafeAreaView>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={{ marginBottom: 24 }}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionCard}>{children}</View>
    </View>
  );
}

function MenuItem({
  icon,
  label,
  last,
}: {
  icon: any;
  label: string;
  last?: boolean;
}) {
  return (
    <TouchableOpacity
      style={[
        styles.menuItem,
        !last && styles.menuDivider,
      ]}
      activeOpacity={0.7}
    >
      <View style={styles.menuLeft}>
        <View style={styles.menuIcon}>
          <MaterialIcons name={icon} size={20} color="#689f10" />
        </View>
        <Text style={styles.menuText}>{label}</Text>
      </View>

      <MaterialIcons
        name="chevron-right"
        size={20}
        color="rgba(22,27,14,0.2)"
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: BG_LIGHT,
    marginTop: StatusBar.currentHeight,
  },
  container: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },

  /* HEADER */
  header: {
    flexDirection: "row",
    gap: 16,
    paddingTop: 32,
    paddingBottom: 24,
  },
  avatarWrapper: {
    position: "relative",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "rgba(161,230,51,0.2)",
    backgroundColor: SURFACE_LIGHT,
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  editButton: {
    position: "absolute",
    bottom: -4,
    right: -4,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  profileInfo: {
    justifyContent: "center",
    gap: 6,
  },
  name: {
    fontSize: 20,
    fontWeight: "800",
  },
  xpPill: {
    flexDirection: "row",
    gap: 8,
    backgroundColor: "#eef6db",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
    alignItems: "center",
  },
  skillLabel: {
    fontSize: 10,
    fontWeight: "800",
    textTransform: "uppercase",
    opacity: 0.5,
  },
  xpText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#689f10",
  },

  /* SECTION */
  sectionTitle: {
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1,
    opacity: 0.4,
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  sectionCard: {
    backgroundColor: SURFACE_LIGHT,
    borderRadius: 16,
    overflow: "hidden",
  },

  /* MENU ITEM */
  menuItem: {
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  menuDivider: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(161,230,51,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  menuText: {
    fontSize: 14,
    fontWeight: "600",
  },

  /* LOGOUT */
  logoutWrapper: {
    marginTop: 16,
    alignItems: "center",
  },
  logoutButton: {
    width: "100%",
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(239,68,68,0.2)",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  logoutText: {
    color: "#ef4444",
    fontWeight: "800",
    fontSize: 14,
  },
  version: {
    marginTop: 24,
    fontSize: 11,
    opacity: 0.3,
  },

  /* BOTTOM */
  bottomWrapper: {
    alignItems: "center",
    marginTop: 24,
  },
  bottomBar: {
    width: 128,
    height: 6,
    borderRadius: 999,
    backgroundColor: "rgba(22,27,14,0.1)",
  },
  modalOverlay: {
  position: "absolute",
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: "rgba(0,0,0,0.4)",
  justifyContent: "center",
  alignItems: "center",
  padding: 24,
},

modalCard: {
  width: "100%",
  backgroundColor: "#fff",
  borderRadius: 20,
  padding: 24,
},

modalTitle: {
  fontSize: 18,
  fontWeight: "800",
  marginBottom: 8,
},

modalMessage: {
  fontSize: 14,
  opacity: 0.6,
  marginBottom: 24,
},

modalActions: {
  flexDirection: "row",
  justifyContent: "flex-end",
  gap: 12,
},

cancelBtn: {
  paddingVertical: 10,
  paddingHorizontal: 16,
  borderRadius: 12,
  backgroundColor: "#f2f2f2",
},

cancelText: {
  fontWeight: "700",
},

confirmBtn: {
  paddingVertical: 10,
  paddingHorizontal: 16,
  borderRadius: 12,
  backgroundColor: "#ef4444",
},

confirmText: {
  color: "#fff",
  fontWeight: "700",
},

});
