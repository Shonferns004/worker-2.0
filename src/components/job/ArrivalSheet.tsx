import React, { FC } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Linking,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { screenHeight } from "@/utils/Constants";

const ArrivalSheet: FC<{
  job: any;
  onPress: () => void;
}> = ({ job, onPress }) => {
  const address =
    job?.destination?.address ??
    job?.destination_address ??
    "Fetching location...";

  const callCustomer = () => {
    if (!job?.phone) return;
    Linking.openURL(`tel:${job.phone}`);
  };

  const getButtonText = () => {
    if (job.status === "ASSIGNED") return "Verify Arrival";
    if (job.status === "ARRIVED") return "Start Job";
    if (job.status === "IN_PROGRESS") return "Complete Job";
    return "Waiting...";
  };

  return (
    <View style={styles.container}>
      {/* DESTINATION */}
      <View style={styles.destinationRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.destinationLabel}>DESTINATION</Text>
          <Text style={styles.destinationTitle}>{address.slice(0, 28)}</Text>
          <Text style={styles.destinationSub}>{address}</Text>
        </View>

        <View style={styles.gardenIcon}>
          <MaterialIcons name="place" size={22} color="#64748b" />
        </View>
      </View>

      {/* CUSTOMER CARD */}
      <View style={styles.jobCard}>
        <View style={styles.avatarWrapper}>
          <ImageBackground
            source={{
              uri: "https://i.pravatar.cc/150?img=12",
            }}
            style={styles.avatar}
            imageStyle={{ borderRadius: 20 }}
          />
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.jobTitle}>{job?.customer_name}</Text>
          <Text style={styles.jobSub}>
            +91 {job?.phone ? String(job.phone) : ""}
          </Text>
        </View>

        <TouchableOpacity style={styles.callBtn} onPress={callCustomer}>
          <MaterialIcons name="call" size={20} color="#2563eb" />
        </TouchableOpacity>
      </View>

      {/* ACTION BUTTON */}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onPress}
        style={styles.arrivedBtn}
      >
        <Text style={styles.arrivedText}>{getButtonText()}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ArrivalSheet;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 40,
  },

  etaCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 20,
    elevation: 5,
    marginBottom: 20,
  },

  etaIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#3b82f6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  etaLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#64748b",
  },

  etaText: {
    fontSize: 20,
    fontWeight: "700",
  },

  etaSub: {
    fontSize: 14,
    color: "#94a3b8",
  },

  destinationRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
  },

  destinationLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#64748b",
    marginBottom: 6,
  },

  destinationTitle: {
    fontSize: 20,
    fontWeight: "700",
  },

  destinationSub: {
    color: "#64748b",
  },

  gardenIcon: {
    backgroundColor: "#f1f5f9",
    padding: 12,
    borderRadius: 16,
  },

  jobCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    padding: 16,
    borderRadius: 20,
    marginBottom: 20,
  },

  avatarWrapper: {
    marginRight: 12,
  },

  avatar: {
    width: 32,
    height: 32,
  },

  jobTitle: {
    fontWeight: "700",
  },

  jobSub: {
    fontSize: 12,
    color: "#64748b",
  },

  callBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#dbeafe",
    justifyContent: "center",
    alignItems: "center",
  },

  arrivedBtn: {
    backgroundColor: "black",
    paddingVertical: 18,
    borderRadius: 20,
    alignItems: "center",
  },

  arrivedText: {
    fontSize: 18,
    fontWeight: "700",
    color: "white",
  },
});
