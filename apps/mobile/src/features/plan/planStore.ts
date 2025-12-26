"use client";

import { create } from "zustand";

interface PlanStore {
  activePlan: {
    id: number;
    active: boolean;
  };
  setNew: (id: number, active: boolean) => void;
  reverseCurrent: (active: boolean) => void;
}

export const usePlanStore = create<PlanStore>()((set) => ({
  activePlan: {
    id: 0,
    active: false,
  },
  setNew: (id: number, active: boolean) =>
    set(() => ({ activePlan: { id, active } })),
  reverseCurrent: (active: boolean) =>
    set((state) => ({ activePlan: { ...state.activePlan, active } })),
}));
