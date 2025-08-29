import { create } from "zustand";

type HeadingState = {
  heading: string;
  setHeading: (heading: string) => void;
  image: string;
  setImage: (image: string) => void;
};

export const useHeadingStore = create<HeadingState>((set) => ({
  heading: "",
  setHeading: (heading) => set({ heading }),
  image: "",
  setImage: (image) => set({ image }),
}));
