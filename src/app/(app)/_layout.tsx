import React, { useEffect, useState } from "react";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { View, StyleSheet, StatusBar } from "react-native";
import { supabase } from "@/config/supabase";
import AppSplash from "@/components/SplashScreen";
import { registerDevicePushToken } from "@/service/notifications";
import "@/service/backgroundLocation";

SplashScreen.preventAutoHideAsync();

export default function AppLayout() {
  const router = useRouter();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const init = async () => {
      // artificial delay
      await new Promise((resolve) => setTimeout(resolve, 3000));

      const {
        data: { session },
      } = await supabase.auth.getSession();

      await SplashScreen.hideAsync();

      if (session) {
        registerDevicePushToken();
        router.replace("/(app)/(tabs)");
      } else {
        router.replace("/(app)/(auth)");
      }

      setShowSplash(false);
    };

    init();
  }, [router]);

  return (
    <View style={{ flex: 1 }}>
      <StatusBar backgroundColor="#a3e635" barStyle="dark-content" />
      {/* Navigation tree MUST always exist */}
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(course)" />
        <Stack.Screen name="(jobs)" />
        <Stack.Screen name="profile" />
      </Stack>

      {/* Splash as overlay */}
      {showSplash && (
        <View style={StyleSheet.absoluteFill}>
          <AppSplash />
        </View>
      )}
    </View>
  );
}
