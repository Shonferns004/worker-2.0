import Header from "@/components/Header";
import { AllCoursesSection } from "@/components/courses/AllCourse";
import CourseCard from "@/components/courses/CourseCard";
import { useI18n } from "@/i18n/I18nProvider";
import { getEnrolledCourses } from "@/utils/api";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from "react-native";

const courseCopy = {
  en: {
    eyebrow: "Skills Hub",
    title: "Learn",
    subtitle: "Pick up new skills and keep your momentum going.",
    continueLearning: "Continue Learning",
  },
  hi: {
    eyebrow: "स्किल्स हब",
    title: "सीखें",
    subtitle: "नई स्किल सीखें और अपनी प्रगति जारी रखें।",
    continueLearning: "सीखना जारी रखें",
  },
  bn: {
    eyebrow: "স্কিলস হাব",
    title: "শিখুন",
    subtitle: "নতুন স্কিল শিখুন এবং আপনার অগ্রগতি বজায় রাখুন।",
    continueLearning: "শেখা চালিয়ে যান",
  },
  ta: {
    eyebrow: "திறன் மையம்",
    title: "கற்போம்",
    subtitle: "புதிய திறன்களை கற்று உங்கள் முன்னேற்றத்தை தொடருங்கள்.",
    continueLearning: "கற்றலை தொடருங்கள்",
  },
  te: {
    eyebrow: "స్కిల్స్ హబ్",
    title: "నేర్చుకోండి",
    subtitle: "కొత్త నైపుణ్యాలు నేర్చుకుని మీ పురోగతిని కొనసాగించండి.",
    continueLearning: "నేర్చుకోవడం కొనసాగించండి",
  },
  mr: {
    eyebrow: "स्किल्स हब",
    title: "शिका",
    subtitle: "नवीन कौशल्ये शिका आणि तुमची प्रगती सुरू ठेवा.",
    continueLearning: "शिकणे सुरू ठेवा",
  },
} as const;

export default function LearnTab() {
  const { language } = useI18n();
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const copy = useMemo(() => courseCopy[language] ?? courseCopy.en, [language]);

  useFocusEffect(
    useCallback(() => {
      let active = true;

      const fetchEnrolled = async () => {
        setLoading(true);
        const res = await getEnrolledCourses();

        if (active) {
          setEnrolledCourses(res ?? []);
          setLoading(false);
        }
      };

      fetchEnrolled();

      return () => {
        active = false;
      };
    }, []),
  );

  const calculateProgress = (item: any) => {
    const completed = item.completed_chapters ?? [];
    const total = item.courses?.course_content?.length ?? 0;

    if (!total) return 0;

    const unique = [...new Set(completed)];
    const valid = unique.filter((i: any) => i >= 0 && i < total);

    return Math.round((valid.length / total) * 100);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Header
          eyebrow={copy.eyebrow}
          title={copy.title}
          subtitle={copy.subtitle}
        />

        {loading ? (
          <View style={styles.section}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {[1, 2].map((_, index) => (
                <CourseCard key={index} isLoading />
              ))}
            </ScrollView>
          </View>
        ) : (
          <View style={styles.section}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {enrolledCourses
                .filter((item) => {
                  const progress = calculateProgress(item);
                  if (progress < 100) return true;
                  if (!item.completed_at) return true;
                })
                .map((item, index) => {
                  const course = item.courses;

                  return (
                    <View key={index}>
                      <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>
                          {copy.continueLearning}
                        </Text>
                      </View>
                      <CourseCard
                        key={course.id}
                        courseId={course.id}
                        image={course.bannerurl}
                        tag={course.category}
                        title={course.name}
                        progress={calculateProgress(item)}
                      />
                    </View>
                  );
                })}
            </ScrollView>
          </View>
        )}

        <AllCoursesSection />
      </ScrollView>
    </SafeAreaView>
  );
}

const DARK = "#161b0e";

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#f9f9f8",
    marginTop: StatusBar.currentHeight,
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
});
