import Header from "@/components/Header";
import { AllCoursesSection } from "@/components/courses/AllCourse";
import { ListCourse } from "@/components/courses/ChipList";
import CourseCard from "@/components/courses/CourseCard";
import { getUser } from "@/config/supabase";
import { useUser } from "@/context/UserContext";
import { getEnrolledCourses } from "@/utils/api";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";

export default function LearnTab() {
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  const [skillPoints, setSkillPoints] = useState(0);

  useFocusEffect(
    useCallback(() => {
      const fetchPoints = async () => {
        const data = await getUser();
        setSkillPoints(data?.skill_points ?? 0);
      };

      fetchPoints();
    }, []),
  );

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
        {/* HEADER */}
        <Header />

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

                  // Always show in-progress courses
                  if (progress < 100) return true;

                  // If completed_at doesn't exist, keep showing
                  if (!item.completed_at) return true;
                })
                .map((item, index) => {
                  const course = item.courses;

                  return (
                    <View key={index}>
                      <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>
                          Continue Learning
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
