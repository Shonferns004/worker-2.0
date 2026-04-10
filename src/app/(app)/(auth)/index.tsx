import { supabase } from "@/config/supabase";
import { useI18n } from "@/i18n/I18nProvider";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Alert,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function PhoneAuthScreen() {
  const { t } = useI18n();
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const otpRef0 = useRef<TextInput>(null);
  const otpRef1 = useRef<TextInput>(null);
  const otpRef2 = useRef<TextInput>(null);
  const otpRef3 = useRef<TextInput>(null);
  const otpRef4 = useRef<TextInput>(null);
  const otpRef5 = useRef<TextInput>(null);
  const otpRefs = [otpRef0, otpRef1, otpRef2, otpRef3, otpRef4, otpRef5];

  const sendOtp = async () => {
    if (phone.length !== 10) {
      Alert.alert(t("auth.invalidNumberTitle"), t("auth.invalidNumberMessage"));
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signInWithOtp({
      phone: `+91${phone}`,
    });

    setLoading(false);

    if (error) {
      Alert.alert(t("auth.errorTitle"), error.message);
      return;
    }

    setStep("otp");
  };

  const verifyOtp = async () => {
    const token = otp.join("");

    if (token.length !== 6) {
      Alert.alert(t("auth.invalidOtpTitle"), t("auth.invalidOtpMessage"));
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.verifyOtp({
      phone: `+91${phone}`,
      token,
      type: "sms",
    });

    if (error) {
      setLoading(false);
      Alert.alert(t("auth.errorTitle"), error.message);
      return;
    }

    const { data: workerData, error: workerError } = await supabase
      .from("workers")
      .select("*")
      .eq("phone", `${phone}`)
      .single();

    if (workerError) {
      setLoading(false);

      if (workerError.code === "PGRST116") {
        Alert.alert(t("auth.errorTitle"), t("auth.unregisteredMessage"));
        router.replace("/(app)/(auth)");
        await supabase.auth.signOut();
        return;
      }

      Alert.alert(t("auth.errorTitle"), workerError.message);
      return;
    }

    switch (workerData.status) {
      case "Pending":
      case "Pending Login":
        router.replace({
          pathname: "/(app)/(auth)/pending",
          params: { phone: `${phone}` },
        });
        break;

      case "Success":
        router.replace("/(app)/(tabs)");
        break;

      case "Blocked":
        Alert.alert(t("auth.blockedTitle"), t("auth.blockedMessage"));
        await supabase.auth.signOut();
        break;

      default:
        Alert.alert(t("auth.errorTitle"), t("auth.invalidAccountState"));
    }

    setLoading(false);
  };

  const handleOtpChange = (value: string, index: number) => {
    if (value.length > 1) {
      const pasted = value.slice(0, 6).split("");
      const newOtp = [...otp];

      pasted.forEach((digit, i) => {
        if (index + i < 6) {
          newOtp[index + i] = digit;
        }
      });

      setOtp(newOtp);
      otpRefs[Math.min(index + pasted.length, 5)].current?.focus();
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      otpRefs[index + 1].current?.focus();
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      {step === "phone" && (
        <View style={styles.container}>
          <View style={styles.iconBox}>
            <Text style={styles.icon}>{"\uD83D\uDD10"}</Text>
          </View>

          <Text style={styles.title}>Hire Kar</Text>

          <Text style={styles.subtitle}>{t("auth.phoneSubtitle")}</Text>

          <View style={styles.formRow}>
            <View style={styles.codeBox}>
              <Text style={styles.label}>{t("auth.codeLabel").toUpperCase()}</Text>
              <TextInput value="+91" editable={false} style={styles.input} />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.label}>
                {t("auth.phoneNumberLabel").toUpperCase()}
              </Text>
              <TextInput
                placeholder={t("auth.phonePlaceholder")}
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
                style={styles.input}
              />
            </View>
          </View>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={sendOtp}
            disabled={loading}
          >
            <Text style={styles.primaryText}>
              {loading ? t("auth.sending") : t("auth.sendCode")}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {step === "otp" && (
        <View style={styles.container}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              setOtp(["", "", "", "", "", ""]);
              setStep("phone");
            }}
          >
            <Text style={styles.backText}>{"\u2190"} {t("common.back")}</Text>
          </TouchableOpacity>

          <View style={styles.iconBox}>
            <Text style={styles.icon}>{"\uD83D\uDCF1"}</Text>
          </View>

          <Text style={styles.titleLarge}>{t("auth.verifyTitle")}</Text>

          <Text style={styles.subtitle}>{t("auth.verifySubtitle")}</Text>

          <View style={styles.otpRow}>
            {otpRefs.map((ref, i) => (
              <TextInput
                key={i}
                ref={ref}
                maxLength={1}
                keyboardType="number-pad"
                style={styles.otpInput}
                value={otp[i]}
                onChangeText={(val) => handleOtpChange(val, i)}
                onKeyPress={({ nativeEvent }) => {
                  if (nativeEvent.key === "Backspace" && !otp[i] && i > 0) {
                    otpRefs[i - 1].current?.focus();
                  }
                }}
              />
            ))}
          </View>

          <TouchableOpacity style={styles.primaryButton} onPress={verifyOtp}>
            <Text style={styles.primaryText}>{t("auth.verifyButton")}</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingTop: Platform.OS === "android" ? 24 : 0,
  },

  container: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 48,
    alignItems: "center",
  },

  iconBox: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: "rgba(161,230,51,0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
  },

  icon: { fontSize: 28 },

  title: {
    fontSize: 34,
    fontWeight: "800",
    marginBottom: 16,
  },

  titleLarge: {
    fontSize: 44,
    fontWeight: "800",
    marginBottom: 16,
  },

  subtitle: {
    fontSize: 17,
    color: "#616f89",
    textAlign: "center",
    marginBottom: 40,
  },

  formRow: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
    marginBottom: 32,
  },

  codeBox: { width: 90 },

  label: {
    fontSize: 11,
    fontWeight: "700",
    marginBottom: 6,
  },

  backButton: {
    alignSelf: "flex-start",
    marginBottom: 24,
  },

  backText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111318",
  },

  input: {
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#dbdfe6",
    paddingHorizontal: 16,
    fontSize: 16,
    color: "black",
  },

  primaryButton: {
    width: "100%",
    backgroundColor: "#a1e633",
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: "center",
    marginBottom: 24,
  },

  primaryText: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111318",
  },

  otpRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    marginBottom: 32,
  },

  otpInput: {
    width: 48,
    height: 56,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#dbdfe6",
    textAlign: "center",
    fontSize: 22,
    fontWeight: "700",
    color: "#111318",
  },
});
