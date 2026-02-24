import { screenHeight } from "@/utils/Constants";
import React, { useRef, useState } from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Pressable,
  Keyboard,
} from "react-native";

interface Props {
  visible: boolean;
  title?: string;
  onClose: () => void;
  onConfirm: (otp: string) => void;
}

const OtpModal: React.FC<Props> = ({
  visible,
  title = "Enter OTP to Start Task",
  onClose,
  onConfirm,
}) => {
  const [otp, setOtp] = useState(["", "", "", ""]);

  const inputs = useRef<TextInput[]>([]);

  const handleChange = (text: string, index: number) => {
    if (!/^[0-9]?$/.test(text)) return;

    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Move forward automatically
    if (text && index < 3) {
      inputs.current[index + 1]?.focus();
    }

    // Auto submit if complete
    if (newOtp.join("").length === 4) {
      Keyboard.dismiss();
    }
  };

  const handleBackspace = (key: string, index: number) => {
    if (key === "Backspace" && otp[index] === "" && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const submit = () => {
    const code = otp.join("");
    if (code.length !== 4) return;
    onConfirm(code);
  };

  const reset = () => {
    setOtp(["", "", "", ""]);
    inputs.current[0]?.focus();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.container}>
          {/* HEADER */}
          <TouchableOpacity style={styles.backBtn} onPress={onClose}>
            <Text style={styles.backText}>‹</Text>
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>
              Ask the client for the 4-digit code to begin the work
            </Text>
          </View>

          {/* OTP INPUTS */}
          <View style={styles.otpRow}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => {
                  if (ref) inputs.current[index] = ref;
                }}
                value={digit}
                onChangeText={(text) => handleChange(text, index)}
                onKeyPress={({ nativeEvent }) =>
                  handleBackspace(nativeEvent.key, index)
                }
                keyboardType="number-pad"
                maxLength={1}
                style={styles.otpInput}
                autoFocus={index === 0}
              />
            ))}
          </View>


          {/* <View style={{ flex: 1 }} /> */}

          {/* CTA */}
          <TouchableOpacity style={styles.startBtn} onPress={submit}>
            <Text style={styles.startText}>Start Inspection</Text>
          </TouchableOpacity>

        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default OtpModal;

const PRIMARY = "#a3e635";

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },

  container: {
    height: screenHeight * 0.7,
    backgroundColor: "#fff",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 20,
  },

  backBtn: {
    width: 40,
    height: 40,
    justifyContent: "center",
  },

  backText: {
    fontSize: 32,
    fontWeight: "600",
  },

  header: {
    marginTop: 10,
    marginBottom: 40,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 6,
  },

  subtitle: {
    color: "#64748b",
    fontWeight: "500",
  },

  otpRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },

  otpInput: {
    width: 68,
    height: 80,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#e2e8f0",
    backgroundColor: "#f8fafc",
    textAlign: "center",
    fontSize: 30,
    fontWeight: "700",
  },

  resend: {
    textAlign: "center",
    color: "#94a3b8",
    fontWeight: "600",
  },

  startBtn: {
    backgroundColor: 'black',
    paddingVertical: 20,
    borderRadius: 18,
    alignItems: "center",
    shadowColor: PRIMARY,
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },

  startText: {
    fontSize: 18,
    fontWeight: "700",
    color: "white",
  },

  homeBar: {
    width: 130,
    height: 5,
    backgroundColor: "#e2e8f0",
    borderRadius: 3,
    alignSelf: "center",
    marginTop: 18,
  },
});