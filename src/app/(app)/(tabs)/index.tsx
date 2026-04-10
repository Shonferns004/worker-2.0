import { AppState, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import * as Location from "expo-location";
import { router } from "expo-router";
import { supabase, getWorkerId } from "@/config/supabase";
import { useWorkerStore } from "@/store/workerStore";
import { homeStyles } from "@/styles/homeStyles";
import {
  getWorkerJobHistory,
  goOnline,
  sendLocationToServer,
} from "@/service/apiService";
import MainHeader from "@/components/home/MainHeader";
import PriorityFeed from "@/components/home/JobTiles";
import { startJobAlert, stopJobAlert } from "@/utils/jobAlertSound";

const OFFER_LIFETIME_MS = 45_000;

const mapJob = (job: any, offer?: any) => ({
  id: job.id,
  offer_id: offer?.id,
  type: job.type ?? "Service Job",
  price: (job.visit_fee || 0) + (job.job_charge || 0),
  address: job.destination?.address || "Customer Location",
  destination: job.destination,
  received_at_ms: Date.now(),
  expires_at_ms:
    Date.now() +
    Math.max(
      1_000,
      OFFER_LIFETIME_MS -
        Math.max(
          0,
          Date.now() -
            new Date(offer?.created_at || Date.now()).getTime(),
        ),
    ),
  expires_at:
    offer?.expires_at ||
    new Date(
      new Date(offer?.created_at || job.created_at).getTime() + OFFER_LIFETIME_MS,
    ).toISOString(),
});

const Home = () => {
  const { onDuty, setLocation } = useWorkerStore();
  const [jobOffers, setJobOffers] = useState<any[]>([]);
  const [todayEarnings, setTodayEarnings] = useState(0);

  const upsertOffer = (job: any, offer?: any) => {
    setJobOffers((prev) => [
      mapJob(job, offer),
      ...prev.filter((existing) => existing.id !== job.id),
    ]);
  };

  const syncPendingOffers = async (workerId: string) => {
    const { data: pendingOffers } = await supabase
      .from("job_offers")
      .select("id, job_id, created_at, response")
      .eq("worker_id", workerId)
      .is("response", null)
      .order("created_at", { ascending: false });

    if (!pendingOffers?.length) return;

    const jobIds = pendingOffers.map((offer) => offer.job_id);
    const { data: jobs } = await supabase
      .from("jobs")
      .select("*")
      .in("id", jobIds)
      .eq("status", "SEARCHING");

    jobs?.forEach((job) => {
      const matchingOffer = pendingOffers.find((offer) => offer.job_id === job.id);
      upsertOffer(job, matchingOffer);
    });
  };

  useEffect(() => {
    let locationSubscription: Location.LocationSubscription | undefined;

    const startLocationUpdates = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Highest,
          timeInterval: 10000,
          distanceInterval: 10,
        },
        async ({ coords }) => {
          const { latitude, longitude, heading } = coords;
          if (!latitude || !longitude) return;

          setLocation({
            latitude,
            longitude,
            heading: heading || 0,
            address: "Somewhere",
          });

          await sendLocationToServer(latitude, longitude);
        },
      );
    };

    const goOnlineAndStart = async () => {
      if (!onDuty) return;

      await goOnline();
      await startLocationUpdates();
    };

    goOnlineAndStart();

    return () => {
      locationSubscription?.remove();
    };
  }, [onDuty, setLocation]);

  useEffect(() => {
    if (!onDuty) {
      setJobOffers([]);
    }
  }, [onDuty]);

  useEffect(() => {
    let active = true;

    const loadTodayEarnings = async () => {
      try {
        const jobs = await getWorkerJobHistory();
        if (!active) return;

        const today = new Date().toDateString();
        const total = jobs
          .filter((job: any) => {
            if (job.status !== "COMPLETED") return false;
            const completedAt = new Date(
              job.completed_at ?? job.updated_at ?? job.created_at,
            );
            return completedAt.toDateString() === today;
          })
          .reduce(
            (sum: number, job: any) =>
              sum + Number(job.final_total ?? job.estimated_total ?? 0),
            0,
          );

        setTodayEarnings(total);
      } catch {
        if (active) setTodayEarnings(0);
      }
    };

    loadTodayEarnings();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!onDuty) {
      stopJobAlert();
      return;
    }

    let channel: any;
    let active = true;
    let workerId: string | undefined;

    const startListening = async () => {
      workerId = await getWorkerId();
      if (!workerId) return;

      await syncPendingOffers(workerId);
      if (!active) return;

      channel = supabase
        .channel(`private-job-offers-${workerId}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "job_offers",
            filter: `worker_id=eq.${workerId}`,
          },
          async (payload) => {
            const offer = payload.new;

            const { data: job } = await supabase
              .from("jobs")
              .select("*")
              .eq("id", offer.job_id)
              .single();

            if (!job) return;

            upsertOffer(job, offer);
            startJobAlert();
          },
        )
        .subscribe();
    };

    startListening();

    const appStateSubscription = AppState.addEventListener("change", (state) => {
      if (state !== "active") return;
      if (workerId) {
        syncPendingOffers(workerId);
      }
    });

    return () => {
      active = false;
      appStateSubscription.remove();
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [onDuty]);

  useEffect(() => {
    let channel: any;

    const listenForAssignment = async () => {
      const workerId = await getWorkerId();
      if (!workerId) return;

      channel = supabase
        .channel(`worker-assign-${workerId}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "jobs",
            filter: `worker_id=eq.${workerId}`,
          },
          (payload) => {
            const job = payload.new as any;

            if (job.status === "ASSIGNED") {
              router.replace({
                pathname: "/live-job",
                params: { id: job.id },
              });
            }
          },
        )
        .subscribe();
    };

    listenForAssignment();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, []);

  useEffect(() => {
    if (!onDuty) return;

    const interval = setInterval(() => {
      setJobOffers((prev) => {
        if (prev.length === 0) return prev;

        const now = Date.now();
        const activeOffers = prev.filter((job) => {
          return Number(job.expires_at_ms || 0) > now;
        });

        if (prev.length > 0 && activeOffers.length === 0) {
          stopJobAlert();
        }

        return activeOffers;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [onDuty]);

  const removeJob = (job: any) => {
    setJobOffers((prevOffers) => {
      const updated = prevOffers.filter((offer) => offer.id !== job.id);

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
