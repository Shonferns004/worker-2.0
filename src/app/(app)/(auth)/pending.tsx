import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { supabase } from "@/config/supabase";

const PRIMARY = "#a1e633";
const BG = "#ffffff";
const TEXT = "#111318";
const MUTED = "#616f89";
const BORDER = "#dbdfe6";

const SERVICE_OPTIONS = [
  "cleaner",
  "plumber",
  "electrician",
  "carpenter",
  "painter",
];

const GENDER_OPTIONS = ["Male", "Female", "Other"];

const getTierForExperience = (years: number) => {
  if (years >= 8) return "expert";
  if (years >= 5) return "professional";
  if (years >= 2) return "skilled";
  return "beginner";
};

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const { phone } = useLocalSearchParams<{ phone: string }>();

  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [experienceYears, setExperienceYears] = useState("");

  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("");
  const [zip, setZip] = useState("");

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const router = useRouter();

  const stepIcon = useMemo(() => {
    if (step === 1) return "badge";
    if (step === 2) return "construction";
    if (step === 3) return "home-work";
    return "mail";
  }, [step]);

  const validateStep = () => {
    if (step === 1) {
      if (!dateOfBirth || !gender) {
        alert("Please complete your personal details.");
        return false;
      }
    }

    if (step === 2) {
      if (!serviceType || !experienceYears) {
        alert("Please choose your service and work experience.");
        return false;
      }
    }

    if (step === 3) {
      if (!street || !city || !stateName || !zip) {
        alert("Please complete your address details.");
        return false;
      }
    }

    return true;
  };

  const verifyOtpAndUpdateStatus = async () => {
    const enteredOtp = otp.join("");

    if (enteredOtp.length !== 6) {
      alert("Enter the 6-digit code.");
      return;
    }

    const { data: worker, error } = await supabase
      .from("workers")
      .select("id, code")
      .eq("phone", phone)
      .single();

    if (error || !worker) {
      alert("Worker not found.");
      return;
    }

    if (worker.code !== enteredOtp) {
      alert("The verification code does not match.");
      return;
    }

    const parsedExperience = Number(experienceYears);
    const workerUpdatePayload = {
      status: "Success",
      worker_type: serviceType,
      tier: getTierForExperience(parsedExperience),
      date_of_birth: dateOfBirth,
      gender,
      address: street,
      city,
      state: stateName,
      zip_code: zip,
      years_experience: parsedExperience,
    };

    let updateError = null;

    const fullUpdate = await supabase
      .from("workers")
      .update(workerUpdatePayload)
      .eq("id", worker.id);

    updateError = fullUpdate.error;

    if (updateError) {
      const fallbackUpdate = await supabase
        .from("workers")
        .update({
          status: "Success",
          worker_type: serviceType,
          tier: getTierForExperience(parsedExperience),
        })
        .eq("id", worker.id);

      updateError = fallbackUpdate.error;
    }

    if (updateError) {
      alert("Failed to save your onboarding details.");
      return;
    }

    router.replace("/(app)/(auth)/done");
  };

  const handleContinue = () => {
    if (step < 4) {
      if (!validateStep()) return;
      setStep((current) => current + 1);
      return;
    }

    void verifyOtpAndUpdateStatus();
  };

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.back}
          onPress={() => step > 1 && setStep((current) => current - 1)}
        >
          <MaterialIcons
            name="arrow-back-ios-new"
            size={18}
            color={TEXT}
          />
        </TouchableOpacity>
        <Text style={styles.step}>Step {step} of 4</Text>
      </View>

      <View style={styles.track}>
        <View style={[styles.fill, { width: `${(step / 4) * 100}%` }]} />
      </View>

      <View style={styles.iconWrap}>
        <View style={styles.iconCircle}>
          <MaterialIcons name={stepIcon} size={26} color={PRIMARY} />
        </View>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentInner}
        showsVerticalScrollIndicator={false}
      >
        {step === 1 && (
          <StepOne
            dateOfBirth={dateOfBirth}
            setDateOfBirth={setDateOfBirth}
            gender={gender}
            setGender={setGender}
          />
        )}

        {step === 2 && (
          <StepTwo
            serviceType={serviceType}
            setServiceType={setServiceType}
            experienceYears={experienceYears}
            setExperienceYears={setExperienceYears}
          />
        )}

        {step === 3 && (
          <StepThree
            street={street}
            setStreet={setStreet}
            city={city}
            setCity={setCity}
            stateName={stateName}
            setStateName={setStateName}
            zip={zip}
            setZip={setZip}
          />
        )}

        {step === 4 && <StepFour otp={otp} setOtp={setOtp} />}
      </ScrollView>

      <TouchableOpacity style={styles.button} onPress={handleContinue}>
        <Text style={styles.buttonText}>
          {step === 4 ? "Finish Setup" : "Continue"}
        </Text>
      </TouchableOpacity>

      <Text style={styles.footer}>
        Your work profile is securely stored and used to match the right jobs.
      </Text>
    </SafeAreaView>
  );
}

function StepOne({
  dateOfBirth,
  setDateOfBirth,
  gender,
  setGender,
}: any) {
  return (
    <>
      <Text style={styles.title}>Personal Details</Text>
      <Text style={styles.subtitle}>
        Tell us a bit about yourself before you start taking work.
      </Text>

      <Label text="Date of Birth" />
      <Input
        value={dateOfBirth}
        onChangeText={setDateOfBirth}
        placeholder="YYYY-MM-DD"
      />

      <Label text="Gender" />
      <View style={styles.chipRow}>
        {GENDER_OPTIONS.map((option) => {
          const active = gender === option;
          return (
            <TouchableOpacity
              key={option}
              style={[styles.choiceChip, active && styles.choiceChipActive]}
              onPress={() => setGender(option)}
            >
              <Text
                style={[
                  styles.choiceChipText,
                  active && styles.choiceChipTextActive,
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </>
  );
}

function StepTwo({
  serviceType,
  setServiceType,
  experienceYears,
  setExperienceYears,
}: any) {
  return (
    <>
      <Text style={styles.title}>Work Details</Text>
      <Text style={styles.subtitle}>
        Add your main service so we can send the right jobs to you.
      </Text>

      <Label text="Primary Service" />
      <View style={styles.serviceGrid}>
        {SERVICE_OPTIONS.map((service) => {
          const active = serviceType === service;
          return (
            <TouchableOpacity
              key={service}
              style={[styles.serviceCard, active && styles.serviceCardActive]}
              onPress={() => setServiceType(service)}
            >
              <Text
                style={[
                  styles.serviceText,
                  active && styles.serviceTextActive,
                ]}
              >
                {service.toUpperCase()}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Label text="Years of Experience" />
      <Input
        value={experienceYears}
        onChangeText={setExperienceYears}
        placeholder="e.g. 3"
        keyboardType="numeric"
      />
    </>
  );
}

function StepThree({
  street,
  setStreet,
  city,
  setCity,
  stateName,
  setStateName,
  zip,
  setZip,
}: any) {
  return (
    <>
      <Text style={styles.title}>Address Details</Text>
      <Text style={styles.subtitle}>
        Add your main service area so nearby jobs can find you faster.
      </Text>

      <Label text="Street Address" />
      <Input value={street} onChangeText={setStreet} placeholder="House / Street" />

      <Label text="City" />
      <Input value={city} onChangeText={setCity} placeholder="City" />

      <View style={styles.row}>
        <View style={styles.flexOne}>
          <Label text="State" />
          <Input value={stateName} onChangeText={setStateName} placeholder="State" />
        </View>
        <View style={styles.flexOne}>
          <Label text="Zip Code" />
          <Input
            value={zip}
            onChangeText={setZip}
            placeholder="Zip"
            keyboardType="numeric"
          />
        </View>
      </View>
    </>
  );
}

function StepFour({ otp, setOtp }: any) {
  return (
    <>
      <Text style={styles.title}>Verify Code</Text>
      <Text style={styles.subtitle}>
        Enter the 6-digit code sent to your email to complete setup.
      </Text>

      <View style={styles.otpRow}>
        {otp.map((value: string, index: number) => (
          <TextInput
            key={index}
            value={value}
            maxLength={1}
            keyboardType="numeric"
            style={styles.otp}
            onChangeText={(text) => {
              const next = [...otp];
              next[index] = text;
              setOtp(next);
            }}
          />
        ))}
      </View>
    </>
  );
}

const Label = ({ text }: any) => <Text style={styles.label}>{text}</Text>;

const Input = (props: any) => (
  <TextInput
    {...props}
    style={styles.input}
    placeholderTextColor="#9ca3af"
  />
);

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: BG, paddingHorizontal: 24 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    alignItems: "center",
  },
  back: {
    width: 40,
    height: 40,
    borderRadius: 999,
    backgroundColor: "rgba(0,0,0,0.05)",
    alignItems: "center",
    justifyContent: "center",
  },
  step: { fontSize: 13, fontWeight: "600", color: TEXT, opacity: 0.7 },
  track: {
    height: 6,
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 999,
    marginTop: 12,
  },
  fill: { height: "100%", backgroundColor: PRIMARY, borderRadius: 999 },
  iconWrap: { alignItems: "center", marginTop: 28 },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 999,
    backgroundColor: "rgba(161,230,51,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  content: { flex: 1, marginTop: 24 },
  contentInner: { paddingBottom: 24 },
  title: { fontSize: 34, fontWeight: "800", color: TEXT },
  subtitle: { color: MUTED, marginVertical: 16, fontSize: 16, lineHeight: 22 },
  label: { fontSize: 13, fontWeight: "700", marginBottom: 8, color: TEXT },
  input: {
    height: 56,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: BORDER,
    paddingHorizontal: 18,
    marginBottom: 16,
    fontWeight: "600",
    color: TEXT,
  },
  row: { flexDirection: "row", gap: 12 },
  flexOne: { flex: 1 },
  chipRow: { flexDirection: "row", gap: 10, marginBottom: 18 },
  choiceChip: {
    flex: 1,
    minHeight: 52,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: BORDER,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  choiceChipActive: {
    backgroundColor: "#ecfccb",
    borderColor: PRIMARY,
  },
  choiceChipText: {
    fontWeight: "700",
    color: TEXT,
  },
  choiceChipTextActive: {
    color: "#365314",
  },
  serviceGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 18,
  },
  serviceCard: {
    width: "48%",
    minHeight: 62,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: BORDER,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  serviceCardActive: {
    borderColor: PRIMARY,
    backgroundColor: "#ecfccb",
  },
  serviceText: {
    fontWeight: "800",
    color: TEXT,
    textAlign: "center",
    letterSpacing: 0.4,
  },
  serviceTextActive: {
    color: "#365314",
  },
  button: {
    backgroundColor: PRIMARY,
    paddingVertical: 18,
    borderRadius: 24,
    alignItems: "center",
    marginBottom: 12,
  },
  buttonText: { fontSize: 18, fontWeight: "800", color: TEXT },
  footer: {
    fontSize: 11,
    color: MUTED,
    textAlign: "center",
    marginBottom: 20,
  },
  otpRow: { flexDirection: "row", gap: 8 },
  otp: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: BORDER,
    textAlign: "center",
    fontSize: 22,
    fontWeight: "700",
    color: TEXT,
  },
});
