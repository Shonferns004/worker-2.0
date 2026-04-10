import * as TaskManager from "expo-task-manager";
import * as Location from "expo-location";

import { sendLocationToServer } from "@/service/apiService";

const WORKER_LOCATION_TASK = "worker-background-location";

type BackgroundLocationTaskBody = {
  locations?: {
    coords?: {
      latitude?: number;
      longitude?: number;
    };
  }[];
};

if (!TaskManager.isTaskDefined(WORKER_LOCATION_TASK)) {
  TaskManager.defineTask(
    WORKER_LOCATION_TASK,
    async ({ data, error }: { data?: BackgroundLocationTaskBody; error?: Error }) => {
      if (error) {
        console.log("Background location task failed", error.message);
        return;
      }

      const locations = data?.locations ?? [];
      const latest = locations[locations.length - 1];
      const latitude = latest?.coords?.latitude;
      const longitude = latest?.coords?.longitude;

      if (typeof latitude !== "number" || typeof longitude !== "number") {
        return;
      }

      try {
        await sendLocationToServer(latitude, longitude);
      } catch (taskError) {
        console.log("Background location upload failed", taskError);
      }
    },
  );
}

export const ensureBackgroundLocationTracking = async () => {
  const foreground = await Location.requestForegroundPermissionsAsync();
  if (foreground.status !== "granted") {
    return false;
  }

  const background = await Location.requestBackgroundPermissionsAsync();
  if (background.status !== "granted") {
    return false;
  }

  const started = await Location.hasStartedLocationUpdatesAsync(WORKER_LOCATION_TASK);
  if (started) {
    return true;
  }

  await Location.startLocationUpdatesAsync(WORKER_LOCATION_TASK, {
    accuracy: Location.Accuracy.Balanced,
    timeInterval: 15000,
    distanceInterval: 20,
    pausesUpdatesAutomatically: false,
    showsBackgroundLocationIndicator: true,
    foregroundService: {
      notificationTitle: "HireKar Worker is on duty",
      notificationBody: "Sharing location so nearby jobs and live tracking keep working.",
      notificationColor: "#a1e633",
    },
  });

  return true;
};

export const stopBackgroundLocationTracking = async () => {
  try {
    const taskDefined = TaskManager.isTaskDefined(WORKER_LOCATION_TASK);
    if (!taskDefined) {
      return;
    }

    const started = await Location.hasStartedLocationUpdatesAsync(
      WORKER_LOCATION_TASK,
    );
    if (!started) {
      return;
    }

    await Location.stopLocationUpdatesAsync(WORKER_LOCATION_TASK);
  } catch (error) {
    const message = String((error as Error)?.message ?? error ?? "");
    if (
      message.includes("TaskNotFoundException") ||
      message.includes("Task 'worker-background-location' not found")
    ) {
      return;
    }
    console.log("Stop location updates skipped", error);
  }
};

export const backgroundLocationTaskName = WORKER_LOCATION_TASK;
