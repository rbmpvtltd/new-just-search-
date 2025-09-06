import { create } from "zustand";

type CityName = {
  city: string;
  setCity: (city: string) => void;
};

export const useCityStore = create<CityName>((set) => ({
  city: "",
  setCity: (city) => set({ city }),
}));
