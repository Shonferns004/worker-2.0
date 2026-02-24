import { getUser, getUserId, getUserPhone, supabase } from "@/config/supabase";
import { useUser } from "@/context/UserContext";
import { enrollCourse } from "@/utils/api";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
} from "react-native";

const SKEL_BASE = "#d1d5db"; // main skeleton (medium dark)
const SKEL_DARK = "#c0c4cc"; // slightly darker accents

export default function CourseScreen() {
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [checkingEnrollment, setCheckingEnrollment] = useState(true);
  const { user } = useUser();
  const { id } = useLocalSearchParams();
  const [isEnrolled, setIsEnrolled] = useState(false);
  const chapters = course?.course_json?.chapters ?? [];
  const [isCompleted, setIsCompleted] = useState(false);
    const [userData, setUserData] = useState(null)
    const [userName, setUserName] = useState("User");
      const [skillPoints, setSkillPoints] = useState(0);
    
  


  const router = useRouter();


useFocusEffect(
  useCallback(() => {
    const fetchPoints = async () => {
      const data = await getUser();
      setSkillPoints(data?.skill_points ?? 0);
    };

    fetchPoints();
  }, [])
);

  useEffect(() => {
    if (!id) return;

    const fetchCourse = async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .eq("id", id)
        .single();

      if (!error) setCourse(data);
      setLoading(false);
    };

    fetchCourse();
  }, [id]);

  useEffect(() => {
  if (!course) return;

  const checkEnrollment = async () => {
    setCheckingEnrollment(true);

    const uid = await getUserId();

    const { data } = await supabase
      .from("enrolled_courses")
      .select("completed_chapters")
      .eq("worker_id", uid)
      .eq("cid", course.id)
      .single();

    if (data) {
      setIsEnrolled(true);

      const completed = data.completed_chapters || [];
      const totalChapters = course.course_json?.chapters?.length || 0;

      if (completed.length === totalChapters && totalChapters > 0) {
        setIsCompleted(true);
      }
    }

    setCheckingEnrollment(false);
  };

  checkEnrollment();
}, [course]);


  const goToCourse = () => {
    router.push({
      pathname: "/(app)/(course)/enroll",
      params: { id: course.id },
    });
  };

  const handleEnroll = async () => {
    try {
      setEnrolling(true);
      await enrollCourse(course.id);
      setIsEnrolled(true);
      goToCourse();
    } catch (error) {
      console.log(error);
    } finally {
      setEnrolling(false);
    }
  };

  useEffect(() => {
  }, [course]);

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.container}>
          {/* Header skeleton */}
          <View style={styles.skelHeader} />

          {/* Banner skeleton */}
          <View style={styles.skelBanner} />

          {/* Title */}
          <View style={styles.skelTitle} />

          {/* Description */}
          <View style={styles.skelLine} />
          <View style={[styles.skelLine, { width: "80%" }]} />

          {/* Meta pills */}
          <View style={styles.skelMetaRow}>
            <View style={styles.skelPill} />
            <View style={styles.skelPill} />
            <View style={styles.skelPill} />
          </View>

          {/* Button skeleton */}
          <View style={styles.skelButton} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (!course) {
    return (
      <SafeAreaView style={styles.center}>
        <Text>Failed to load course</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.profileRow}>
            <View style={styles.avatar}>
              <Image
                source={{
                  uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuAWXCc0O3_vkc_QlLSoXYUG2brus8jzI9FXyziLdOM7M_ueqYw8BkbVcxoJkv6IWlyIxAz6OILmlcnZOxE45H9TtJzrhJIiq4mfBhsS5w04xp7El0rtRAmfrFLKVERe-dxgZNcsEEU_mmtVMqq8EboNGJTiWtlD1T8mWnxnORelAC01dv9puNyw4nKVbDaHSuwXb5JnsaWk266zWrmqaNCqybPlPEgTeXV4f_7UEmefsVLH_2XpPex3w288TaL06cvIMLzLcxUj38A",
                }}
                style={styles.avatarImage}
              />
            </View>

            <View>
              <Text style={styles.profileLabel}>Learner Profile</Text>
              <Text style={styles.profileName}>{user?.name.toUpperCase()}</Text>
            </View>
          </View>

          <View style={styles.xpPill}>
            <Ionicons name="boat" size={14} color="#161b0e" />
            <Text style={styles.xpText}>⚡ {skillPoints} XP</Text>
          </View>
        </View>

        {/* BANNER */}

        {/* COURSE CARD */}
        <View style={styles.card}>
          <Image
            source={{ uri: course?.bannerurl }}
            style={styles.banner}
            resizeMode="cover"
          />

          <View style={styles.cardHeader}>
            <View style={{ flex: 1 }}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>Premium Course</Text>
              </View>

              <Text style={styles.title}>{course.name}</Text>
            </View>

            <View style={styles.iconCircle}>
              <Ionicons name="code" size={30} color="#161b0e" />
            </View>
          </View>

          <Text style={styles.description}>{course.description}</Text>

          {/* META */}
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Ionicons name="layers-outline" size={14} color="#a1e633" />
              <Text style={styles.metaText}>{course.chapters} CHAPTERS</Text>
            </View>

            <View style={styles.metaItem}>
              <Ionicons name="bar-chart-outline" size={14} color="#a1e633" />
              <Text style={styles.metaText}>{course.level.toUpperCase()}</Text>
            </View>

            {course.include_video && (
              <View style={styles.metaItem}>
                <Ionicons name="videocam-outline" size={14} color="#a1e633" />
                <Text style={styles.metaText}>VIDEO</Text>
              </View>
            )}
          </View>

          {isCompleted ? (
  <View>
    <TouchableOpacity
    // onPress={handleDownloadCertificate}
    style={styles.startBtn}
  >
    <Ionicons name="document-text-outline" size={20} color="#161b0e" />
    <Text style={styles.startText}>DOWNLOAD CERTIFICATE</Text>
  </TouchableOpacity>
    <TouchableOpacity
    onPress={goToCourse}
    style={styles.startBtn}
  >
    <Ionicons name="play-circle-outline" size={20} color="#161b0e" />
    <Text style={styles.startText}>GO TO COURSE</Text>
  </TouchableOpacity>
  </View>
) : (
  <TouchableOpacity
    disabled={checkingEnrollment || enrolling}
    onPress={isEnrolled ? goToCourse : handleEnroll}
    style={[
      styles.startBtn,
      (checkingEnrollment || enrolling) && { opacity: 0.6 },
    ]}
  >
    {checkingEnrollment ? (
      <Text style={styles.startText}>CHECKING ACCESS...</Text>
    ) : enrolling ? (
      <Text style={styles.startText}>PROCESSING...</Text>
    ) : (
      <>
        <Ionicons name="play-circle-outline" size={20} color="#161b0e" />
        <Text style={styles.startText}>
          {isEnrolled ? "START LEARNING" : "ENROLL NOW"}
        </Text>
      </>
    )}
  </TouchableOpacity>
)}

        </View>
        {/* CHAPTER TIMELINE */}
        {
          isCompleted ? "":(
            <View style={styles.timelineSection}>
          <Text style={styles.timelineTitle}>Learning Journey</Text>

          <View style={styles.timelineContainer}>
            {/* Vertical line */}
            <View style={styles.timelineLine} />

            {chapters.map((chapter: any, index: number) => (
              <View key={index} style={styles.timelineItem}>
                <View style={styles.timelineDot}>
                  <Text style={styles.timelineDotText}>{index + 1}</Text>
                </View>

                <View style={styles.timelineContent}>
                  <Text style={styles.chapterTitle}>{chapter.chapterName}</Text>

                  <Text style={styles.chapterDuration}>{chapter.duration}</Text>

                  {chapter.topics?.map((topic: string, i: number) => (
                    <View key={i} style={styles.topicRow}>
                      <View style={styles.topicBullet} />
                      <Text style={styles.topicText}>{topic}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>
        </View>
          )
        }
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { maxWidth: 430, alignSelf: "center", padding: 24 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },

  header: {
    paddingTop: 32,
    paddingBottom: 24,
    gap: 24,
  },
  profileRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "rgba(161,230,51,0.3)",
  },
  avatarImage: { width: "100%", height: "100%" },
  profileLabel: { fontSize: 10, fontWeight: "700", opacity: 0.5 },
  profileName: { fontSize: 16, fontWeight: "900" },

  xpPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#a1e633",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
  },
  xpText: { marginLeft: 6, fontSize: 12, fontWeight: "900" },

  searchRow: { flexDirection: "row", gap: 12, alignItems: "center" },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e2e8d8",
    alignItems: "center",
    justifyContent: "center",
  },
  searchBox: { flex: 1 },
  searchIcon: { position: "absolute", left: 12, top: 14, opacity: 0.4 },
  searchInput: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e2e8d8",
    borderRadius: 999,
    paddingVertical: 12,
    paddingLeft: 40,
    paddingRight: 16,
    fontWeight: "600",
  },

  banner: {
    width: "100%",
    height: 192,
    borderRadius: 32,
    marginBottom: 24,
    overflow: "hidden",
  },

  card: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e2e8d8",
    borderRadius: 40,
    padding: 24,
    marginBottom: 32,
  },
  cardHeader: { flexDirection: "row", justifyContent: "space-between" },
  badge: {
    backgroundColor: "rgba(161,230,51,0.15)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  badgeText: { fontSize: 9, fontWeight: "900", color: "#a1e633" },
  title: { fontSize: 24, fontWeight: "900" },

  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#a1e633",
    alignItems: "center",
    justifyContent: "center",
  },

  description: { marginTop: 16, fontSize: 14, opacity: 0.6 },

  metaRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 16 },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#e2e8d8",
  },
  metaText: { fontSize: 10, fontWeight: "900", opacity: 0.7 },

  startBtn: {
    marginTop: 24,
    backgroundColor: "#a1e633",
    paddingVertical: 16,
    borderRadius: 999,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  startText: { fontWeight: "900", fontSize: 14 },
  timelineSection: {
    marginBottom: 48,
  },

  timelineTitle: {
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 24,
  },

  timelineContainer: {
    position: "relative",
    paddingLeft: 32,
  },

  timelineLine: {
    position: "absolute",
    left: 14,
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: "#a1e633",
  },

  timelineItem: {
    flexDirection: "row",
    marginBottom: 32,
  },

  timelineDot: {
    position: "absolute",
    left: -32,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#a1e633",
    alignItems: "center",
    justifyContent: "center",
  },

  timelineDotText: {
    fontSize: 12,
    fontWeight: "900",
    color: "#161b0e",
  },

  timelineContent: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e2e8d8",
    borderRadius: 24,
    padding: 16,
    width: "100%",
  },

  chapterTitle: {
    fontSize: 14,
    fontWeight: "900",
    marginBottom: 4,
  },

  chapterDuration: {
    fontSize: 10,
    fontWeight: "700",
    opacity: 0.5,
    marginBottom: 8,
  },

  topicRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },

  topicBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#a1e633",
    marginRight: 8,
  },

  topicText: {
    fontSize: 12,
    opacity: 0.7,
  },
  skelHeader: {
    height: 80,
    borderRadius: 20,
    backgroundColor: SKEL_BASE,
    marginBottom: 24,
    marginTop: 30,
  },

  skelBanner: {
    height: 450,
    borderRadius: 32,
    backgroundColor: SKEL_BASE,
    marginBottom: -50,
  },

  skelTitle: {
    height: 28,
    width: "70%",
    borderRadius: 8,
    backgroundColor: SKEL_DARK,
    marginBottom: 16,
  },

  skelLine: {
    height: 14,
    width: "100%",
    borderRadius: 6,
    backgroundColor: SKEL_BASE,
    marginBottom: 8,
  },

  skelMetaRow: {
    flexDirection: "row",
    gap: 8,
    marginVertical: 16,
  },

  skelPill: {
    height: 28,
    width: 90,
    borderRadius: 999,
    backgroundColor: SKEL_DARK,
  },

  skelButton: {
    height: 56,
    borderRadius: 999,
    backgroundColor: SKEL_DARK,
    marginTop: 24,
  },
});
