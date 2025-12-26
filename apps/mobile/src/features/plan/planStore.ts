"use client";

import type { PurchasesOfferings } from "react-native-purchases";
import { create } from "zustand";

interface PlanStore {
  offerings: PurchasesOfferings | null;
  setOfferings: (offerings: PurchasesOfferings) => void;
  activeOffering: string | null;
  setActiveOfferingIndex: (offer: string) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export const usePlanStore = create<PlanStore>()((set) => ({
  offerings: null,
  setOfferings: (offerings: PurchasesOfferings) =>
    set({ offerings: offerings }),
  activeOffering: null,
  setActiveOfferingIndex: (offer: string) => set({ activeOffering: offer }),
  loading: false,
  setLoading: (loading: boolean) => set({ loading: loading }),
}));
