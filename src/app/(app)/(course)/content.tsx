  import React, { useContext, useEffect, useState } from "react";
  import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    Dimensions,
    StatusBar,
  } from "react-native";
  import { router, useLocalSearchParams } from "expo-router";
  import YoutubePlayer from "react-native-youtube-iframe";
  import RenderHTML from "react-native-render-html";
  import { getCourseById, getSkillPoints, markChapterComplete, updateSkillPoints } from "@/utils/api";
  import { SelectedChapterIndexContext } from "@/context/SelectedChapterContext";
  import { SafeAreaView } from "react-native";

  const PRIMARY = "#a1e633";
  const DARK = "#161b0e";
  const { width } = Dimensions.get("window");

  export default function NowPlayingScreen() {
    const { id } = useLocalSearchParams();
    const [courseInfo, setCourseInfo] = useState<any>(null);
    const [enrolledCourses, setEnrolledCourses] = useState<any>(null)
    const [playingIndex, setPlayingIndex] = useState(0);
    const [openedIndex, setOpenedIndex] = useState<number[]>([0]);
    const [openedTopics, setOpenedTopics] = useState<number[]>([0]);
    const [watchedVideos, setWatchedVideos] = useState<number[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const { nextIndex } = useLocalSearchParams();

    
    


    



    

    const context = useContext(SelectedChapterIndexContext);
    if (!context) {
      throw new Error("Context must be used inside provider");

      

    }

    const { selectedIndex,setSelectedIndex } = context;

    useEffect(() => {
      if (!id) return;

      const fetchCourse = async () => {
        const data = await getCourseById(id);
        setCourseInfo(data.course?.[0]);
        setEnrolledCourses(data.enrolled_courses?.[0]);
  
      };

      fetchCourse();
    }, [id]);

    useEffect(() => {
  if (nextIndex !== undefined) {
    setSelectedIndex(Number(nextIndex));
  }
}, [nextIndex]);
    




    const toggleTopic = (index: number) => {
    if (openedTopics.includes(index)) {
      // Collapse
      setOpenedTopics(prev => prev.filter(i => i !== index));
    } else {
      // Expand
      setOpenedTopics(prev => [...prev, index]);
    }
  };

 
    const courseContent = courseInfo?.course_content ?? [];
    const safeIndex =
  selectedIndex >= 0 && selectedIndex < courseContent.length
    ? selectedIndex
    : 0;

const currentChapter = courseContent[safeIndex];
    const videoData = currentChapter?.youtubeVideos ?? [];
    const topics = currentChapter?.topics ?? [];

    const allVideosWatched =
  videoData.length > 0 &&
  watchedVideos.length === videoData.length;



    const currentVideo = videoData?.[playingIndex];

  const markAsCompleted = async () => {
    
  try {
    if (!id) throw new Error("Course ID missing");
    if (selectedIndex === undefined || selectedIndex === null)
      throw new Error("Invalid chapter index");

    if (!enrolledCourses) {
      throw new Error("Enrollment data not loaded yet");
    }

    const completedChapters = Array.isArray(
      enrolledCourses?.completed_chapters
    )
      ? [...enrolledCourses.completed_chapters]
      : [];

    // prevent duplicate
    if (completedChapters.includes(selectedIndex)) {
      console.log("Chapter already completed");
      return;
    }

    completedChapters.push(selectedIndex);

    await markChapterComplete(id, selectedIndex);

  } catch (error: any) {
    console.error("Error marking chapter:", error.message);
  }
};



const isLastChapter =
  selectedIndex === courseContent.length - 1;

  const handleComplete = async () => {
  if (isProcessing) return;
  setIsProcessing(true);

  try {
    await markAsCompleted();

    if (isLastChapter) {
      await updateSkillPoints(id);
       router.replace({
        pathname: "/(app)/(course)/success",
        params: { id },
      });
    } else {
       router.replace({
        pathname: "/(app)/(course)/content",
        params: { id, nextIndex: selectedIndex + 1 },
      });
    }
  } finally {
    setIsProcessing(false);
  }
};




    return (
      <SafeAreaView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>

          {/* HEADER */}
          <View style={styles.header}>
            <Text style={styles.nowPlaying}>NOW PLAYING</Text>
            <Text style={styles.title}>
              {currentChapter?.chapterName}
            </Text>
          </View>

          {/* YOUTUBE PLAYER */}
          {currentVideo && (
            <View style={styles.playerWrapper}>
              <YoutubePlayer
              key={`${id}-${selectedIndex}-${playingIndex}`}
                height={220}
                play={true}
                videoId={currentVideo.videoId}
                onChangeState={(state:any) => {

  if (state === "ended") {

    if (!watchedVideos.includes(playingIndex)) {
      setWatchedVideos(prev => [...prev, playingIndex]);
    }
  }
}}

              />
            </View>
          )}

          {/* VIDEO SELECTOR */}
          <View style={styles.videoHeader}>
            <Text style={styles.videoLabel}>VIDEO TUTORIALS</Text>
            <Text style={styles.videoCount}>
              {videoData.length} LESSONS
            </Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.videoScroll}
          >
            {videoData.map((video: any, index: number) => {
              const active = index === playingIndex;

              return (
                <TouchableOpacity
                  key={video.videoId}
                  style={[
                    styles.videoCard,
                    active && styles.activeBorder,
                    !active && styles.inactiveCard,
                  ]}
                  onPress={() => setPlayingIndex(index)}
                >
                  <Image
                    source={{ uri: video.thumbnail }}
                    style={styles.thumbnail}
                  />

                  <View style={styles.playOverlay}>
                    <View
                      style={[
                        styles.playButton,
                        active && styles.playButtonActive,
                      ]}
                    />
                  </View>

                  <Text
                    style={[
                      styles.videoTitle,
                      active && { color: PRIMARY },
                    ]}
                    numberOfLines={2}
                  >
                    {video.title}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <Text style={{ marginBottom: 10, fontSize: 12 }}>
  Watched: {watchedVideos.length} / {videoData.length}
</Text>


          {/* TOPIC CONTENT */}
        <View style={styles.contentSection}>
    {topics.map((topic: any, index: number) => {
      const isOpen = openedTopics.includes(index);

      return (
        <View
          key={index}
          style={{
            marginBottom: 20,
            borderRadius: 20,
            backgroundColor: "#f0f7e6",
            overflow: "hidden",
          }}
        >
          {/* HEADER */}
          <TouchableOpacity
            onPress={() => toggleTopic(index)}
            style={{
              padding: 20,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={{ fontWeight: "bold", fontSize: 16 }}>
              {index + 1}. {topic.topic}
            </Text>

            <Text style={{ fontSize: 18, color: PRIMARY }}>
              {isOpen ? "−" : "+"}
            </Text>
          </TouchableOpacity>

          {/* CONTENT */}
          {isOpen && (
            <View style={{ paddingHorizontal: 20, paddingBottom: 20 }}>
              <RenderHTML
                contentWidth={width - 60}
                source={{ html: topic.content }}
                baseStyle={{ lineHeight: 28 }}
              />
            </View>
          )}
        </View>
      );
    })}
  </View>

  <TouchableOpacity
  // disabled={!allVideosWatched}
  // style={[
  //   styles.completeButton,
  //   !allVideosWatched && styles.completeButtonDisabled,
  // ]}
  style={styles.completeButton}
  onPress={handleComplete}

>
  <Text style={styles.completeButtonText}>
    {isLastChapter ? "Course Completed 🎉" : "Mark Chapter as Complete"}
  </Text>
</TouchableOpacity>




          <View style={{ height: 40 }} />

        </ScrollView>
      </SafeAreaView>
    );
  }

  /* ---------------- STYLES ---------------- */

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fcfdfa",
      paddingHorizontal: 20,
      marginTop: StatusBar.currentHeight,
    },
    completeButton: {
  marginTop: 20,
  backgroundColor: PRIMARY,
  padding: 18,
  borderRadius: 16,
  alignItems: "center",
},

completeButtonDisabled: {
  backgroundColor: "#cdd8b5",
},

completeButtonText: {
  fontWeight: "bold",
  fontSize: 16,
  color: "#161b0e",
},


    header: {
      paddingTop: 40,
      paddingBottom: 20,
    },

    nowPlaying: {
      fontSize: 10,
      fontWeight: "900",
      letterSpacing: 2,
      color: PRIMARY,
    },

    title: {
      fontSize: 20,
      fontWeight: "900",
      color: DARK,
    },

    playerWrapper: {
      borderRadius: 24,
      overflow: "hidden",
      marginBottom: 20,
    },

    videoHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 12,
    },

    videoLabel: {
      fontSize: 12,
      fontWeight: "900",
      color: "rgba(22,27,14,0.4)",
    },

    videoCount: {
      fontSize: 10,
      fontWeight: "700",
      color: PRIMARY,
    },

    videoScroll: {
      gap: 16,
      paddingBottom: 20,
    },

    videoCard: {
      width: 260,
    },

    activeBorder: {
      borderWidth: 2,
      borderColor: PRIMARY,
      borderRadius: 20,
      padding: 2,
    },

    inactiveCard: {
      opacity: 0.6,
    },

    thumbnail: {
      width: 260,
      height: 150,
      borderRadius: 20,
    },

    playOverlay: {
      position: "absolute",
      top: 55,
      left: 110,
    },

    playButton: {
      width: 56,
      height: 56,
      borderRadius: 9999,
      backgroundColor: "#ffffff",
    },

    playButtonActive: {
      backgroundColor: PRIMARY,
    },

    videoTitle: {
      marginTop: 12,
      fontWeight: "900",
    },

    contentSection: {
      marginTop: 20,
    },
  });
