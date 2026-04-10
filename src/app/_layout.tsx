import React, { useState } from "react";
import { Slot } from "expo-router";
import { UserProvider } from "@/context/UserContext";
import { SelectedChapterIndexContext } from "@/context/SelectedChapterContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import AppAlertProvider from "@/components/common/AppAlertProvider";
import { I18nProvider } from "@/i18n/I18nProvider";

const queryClient = new QueryClient();

export default function RootLayout() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        <UserProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <AppAlertProvider>
              <SelectedChapterIndexContext.Provider
                value={{ selectedIndex, setSelectedIndex }}
              >
                <Slot />
              </SelectedChapterIndexContext.Provider>
            </AppAlertProvider>
          </GestureHandlerRootView>
        </UserProvider>
      </I18nProvider>
    </QueryClientProvider>
  );
}
