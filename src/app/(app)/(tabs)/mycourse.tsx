import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Header from "@/components/Header";
import { StatusBar } from "react-native";
import { generateCertificate, getEnrolledCourses } from "@/utils/api";
import { File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";
import { router } from "expo-router";
import { useFocusEffect } from "expo-router";
import { useCallback } from "react";


const PRIMARY = "#a1e633";
const BG_LIGHT = "#f9f9f8";
const CARD_DARK = "#252c1a";
const TEXT_DARK = "#161b0e";

export default function CertificatesScreen() {
  const [myCourses, setMyCourses] = useState<any>(null)
  const [loading, setLoading] = useState(false);
    const [buttonText, setButtonText] = useState("GET CERTIFICATE");

  useFocusEffect(
  useCallback(() => {
    let isActive = true;

    const fetchMyCourses = async () => {
      const res = await getEnrolledCourses();
      if (isActive) {
        setMyCourses(res);
      }
    };

    fetchMyCourses();

    return () => {
      isActive = false;
    };
  }, [])
);


  
  const handleDownload = async (id:any,name:any) => {
      if (loading) return;
  
      try {
        setLoading(true);
        setButtonText("Getting certificate ready...");
  
        const url = await generateCertificate(id);
        if (!url) throw new Error("No URL returned");
  
        setButtonText("Downloading...");
  
        const fileName = `${name}-${Date.now()}.pdf`;
        const destination = new File(Paths.document, fileName);
  
        await File.downloadFileAsync(url, destination);
  
        setButtonText("Done ✓");
  
        setLoading(false);
        
        setButtonText("Download Again?");
  
        await Sharing.shareAsync(destination.uri);
  
  
  
  
      } catch (error) {
        console.log("Download failed", error);
        setButtonText("Try Again");
        setLoading(false);
      }
    };

    console.log(myCourses?.[0])
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {/* HEADER */}
        <Header/>

        {/* HERO */}
        <View style={styles.heroSection}>
          <View style={styles.heroIcon}>
            <Ionicons name="ribbon" size={50} color={PRIMARY} />
            <View style={styles.heroCheck}>
              <Ionicons name="checkmark" size={14} color={TEXT_DARK} />
            </View>
          </View>

          <Text style={styles.heroTitle}>Completed Courses</Text>
          <Text style={styles.heroSubtitle}>
  You've unlocked{" "}
  {myCourses
    ? myCourses.filter((item: any) => item.completed_at !== null).length
    : 0}{" "}
  professional certifications
</Text>

        </View>

        {/* CERTIFICATE CARD */}
        {myCourses &&
  myCourses
    .filter((item: any) => item.completed_at !== null)
    .map((item: any, index: number) => {
      const course = item.courses;
      const hasCertificate = !!item.certificate_url;

      return (
        <TouchableOpacity onPress={()=>{
          router.push({
            pathname: '/(app)/(course)/enroll',
            params: {
              id: course.id
            }
          })
        }} activeOpacity={0.8} key={item.id} style={styles.card}>
          <View style={styles.cardRow}>
            <Image
              source={{ uri: course.bannerurl }}
              style={styles.cardImage}
            />

            <View style={styles.cardContent}>
              <Text style={styles.badge}>
                {course.level} • {course.category}
              </Text>

              <Text style={styles.cardTitle}>
                {course.name}
              </Text>

              <View style={styles.progressRow}>
                <View style={styles.progressBg}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: "100%" },
                    ]}
                  />
                </View>
                <Text style={styles.percent}>100%</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            disabled={!hasCertificate}
            style={[
              styles.downloadBtn,
              !hasCertificate && { opacity: 0.4 },
            ]}
            onPress={() => {
              if (hasCertificate) {
                handleDownload(course.id, course.name)
              }
            }}
          >
            <Ionicons
              name="download-outline"
              size={16}
              color={TEXT_DARK}
            />
            <Text style={styles.downloadText}>
              {hasCertificate
                ? "Download Certificate"
                : "Certificate Not Available"}
            </Text>
          </TouchableOpacity>
        </TouchableOpacity>
      );
    })}


        {/* Bottom Pill */}
        <View style={styles.bottomWrapper}>
          <View style={styles.bottomBar} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: BG_LIGHT,
    marginTop: StatusBar.currentHeight
  },
  container: {
    paddingBottom: 40,
  },

  header: {
    paddingTop: 32,
    paddingHorizontal: 24,
    paddingBottom: 24,
    gap: 24,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  profileRow: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "rgba(161,230,51,0.2)",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  welcome: {
    fontSize: 10,
    fontWeight: "600",
    opacity: 0.4,
  },
  name: {
    fontSize: 16,
    fontWeight: "800",
  },
  xpBlock: { alignItems: "flex-end" },
  skillLabel: {
    fontSize: 8,
    fontWeight: "700",
    opacity: 0.4,
    textTransform: "uppercase",
  },
  xpRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  xpText: {
    fontSize: 14,
    fontWeight: "800",
  },

  searchWrapper: {
    position: "relative",
  },
  searchIcon: {
    position: "absolute",
    left: 16,
    top: 14,
  },
  searchInput: {
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 14,
    paddingLeft: 44,
    paddingRight: 16,
    fontSize: 14,
    fontWeight: "500",
  },

  heroSection: {
    alignItems: "center",
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  heroIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "rgba(161,230,51,0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  heroCheck: {
    position: "absolute",
    top: -4,
    right: -4,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: PRIMARY,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 4,
    borderColor: BG_LIGHT,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: "800",
  },
  heroSubtitle: {
    fontSize: 14,
    opacity: 0.4,
    marginTop: 6,
    textAlign: "center",
  },

  card: {
    backgroundColor: "#fff",
    marginHorizontal: 24,
    marginBottom: 16,
    padding: 16,
    borderRadius: 24,
  },
  cardRow: {
    flexDirection: "row",
    gap: 16,
  },
  cardImage: {
    width: 80,
    height: 80,
    borderRadius: 16,
  },
  cardContent: {
    flex: 1,
    justifyContent: "center",
  },
  badge: {
    fontSize: 10,
    fontWeight: "700",
    color: PRIMARY,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "800",
  },

  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
  },
  progressBg: {
    flex: 1,
    height: 6,
    backgroundColor: "#f0f4e8",
    borderRadius: 999,
    overflow: "hidden",
  },
  progressFill: {
    width: "100%",
    height: "100%",
    backgroundColor: PRIMARY,
  },
  percent: {
    fontSize: 10,
    fontWeight: "800",
  },

  downloadBtn: {
    marginTop: 16,
    backgroundColor: "#f0f4e8",
    paddingVertical: 14,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  downloadText: {
    fontSize: 12,
    fontWeight: "800",
  },

  bottomWrapper: {
    alignItems: "center",
    marginTop: 24,
  },
  bottomBar: {
    width: 128,
    height: 4,
    borderRadius: 999,
    backgroundColor: "rgba(22,27,14,0.1)",
  },
});
