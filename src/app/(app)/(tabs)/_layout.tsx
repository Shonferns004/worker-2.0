import React from "react";
import { Tabs } from "expo-router";
import { Platform } from "react-native";
// import { House } from 'phosphor-react-native'
import { Ionicons } from "@expo/vector-icons";

const TabLayout = () => {
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
          borderTopWidth: 1,
          width: "100%",
          height: Platform.OS == "ios" ? 70 : 70,
        },
        headerStyle: {
          height: 60,
        },
        headerTitleStyle: {
          fontSize: 22,
          fontWeight: 700,
          marginLeft: 10,
        },
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="learn"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "book" : "book-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
  name="mycourse"
  options={{
    headerShown: false,
    tabBarIcon: ({ color, size, focused }) => (
      <Ionicons
        name={focused ? "school" : "school-outline"}
        size={size}
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
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabLayout;
