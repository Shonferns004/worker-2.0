import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useCallback, useMemo, useState } from "react";
import { useFocusEffect, useRouter } from "expo-router";

import { getCourses, getEnrolledCourses } from "@/utils/api";
import { calculateTotalDuration } from "@/lib/duration";
import { useI18n } from "@/i18n/I18nProvider";
import { CourseCard } from "./Cards";
import { ListCourse } from "./ChipList";

const copyMap = {
  en: { allCourses: "All Courses", lessons: "Lessons" },
  hi: { allCourses: "सभी कोर्स", lessons: "पाठ" },
  bn: { allCourses: "সব কোর্স", lessons: "পাঠ" },
  ta: { allCourses: "அனைத்து பாடங்கள்", lessons: "பாடங்கள்" },
  te: { allCourses: "అన్ని కోర్సులు", lessons: "పాఠాలు" },
  mr: { allCourses: "सर्व कोर्स", lessons: "धडे" },
} as const;

export function AllCoursesSection() {
  const { language } = useI18n();
  const copy = useMemo(() => copyMap[language] ?? copyMap.en, [language]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"list" | "card">("card");

  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      let active = true;

      const fetchData = async () => {
        setLoading(true);

        const [allCourses, enrolled] = await Promise.all([
          getCourses(),
          getEnrolledCourses(),
        ]);

        if (!active) return;

        const enrolledSet = new Set((enrolled ?? []).map((e: any) => e.courses.id));
        const filteredCourses = (allCourses ?? []).filter(
          (course: any) => !enrolledSet.has(course.id),
        );

        setCourses(filteredCourses);
        setLoading(false);
      };

      fetchData();

      return () => {
        active = false;
      };
    }, []),
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{copy.allCourses}</Text>

        <View style={styles.toggleRow}>
          <TouchableOpacity
            style={[styles.toggleBtn, view === "card" && styles.toggleActive]}
            onPress={() => setView("card")}
          >
            <Text>{"\u2630"}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.toggleBtn, view === "list" && styles.toggleActive]}
            onPress={() => setView("list")}
          >
            <Text>{"\u2261"}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.content, view === "card" && styles.cardGrid]}>
        {loading
          ? Array.from({ length: 4 }).map((_, i) =>
              view === "list" ? (
                <ListCourse key={i} isLoading />
              ) : (
                <CourseCard key={i} isLoading />
              ),
            )
          : courses.map((course) =>
              view === "list" ? (
                <ListCourse
                  key={course.id}
                  image={course.bannerurl}
                  title={course.name}
                  meta={`${course.category} • ${course.chapters} ${copy.lessons}`}
                  duration={calculateTotalDuration(course.course_json?.chapters)}
                  onStart={() =>
                    router.push({
                      pathname: "/(app)/(course)/[id]",
                      params: { id: course.id },
                    })
                  }
                />
              ) : (
                <CourseCard
                  key={course.id}
                  image={course.bannerurl}
                  title={course.name}
                  lessons={course.chapters}
                  onPress={() =>
                    router.push({
                      pathname: "/(app)/(course)/[id]",
                      params: { id: course.id },
                    })
                  }
                />
              ),
            )}
      </View>
    </View>
  );
}

const PRIMARY = "#a1e633";
const DARK = "#161b0e";

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    marginTop: 20,
    gap: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: DARK,
  },
  toggleRow: {
    flexDirection: "row",
    gap: 8,
  },
  toggleBtn: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: "#fff",
  },
  toggleActive: {
    backgroundColor: PRIMARY,
  },
  content: {
    gap: 12,
  },
  cardGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
});
