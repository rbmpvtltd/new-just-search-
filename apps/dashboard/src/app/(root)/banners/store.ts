"use client";

import { create } from "zustand";

interface TableState {
  active: number[];
  addActive: (id: number) => void;
  addManyActive: (ids: number[]) => void;
  toggleActive: (id: number) => void;
  deleteManyActive: (ids: number[]) => void;
  select: number[];
  addSelect: (id: number) => void;
  toggleSelect: (id: number) => void;
  deleteManySelect: (ids: number[]) => void;
}

export const useTableStore = create<TableState>()((set) => ({
  active: [],
  addActive: (id) =>
    set((state) => ({
      active: [...state.active, id],
    })),
  addManyActive: (ids) =>
    set(() => ({
      active: ids,
    })),
  toggleActive: (id) =>
    set((state) => {
      const isSelected = state.active.includes(id);
      if (isSelected) {
        return {
          active: state.active.filter((selectedId) => selectedId !== id),
        };
      } else {
        return {
          active: [...state.active, id],
        };
      }
    }),
  deleteManyActive: (ids) =>
    set((state) => ({
      active: state.active.filter((id) => !ids.includes(id)),
    })),
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
