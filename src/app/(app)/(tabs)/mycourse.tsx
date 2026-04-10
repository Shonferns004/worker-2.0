import React, { useCallback, useMemo, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Header from "@/components/Header";
import { useI18n } from "@/i18n/I18nProvider";
import { generateCertificate, getEnrolledCourses } from "@/utils/api";
import { File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";
import { router, useFocusEffect } from "expo-router";

const courseCopy = {
  en: {
    eyebrow: "Achievements",
    title: "My Courses",
    subtitle: "Track completed learning and download certificates.",
    completedCourses: "Completed Courses",
    certifications: "professional certifications",
    downloadCertificate: "Download Certificate",
    certificateUnavailable: "Certificate Not Available",
    gettingReady: "Getting certificate ready...",
    downloading: "Downloading...",
    done: "Done",
    downloadAgain: "Download Again?",
    tryAgain: "Try Again",
  },
  hi: {
    eyebrow: "उपलब्धियां",
    title: "मेरे कोर्स",
    subtitle: "पूरा किया गया लर्निंग ट्रैक करें और सर्टिफिकेट डाउनलोड करें।",
    completedCourses: "पूर्ण कोर्स",
    certifications: "प्रोफेशनल सर्टिफिकेशन",
    downloadCertificate: "सर्टिफिकेट डाउनलोड करें",
    certificateUnavailable: "सर्टिफिकेट उपलब्ध नहीं",
    gettingReady: "सर्टिफिकेट तैयार किया जा रहा है...",
    downloading: "डाउनलोड हो रहा है...",
    done: "पूरा हुआ",
    downloadAgain: "फिर डाउनलोड करें?",
    tryAgain: "फिर प्रयास करें",
  },
  bn: {
    eyebrow: "অর্জন",
    title: "আমার কোর্স",
    subtitle: "সম্পন্ন শেখা ট্র্যাক করুন এবং সার্টিফিকেট ডাউনলোড করুন।",
    completedCourses: "সম্পন্ন কোর্স",
    certifications: "পেশাদার সার্টিফিকেশন",
    downloadCertificate: "সার্টিফিকেট ডাউনলোড করুন",
    certificateUnavailable: "সার্টিফিকেট উপলব্ধ নয়",
    gettingReady: "সার্টিফিকেট প্রস্তুত হচ্ছে...",
    downloading: "ডাউনলোড হচ্ছে...",
    done: "সম্পন্ন",
    downloadAgain: "আবার ডাউনলোড করবেন?",
    tryAgain: "আবার চেষ্টা করুন",
  },
  ta: {
    eyebrow: "சாதனைகள்",
    title: "என் பாடங்கள்",
    subtitle: "முடித்த கற்றலை கண்காணித்து சான்றிதழ்களை பதிவிறக்குங்கள்.",
    completedCourses: "முடிந்த பாடங்கள்",
    certifications: "தொழில்முறை சான்றிதழ்கள்",
    downloadCertificate: "சான்றிதழை பதிவிறக்கு",
    certificateUnavailable: "சான்றிதழ் இல்லை",
    gettingReady: "சான்றிதழ் தயாராகிறது...",
    downloading: "பதிவிறக்கப்படுகிறது...",
    done: "முடிந்தது",
    downloadAgain: "மீண்டும் பதிவிறக்கவா?",
    tryAgain: "மீண்டும் முயற்சிக்கவும்",
  },
  te: {
    eyebrow: "సాధనలు",
    title: "నా కోర్సులు",
    subtitle: "పూర్తి చేసిన లెర్నింగ్ ట్రాక్ చేసి సర్టిఫికెట్లు డౌన్‌లోడ్ చేయండి.",
    completedCourses: "పూర్తైన కోర్సులు",
    certifications: "ప్రొఫెషనల్ సర్టిఫికేషన్లు",
    downloadCertificate: "సర్టిఫికేట్ డౌన్‌లోడ్ చేయండి",
    certificateUnavailable: "సర్టిఫికేట్ అందుబాటులో లేదు",
    gettingReady: "సర్టిఫికేట్ సిద్ధం అవుతోంది...",
    downloading: "డౌన్‌లోడ్ అవుతోంది...",
    done: "పూర్తైంది",
    downloadAgain: "మళ్లీ డౌన్‌లోడ్ చేయాలా?",
    tryAgain: "మళ్లీ ప్రయత్నించండి",
  },
  mr: {
    eyebrow: "यश",
    title: "माझे कोर्स",
    subtitle: "पूर्ण केलेले शिक्षण ट्रॅक करा आणि सर्टिफिकेट डाउनलोड करा.",
    completedCourses: "पूर्ण कोर्स",
    certifications: "व्यावसायिक प्रमाणपत्रे",
    downloadCertificate: "सर्टिफिकेट डाउनलोड करा",
    certificateUnavailable: "सर्टिफिकेट उपलब्ध नाही",
    gettingReady: "सर्टिफिकेट तयार होत आहे...",
    downloading: "डाउनलोड होत आहे...",
    done: "पूर्ण",
    downloadAgain: "पुन्हा डाउनलोड कराल?",
    tryAgain: "पुन्हा प्रयत्न करा",
  },
} as const;

const PRIMARY = "#a1e633";
const BG_LIGHT = "#f9f9f8";
const TEXT_DARK = "#161b0e";

export default function CertificatesScreen() {
  const { language } = useI18n();
  const copy = useMemo(() => courseCopy[language] ?? courseCopy.en, [language]);
  const [myCourses, setMyCourses] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [buttonText, setButtonText] = useState(copy.downloadCertificate);

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
    }, []),
  );

  const handleDownload = async (id: any, name: any) => {
    if (loading) return;

    try {
      setLoading(true);
      setButtonText(copy.gettingReady);

      const url = await generateCertificate(id);
      if (!url) throw new Error("No URL returned");

      setButtonText(copy.downloading);

      const fileName = `${name}-${Date.now()}.pdf`;
      const destination = new File(Paths.document, fileName);

      await File.downloadFileAsync(url, destination);

      setButtonText(copy.done);
      setLoading(false);
      setButtonText(copy.downloadAgain);

      await Sharing.shareAsync(destination.uri);
    } catch (error) {
      console.log("Download failed", error);
      setButtonText(copy.tryAgain);
      setLoading(false);
    }
  };

  const completedCount = myCourses
    ? myCourses.filter((item: any) => item.completed_at !== null).length
    : 0;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        <Header
          eyebrow={copy.eyebrow}
          title={copy.title}
          subtitle={copy.subtitle}
        />

        <View style={styles.heroSection}>
          <View style={styles.heroIcon}>
            <Ionicons name="ribbon" size={50} color={PRIMARY} />
            <View style={styles.heroCheck}>
              <Ionicons name="checkmark" size={14} color={TEXT_DARK} />
            </View>
          </View>

          <Text style={styles.heroTitle}>{copy.completedCourses}</Text>
          <Text style={styles.heroSubtitle}>
            {completedCount} {copy.certifications}
          </Text>
        </View>

        {myCourses &&
          myCourses
            .filter((item: any) => item.completed_at !== null)
            .map((item: any) => {
              const course = item.courses;
              const hasCertificate = !!item.certificate_url;

              return (
                <TouchableOpacity
                  onPress={() => {
                    router.push({
                      pathname: "/(app)/(course)/enroll",
                      params: {
                        id: course.id,
                      },
                    });
                  }}
                  activeOpacity={0.8}
                  key={item.id}
                  style={styles.card}
                >
                  <View style={styles.cardRow}>
                    <Image source={{ uri: course.bannerurl }} style={styles.cardImage} />

                    <View style={styles.cardContent}>
                      <Text style={styles.badge}>
                        {course.level} • {course.category}
                      </Text>

                      <Text style={styles.cardTitle}>{course.name}</Text>

                      <View style={styles.progressRow}>
                        <View style={styles.progressBg}>
                          <View style={[styles.progressFill, { width: "100%" }]} />
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
                        handleDownload(course.id, course.name);
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
                        ? buttonText || copy.downloadCertificate
                        : copy.certificateUnavailable}
                    </Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              );
            })}

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
    marginTop: StatusBar.currentHeight,
  },
  container: {
    paddingBottom: 40,
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
    opacity: 0.5,
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
