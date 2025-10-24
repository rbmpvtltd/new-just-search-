"use client";

import { create } from "zustand";

type IsActive = {
  id: number;
  isActive: boolean;
};
interface TableState {
  active: IsActive[];
  toggleActive: (id: number, isActive: boolean) => void;
  emptyActive: () => void;
  popular: IsActive[];
  togglePopular: (id: number, isActive: boolean) => void;
  emptyPopular: () => void;
  select: number[];
  emptySelect: () => void;
  addSelect: (id: number) => void;
  toggleSelect: (id: number) => void;
  deleteManySelect: (ids: number[]) => void;
}

export const useTableStore = create<TableState>()((set) => ({
  active: [],
  popular: [],
  toggleActive: (id: number, isActive: boolean) =>
    set((state) => {
      const isSelected = state.active.some((item) => item.id === id);
      if (isSelected) {
        return {
          active: state.active.filter((item) => item.id !== id),
        };
      } else {
        return {
          active: [...state.active, { id, isActive }],
        };
      }
    }),
  togglePopular: (id: number, isActive: boolean) =>
    set((state) => {
      const isSelected = state.popular.some((item) => item.id === id);
      if (isSelected) {
        return {
          popular: state.popular.filter((item) => item.id !== id),
        };
      } else {
        return {
          popular: [...state.popular, { id, isActive }],
        };
      }
    }),
  emptyActive: () => set({ active: [] }),
  emptyPopular: () => set({ popular: [] }),
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
