import React, { useState } from "react";
import { Slot, Stack } from "expo-router";
import { UserProvider } from "@/context/UserContext";
import { SelectedChapterIndexContext } from "@/context/SelectedChapterContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WSProvider } from "@/service/webSocket";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const queryClient = new QueryClient();

export default function RootLayout() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <QueryClientProvider client={queryClient}>
    <UserProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
      <SelectedChapterIndexContext.Provider
        value={{ selectedIndex, setSelectedIndex }}
      >
        <Slot />
      </SelectedChapterIndexContext.Provider>
      </GestureHandlerRootView>
    </UserProvider>
    </QueryClientProvider>
  );
}
