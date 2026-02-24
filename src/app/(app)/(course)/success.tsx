import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { generateCertificate, getCourseById } from "@/utils/api";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";


const PRIMARY = "#a1e633";
const DARK_ACCENT = "#161b0e";
const BG_LIGHT = "#fcfdfa";
const BORDER_LIGHT = "#e2e8d8";

export default function SuccessScreen() {
    const {id} = useLocalSearchParams();
    const [loading, setLoading] = useState(false);
  const [buttonText, setButtonText] = useState("GET CERTIFICATE");
    const [courseInfo, setCourseInfo] = useState<any>(null);

    useFocusEffect(
      useCallback(() => {
        const fetchCourse = async () => {
          try {
            setLoading(true);
            const data = await getCourseById(id);
            setCourseInfo(data.course?.[0] ?? null);
            setLoading(false);
          } catch (error) {
            console.error(error);
          }
        };
    
        if (id) {
          fetchCourse();
        }
      }, [id])
    );
    
  

  const handleDownload = async () => {
    if (loading) return;

    try {
      setLoading(true);
      setButtonText("Getting certificate ready...");

      const url = await generateCertificate(id);
      if (!url) throw new Error("No URL returned");

      setButtonText("Downloading...");

      const fileName = `certificate-${Date.now()}.pdf`;
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
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.container}>
        <View style={styles.main}>
          
          {/* Icon Circle */}
          <View style={styles.iconWrapper}>
            <MaterialIcons name="check" size={64} color={DARK_ACCENT} />
          </View>

          {/* Title */}
          <Text style={styles.title}>Success!</Text>

          {/* Subtitle */}
          <Text style={styles.subtitle}>
            You've successfully completed{"\n"}
            <Text style={styles.highlight}>
              {courseInfo?.name}
            </Text>
          </Text>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
  onPress={handleDownload}
  activeOpacity={0.9}
  disabled={loading}
  style={[
    styles.primaryButton,
    loading && { opacity: 0.7 }
  ]}
>
  <Text style={styles.primaryButtonText}>
    {buttonText}
  </Text>
</TouchableOpacity>


            <TouchableOpacity onPress={()=>{
              router.replace('/(app)/(tabs)/learn')
            }} style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>
                BACK TO COURSES
              </Text>
            </TouchableOpacity>
          </View>

        </View>

        {/* Bottom Pill */}
        <View style={styles.bottomBarWrapper}>
          <View style={styles.bottomBar} />
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: BG_LIGHT,
  },

  container: {
    flex: 1,
    maxWidth: 430,
    alignSelf: "center",
    paddingBottom: 40,
    backgroundColor: BG_LIGHT,
  },

  main: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },

  iconWrapper: {
    width: 128,
    height: 128,
    borderRadius: 9999,
    backgroundColor: PRIMARY,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 32,
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 12,
  },

  title: {
    fontSize: 36,
    fontWeight: "900",
    color: DARK_ACCENT,
    marginBottom: 16,
    letterSpacing: -0.5,
  },

  subtitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "rgba(22,27,14,0.6)",
    textAlign: "center",
    marginBottom: 48,
  },

  highlight: {
    color: DARK_ACCENT,
    fontWeight: "700",
  },

  buttonContainer: {
    width: "100%",
    gap: 16,
  },

  primaryButton: {
    width: "100%",
    backgroundColor: PRIMARY,
    paddingVertical: 20,
    borderRadius: 9999,
    alignItems: "center",
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 8,
  },

  primaryButtonText: {
    fontWeight: "900",
    fontSize: 18,
    color: DARK_ACCENT,
  },

  secondaryButton: {
    width: "100%",
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: BORDER_LIGHT,
    paddingVertical: 20,
    borderRadius: 9999,
    alignItems: "center",
  },

  secondaryButtonText: {
    fontWeight: "900",
    fontSize: 18,
    color: DARK_ACCENT,
  },

  bottomBarWrapper: {
    alignItems: "center",
    paddingBottom: 8,
  },

  bottomBar: {
    width: 128,
    height: 6,
    borderRadius: 9999,
    backgroundColor: "rgba(22,27,14,0.05)",
  },
});
