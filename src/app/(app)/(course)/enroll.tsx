import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { getCourseById } from "@/utils/api";
import { SelectedChapterIndexContext } from "@/context/SelectedChapterContext";
import { useFocusEffect } from "expo-router";
import { useCallback } from "react";

const PRIMARY = "#a1e633";

export default function CurriculumScreen() {
  const { id } = useLocalSearchParams();
  const [courseInfo, setCourseInfo] = useState<any>(null);
  const [enrolledCourses, setEnrolledCourses] = useState<any>(null);
  const context = useContext(SelectedChapterIndexContext);
  const [loading, setLoading] = useState(true);

  if (!context) {
    throw new Error(
      "SelectedChapterIndexContext must be used within its Provider",
    );
  }

  const { selectedIndex, setSelectedIndex } = context;

  useFocusEffect(
    useCallback(() => {
      const fetchCourse = async () => {
        try {
          setLoading(true);
          const data = await getCourseById(id);
          setCourseInfo(data.course?.[0] ?? null);
          setEnrolledCourses(data.enrolled_courses?.[0] ?? null);
          setLoading(false);
        } catch (error) {
          console.error(error);
        }
      };

      if (id) {
        fetchCourse();
      }
    }, [id]),
  );

  const chapters = courseInfo?.course_json?.chapters ?? [];

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ fontWeight: "600" }}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* <StatusBar translucent /> */}
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <TouchableOpacity
              onPress={() => {
                router.back();
              }}
              style={styles.backButton}
            >
              <MaterialIcons name="arrow-back" size={22} color="#161b0e" />
            </TouchableOpacity>

            <View>
              <Text style={styles.chapter}>CURRICULUM</Text>
              <Text style={styles.title}>
                {courseInfo?.course_name || "Course"}
              </Text>
            </View>
          </View>
        </View>

        {/* CHAPTER CARDS */}
        {chapters.map((chapter: any, index: number) => {
          const topicCount = chapter.topics?.length ?? 0;
          const totalDuration = chapter?.duration ?? 0;

          const completedChapters = enrolledCourses?.completed_chapters || [];

          const isUnlocked =
            index === 0 || completedChapters.includes(index - 1);

          const isCompleted = completedChapters.includes(index);

          return (
            <TouchableOpacity
              key={index}
              onPress={() => {
                setSelectedIndex(index);
                router.push({
                  pathname: "/(app)/(course)/content",
                  params: { id },
                });
              }}
              style={[styles.card, !isUnlocked && styles.lockedCard]}
              activeOpacity={isUnlocked ? 0.7 : 1}
              disabled={!isUnlocked}
            >
              <View style={styles.cardRow}>
                <View
                  style={[
                    styles.iconCircle,
                    !isUnlocked && styles.iconCircleLocked,
                  ]}
                >
                  <MaterialIcons
                    name={
                      isCompleted
                        ? "check-circle"
                        : isUnlocked
                          ? "menu-book"
                          : "lock"
                    }
                    size={22}
                    color={
                      isCompleted ? "#16a34a" : isUnlocked ? PRIMARY : "#9ca3af"
                    }
                  />
                </View>

                <View style={styles.textContainer}>
                  <Text
                    style={[
                      styles.cardTitle,
                      !isUnlocked && styles.lockedTitle,
                    ]}
                    numberOfLines={2}
                  >
                    {chapter.chapterName}
                  </Text>

                  <Text
                    style={[
                      styles.cardSubtitle,
                      !isUnlocked && styles.lockedSubtitle,
                    ]}
                  >
                    {topicCount} Topics • {totalDuration}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}

        <View style={styles.bottomIndicatorWrapper}>
          <View style={styles.bottomIndicator} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f6f3",
    marginTop: StatusBar.currentHeight,
  },
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 28,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 9999,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e2e8d8",
    justifyContent: "center",
    alignItems: "center",
  },
  chapter: {
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.5,
    color: PRIMARY,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    color: "#161b0e",
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#e2e8d8",
    marginBottom: 18,
  },
  lockedCard: {
    backgroundColor: "#f0f1ed",
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  textContainer: {
    flex: 1,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 9999,
    backgroundColor: "rgba(161,230,51,0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  iconCircleLocked: {
    backgroundColor: "#e6e7e3",
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#161b0e",
  },
  lockedTitle: {
    color: "#9ca3af",
  },
  cardSubtitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "rgba(22,27,14,0.5)",
  },
  lockedSubtitle: {
    color: "#b4b7ae",
  },
  bottomIndicatorWrapper: {
    marginTop: 40,
    alignItems: "center",
  },
  bottomIndicator: {
    width: 128,
    height: 6,
    borderRadius: 9999,
    backgroundColor: "rgba(22,27,14,0.05)",
  },
});
