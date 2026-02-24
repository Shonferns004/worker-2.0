import { create } from "zustand";

type CustomLocation = {
  latitude: number;
  longitude: number;
  address: string;
  heading: number;
} | null;

interface WorkerStoreProps {
  location: CustomLocation;
  onDuty: boolean;
  hydrated: boolean;

  setOnDuty: (data: boolean) => void;
  setLocation: (data: CustomLocation) => void;
  clearWorkerData: () => void;
}

export const useWorkerStore = create<WorkerStoreProps>()((set) => ({
  location: null,
  onDuty: false,
  hydrated: false,

  setOnDuty: (data) => set({ onDuty: data }),
  setLocation: (data) => set({ location: data }),

  clearWorkerData: () =>
    set({
      location: null,
      onDuty: false,
    }),
}));
