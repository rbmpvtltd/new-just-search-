import { create } from "zustand";

interface CategoryState {
  category_id: number;
  set_category_id: (by: number) => void;
}

export const useCategoryStore = create<CategoryState>((set) => ({
  category_id: 0,
  set_category_id: (by) => set(() => ({ category_id: by })),
}));
