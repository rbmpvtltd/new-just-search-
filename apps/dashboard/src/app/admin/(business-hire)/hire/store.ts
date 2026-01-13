"use client";

import type { ListingStatus } from "@repo/db";
import { create } from "zustand";

type ListingStatusItem = {
  id: number;
  listingStatus: ListingStatus;
};
interface TableState {
  listingStatusList: ListingStatusItem[];
  toggleListingStatus: (id: number, listingStatus: ListingStatus) => void;
  emptyActive: () => void;
  select: number[];
  emptySelect: () => void;
  addSelect: (id: number) => void;
  toggleSelect: (id: number) => void;
  deleteManySelect: (ids: number[]) => void;
}

export const useTableStore = create<TableState>()((set) => ({
  listingStatusList: [],
  toggleListingStatus: (id: number, listingStatus: ListingStatus) =>
    set((state) => {
      const isSelected = state.listingStatusList.some((item) => item.id === id);
      if (isSelected) {
        return {
          listingStatusList: state.listingStatusList.filter(
            (item) => item.id !== id,
          ),
        };
      } else {
        return {
          listingStatusList: [
            ...state.listingStatusList,
            { id, listingStatus },
          ],
        };
      }
    }),

  emptyActive: () => set({ listingStatusList: [] }),
  emptySelect: () => set({ select: [] }),
  select: [],
  addSelect: (id) =>
    set((state) => ({
      select: [...state.select, id],
    })),
  toggleSelect: (id) =>
    set((state) => {
      const isSelected = state.select.includes(id);
      if (isSelected) {
        return {
          select: state.select.filter((selectedId) => selectedId !== id),
        };
      } else {
        return {
          select: [...state.select, id],
        };
      }
    }),
  deleteManySelect: (ids) =>
    set((state) => ({
      select: state.select.filter((id) => !ids.includes(id)),
    })),
}));
