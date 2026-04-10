import { normalizePhone } from '@/lib/normalize'
import { createClient } from '@supabase/supabase-js'
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppState } from "react-native";


export const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_API_KEY!,
  {
    auth: {
      storage: AsyncStorage,
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
    },
  }
)


supabase.auth.onAuthStateChange((_event, session) => {
  if (session?.access_token) {
    supabase.realtime.setAuth(session.access_token);
  }
});

// keeps realtime alive when app foregrounds
AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.realtime.connect();
  }
});


export const getWorkerId = async () => {
  const worker = await getUser();
  return worker?.id ?? null;
}

export const getUserPhone = async (): Promise<string> => {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error || !session?.user?.phone) {
    throw new Error("Phone number not found in Supabase session");
  }

  return normalizePhone(session.user.phone);
};


export const getUser = async () => {
  const phone = await getUserPhone();

  const { data, error } = await supabase
    .from("workers")
    .select("*")
    .eq("phone", phone)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const getUserId = async () => {
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    console.log("Session error:", error.message);
    return null;
  }

  if (!data.session) {
    console.log("No active session");
    return null;
  }

  return data.session.user.id;
};
