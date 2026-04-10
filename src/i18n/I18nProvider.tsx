import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

import { Language, TranslationKey, translations } from "@/i18n/translations";

const STORAGE_KEY = "worker.language";

type I18nContextType = {
  language: Language;
  setLanguage: (language: Language) => Promise<void>;
  t: (key: TranslationKey) => string;
};

const I18nContext = createContext<I18nContextType | null>(null);

const resolveDeviceLanguage = (): Language => {
  const locale = Intl.DateTimeFormat().resolvedOptions().locale?.toLowerCase() ?? "en";
  if (locale.startsWith("hi")) return "hi";
  if (locale.startsWith("bn")) return "bn";
  if (locale.startsWith("ta")) return "ta";
  if (locale.startsWith("te")) return "te";
  if (locale.startsWith("mr")) return "mr";
  return "en";
};

export const I18nProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    let mounted = true;

    const loadLanguage = async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        const nextLanguage =
          saved === "en" ||
          saved === "hi" ||
          saved === "bn" ||
          saved === "ta" ||
          saved === "te" ||
          saved === "mr"
            ? saved
            : resolveDeviceLanguage();

        if (mounted) {
          setLanguageState(nextLanguage);
        }
      } catch {
        if (mounted) {
          setLanguageState(resolveDeviceLanguage());
        }
      }
    };

    loadLanguage();

    return () => {
      mounted = false;
    };
  }, []);

  const setLanguage = async (nextLanguage: Language) => {
    setLanguageState(nextLanguage);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, nextLanguage);
    } catch {
      // Keep the selection in memory if persistence fails.
    }
  };

  const value = useMemo<I18nContextType>(
    () => ({
      language,
      setLanguage,
      t: (key) => translations[language][key] ?? translations.en[key] ?? key,
    }),
    [language],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used inside I18nProvider");
  }
  return context;
};
