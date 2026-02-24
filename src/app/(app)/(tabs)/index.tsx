import { View, Text, FlatList, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { useIsFocused } from "@react-navigation/native";
import { useWorkerStore } from "@/store/workerStore";
import * as Location from "expo-location";
import { homeStyles } from "@/styles/homeStyles";
import { supabase } from "@/config/supabase";
import { sendLocationToServer } from "@/service/apiService";
import MainHeader from "@/components/home/MainHeader";
import PriorityFeed from "@/components/home/JobTiles";
import { startJobAlert, stopJobAlert } from "@/utils/jobAlertSound";

const Home = () => {
  const isFocused = useIsFocused();
  const { onDuty, setLocation } = useWorkerStore();
  const [jobOffers, setJobOffers] = useState<any>([]);
  const firstLoad = React.useRef(true);
  const [gpsReady, setGpsReady] = useState(false);

  const lastSent = React.useRef(0);

  const maybeSendLocation = (lat: number, lng: number) => {
    const now = Date.now();
    if (now - lastSent.current < 5000) return;
    lastSent.current = now;
    sendLocationToServer(lat, lng);
  };

  useEffect(() => {
    let locationSubscription: any;
    const startLoctionUpdates = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        locationSubscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.Highest,
            timeInterval: 10000,
            distanceInterval: 10,
          },
          (location) => {
            const { latitude, longitude, heading } = location.coords;

            if (!latitude || !longitude) return;

            setGpsReady(true);

            setLocation({
              latitude,
              longitude,
              heading: heading || 0,
              address: "Somewhere",
            });

            maybeSendLocation(latitude, longitude);
          },
        );
      }
    };

    if (onDuty) {
      startLoctionUpdates();
    }

    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, [onDuty]);

  useEffect(() => {
    if (!onDuty || !isFocused) return;

    const loadExistingJobs = async () => {
      const { data } = await supabase
        .from("jobs")
        .select("*")
        .eq("status", "SEARCHING_FOR_WORKER")
        .order("created_at", { ascending: false });

      if (data) setJobOffers(data.map(mapJob));
    };

    loadExistingJobs();
  }, [onDuty, isFocused]);

  useEffect(() => {
    if (!onDuty) {
      setJobOffers([]);
    }
  }, [onDuty]);

  useEffect(() => {
    if (!onDuty || !isFocused) return;

    const channel = supabase.channel(`worker-jobs`);

    channel
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "jobs",
          filter: "status=eq.SEARCHING_FOR_WORKER",
        },
        (payload) => {
          const job = mapJob(payload.new);

          setJobOffers((prev: any) => {
            if (prev.some((j: any) => j.id === job.id)) return prev;

            // 🔔 START ALARM WHEN FIRST NEW JOB ARRIVES
            if (prev.length === 0) {
              startJobAlert();
            }

            return [job, ...prev];
          });
        },
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "jobs",
        },
        (payload) => {
          const job = payload.new as any;

          if (job.status !== "SEARCHING_FOR_WORKER") {
            setJobOffers((prev: any) => {
              const updated = prev.filter((j: any) => j.id !== job.id);

              // if no jobs left -> stop alarm
              if (updated.length === 0) {
                stopJobAlert();
              }

              return updated;
            });
          }
        },
      );

    channel.subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [onDuty, isFocused]);

  const mapJob = (j: any) => ({
    id: j.id,
    type: j.type ?? "Service Job",

    // REAL price
    price: (j.visit_fee || 0) + (j.job_charge || 0),

    // address from json column
    address: j.destination?.address || "Customer Location",

    // you don't store distance yet
    destination: j.destination,

    // MOST IMPORTANT PART
    expires_at:
      j.expires_at ||
      new Date(new Date(j.created_at).getTime() + 45000).toISOString(),
  });


  useEffect(() => {
  if (!onDuty) return;

  const interval = setInterval(() => {
    setJobOffers((prev: any) => {
      if (prev.length === 0) return prev;

      const now = Date.now();

      // remove expired jobs
      const stillActive = prev.filter((job: any) => {
        const expiry = new Date(job.expires_at).getTime();
        return expiry > now;
      });

      // IMPORTANT: stop sound when last job expired
      if (prev.length > 0 && stillActive.length === 0) {
        console.log("ALL JOBS EXPIRED -> STOP ALARM");
        stopJobAlert();
      }

      return stillActive;
    });
  }, 1000); // check every second

  return () => clearInterval(interval);
}, [onDuty]);

  const removeJob = (job: any) => {
    setJobOffers((prevOffers: any) => {
      const updated = prevOffers.filter((offer: any) => offer.id !== job.id);

      if (updated.length === 0) {
        stopJobAlert();
      }

      return updated;
    });
  };


  return (
    <View style={homeStyles.container}>
      <MainHeader />
      <PriorityFeed jobs={jobOffers} onAccept={removeJob} />
    </View>
  );
};

export default Home;
