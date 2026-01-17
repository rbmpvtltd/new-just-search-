import { create } from "zustand";

type LocationState = {
  longitude: number;
  setLongitude: (longitude: number) => void;
  latitude: number;
  setLatitude: (latitude: number) => void;
};

export const useLocationStore = create<LocationState>((set) => ({
  longitude: 0,
  setLongitude: (longitude) => set({ longitude }),
  latitude: 0,
  setLatitude: (latitude) => set({ latitude }),
}));
