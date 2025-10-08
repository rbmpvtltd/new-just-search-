"use client";

import { create } from "zustand";

interface TableState {
  select: number[];
  // isIdExist: (id: number) => boolean;
  // isExistAll: (ids: number[]) => boolean;
  addSelect: (id: number) => void;
  // deleteSelect: (id: number) => void;
  toggleSelect: (id: number) => void;
  deleteManySelect: (ids: number[]) => void;
}

export const useTableStore = create<TableState>()((set) => ({
  select: [],
  // isIdExist: (id: number) => get().select.includes(id),
  // isExistAll: (ids: number[]) => {
  //   if (ids.length === 0) return true;
  //   const currentSelect = get().select;
  //   return ids.every((id) => currentSelect.includes(id));
  // },
  addSelect: (id) =>
    set((state) => ({
      select: [...state.select, id],
    })),
  // deleteSelect: (id) =>
  //   set((state) => ({
  //     select: state.select.filter((selectedId) => selectedId !== id),
  //   })),
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
