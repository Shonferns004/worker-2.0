import React, { useMemo } from "react";
import { Tabs } from "expo-router";
import { Dimensions, Platform, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';


const { height: screenHeight } = Dimensions.get("window");

const TabLayout = () => {
  const insets = useSafeAreaInsets();

  const baseTabHeight = screenHeight * 0.068;

  const tabHeight = useMemo(() => {
    const min = Platform.OS === "ios" ? 48 : 50;
    const max = 58;
    return Math.min(Math.max(baseTabHeight, min), max) + insets.bottom;
  }, [baseTabHeight, insets.bottom]);

  const iconSize = useMemo(() => {
    const usableHeight = tabHeight - insets.bottom;
    return Math.min(Math.max(usableHeight * 0.4, 21), 26);
  }, [insets.bottom, tabHeight]);

  const tabPaddingTop = useMemo(() => {
    return screenHeight < 700 ? 2 : 4;
  }, []);

  const tabItemPaddingBottom = useMemo(() => {
    return insets.bottom > 0 ? Math.max(2, insets.bottom * 0.08) : 2;
  }, [insets.bottom]);

  return (
    <Tabs
      screenOptions={{
        freezeOnBlur: true,
        tabBarActiveTintColor: "#a1e633",
        tabBarInactiveTintColor: "black",
        tabBarShowLabel: false,
        tabBarLabelStyle: {
          fontSize: 12,
        },
        tabBarStyle: {
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: "#e5e7eb",
          width: "100%",
          height: tabHeight,
          paddingBottom: insets.bottom,
          paddingTop: tabPaddingTop,
          backgroundColor: "#ffffff",
        },
        tabBarItemStyle: {
          justifyContent: "center",
          alignItems: "center",
          paddingBottom: tabItemPaddingBottom,
        },
        headerStyle: {
          height: 60,
        },
        headerTitleStyle: {
          fontSize: 22,
          fontWeight: "700",
          marginLeft: 10,
        },
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons 
              name={focused ? "home-variant" : "home-variant-outline"}
              size={iconSize}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="learn"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "book" : "book-outline"}
              size={iconSize}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="mycourse"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "school" : "school-outline"}
              size={iconSize}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          href: null,
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={iconSize}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabLayout;
