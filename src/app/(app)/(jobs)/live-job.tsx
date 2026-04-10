import { View, Alert } from "react-native";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useWorkerStore } from "@/store/workerStore";
import { router, useLocalSearchParams } from "expo-router";
import * as Location from "expo-location";
import { rideStyles } from "@/styles/rideStyles";
import WorkerLiveTracking from "@/components/job/WorkerLiveTracking";
import { updateJobLocation, verifyArival } from "@/service/apiService";
import OtpModal from "@/components/job/OtpModal";
import { supabase } from "@/config/supabase";
import ArrivalSheet from "@/components/job/ArrivalSheet";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { screenHeight } from "@/utils/Constants";



const androidHeight = [screenHeight * 0.3, screenHeight * 0.3];
const CANCELLED_STATUSES = [
  "CANCELLED",
  "CANCELLED_BY_USER",
  "CANCELLED_BY_WORKER",
  "AUTO_CANCELLED",
  "EXPIRED",
];

const LiveJob = () => {
  const [isOtpModalVisible, setOtpModalVisible] = useState(false);
  const { setLocation, location, setOnDuty } = useWorkerStore();
  const [jobData, setJobData] = useState<any>(null);
  const { id } = useLocalSearchParams();
  const lastSent = React.useRef(0);

  const bottomSheetRef = useRef<BottomSheet>(null);

const snapPoints = useMemo(() => androidHeight, []);


  const maybeUpdateLocation = useCallback((lat: number, lng: number) => {
    const now = Date.now();
    if (now - lastSent.current < 8000) return;
    lastSent.current = now;
    updateJobLocation(jobData.id, lat, lng);
  }, [jobData?.id]);

  useEffect(() => {
    let locationSubscription: any;
    const startLoctionUpdates = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        locationSubscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.Highest,
            timeInterval: 5000,
            distanceInterval: 50,
          },
          (location) => {
            const { latitude, longitude, heading } = location.coords;

            setLocation({
              latitude,
              longitude,
              heading: heading || 0,
              address: "Somewhere",
            });

            setOnDuty(true);

            if (jobData?.id) {
              maybeUpdateLocation(latitude, longitude);
            }

            console.log(
              `Location updated : Lat ${latitude}, Lon ${longitude}, Heading: ${heading}`,
            );
          },
        );
      }
    };

    startLoctionUpdates();

    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, [id, jobData, maybeUpdateLocation, setLocation, setOnDuty]);

  useEffect(() => {
    if (!id) return;

    const fetchJob = async () => {
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("id", id)
        .single();

      if (!data || error) {
        Alert.alert("Job not found");
        router.replace("/(app)/(tabs)");
        return;
      }

      if (data.status === "ARRIVED") {
        router.replace({
          pathname: "/(app)/(jobs)/inspect",
          params: { id: data.id },
        });
        return;
      }

      if (data.status === "IN_PROGRESS") {
        router.replace({
          pathname: "/(app)/(jobs)/work-in-progress",
          params: { id: data.id },
        });
        return;
      }

      if (data.status === "COMPLETED") {
        router.replace({
          pathname: "/(app)/(jobs)/payment-qr",
          params: { id: data.id },
        });
        return;
      }

      setJobData(data);
    };

    fetchJob();
  }, [id]);

  useEffect(() => {
    if (!id) return;

    const channel = supabase
      .channel(`worker-job-${id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "jobs",
          filter: `id=eq.${id}`,
        },
        (payload) => {
          const job = payload.new;
          setJobData(job);

          if (CANCELLED_STATUSES.includes(job.status)) {
            Alert.alert("This job is no longer active");
            router.replace("/(app)/(tabs)");
            return;
          }

          if (job.status === "ARRIVED") {
            router.replace({
              pathname: "/(app)/(jobs)/inspect",
              params: { id: job.id },
            });
            return;
          }

          if (job.status === "IN_PROGRESS") {
            router.replace({
              pathname: "/(app)/(jobs)/work-in-progress",
              params: { id: job.id },
            });
            return;
          }

          if (job.status === "COMPLETED") {
            router.replace({
              pathname: "/(app)/(jobs)/payment-qr",
              params: { id: job.id },
            });
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id]);


    const handleOtp =async(otp:any)=>{
      if (otp === jobData?.verification_otp) {
            const isSuccess = await verifyArival(jobData?.id, otp);
            if (isSuccess) {
              Alert.alert("OTP Verified");
              setOtpModalVisible(false);
            } else {
              Alert.alert("There was an error");
            }
          } else {
            Alert.alert("Invalid OTP");
          }
    }

 return (
  <View style={rideStyles.container}>
    {/* FULL SCREEN MAP */}
    {jobData && (
      <WorkerLiveTracking
        status={jobData.status}
        location={{
          latitude: parseFloat(jobData.destination.latitude),
          longitude: parseFloat(jobData.destination.longitude),
          heading: 0,
          address: jobData.destination.address,
        }}
        worker={{
          latitude: location?.latitude,
          longitude: location?.longitude,
          heading: location?.heading,
        }}
        type={jobData?.type}
      />
    )}

    {/* BOTTOM SHEET */}
    {jobData && (
      <BottomSheet
        ref={bottomSheetRef}
        index={0}
        snapPoints={snapPoints}
        enablePanDownToClose={false}
        backgroundStyle={{
          backgroundColor: "#ffffff",
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
        }}
        handleIndicatorStyle={{
          backgroundColor: "#cbd5e1",
          width: 60,
        }}
      >
        <BottomSheetScrollView showsVerticalScrollIndicator={false}>
          <ArrivalSheet
            job={jobData}
            onPress={() => {
              if (jobData.status === "ASSIGNED") {
                setOtpModalVisible(true);
                return;
              }

              if (jobData.status === "ARRIVED") {
                router.push({
                  pathname: "/(app)/(jobs)/inspect",
                  params: { id: jobData.id },
                });
                return;
              }

              if (jobData.status === "IN_PROGRESS") {
                router.push({
                  pathname: "/(app)/(jobs)/work-in-progress",
                  params: { id: jobData.id },
                });
              }
            }}
          />
        </BottomSheetScrollView>
      </BottomSheet>
    )}

    {/* OTP */}
    {isOtpModalVisible && (
      <OtpModal
        visible={isOtpModalVisible}
        onClose={() => setOtpModalVisible(false)}
        title="Enter OTP Below"
        onConfirm={(otp)=>{
          handleOtp(otp)
        }}
      />
    )}
  </View>
);
};

export default LiveJob;
