import { create } from "zustand";

type BusinessFormValidationStore = {
  page: number;
  setPage: (page: number) => void;
  clearPage: () => void;
  formValue: Record<string, any>;
  setFormValue: (key: string, value: any) => void;
};

const useBusinessFormValidationStore = create<BusinessFormValidationStore>(
  (set) => ({
    page: 0,
    formValue: {},
    setPage: (page) => set((state) => ({ page: Math.max(state.page, page) })),
    clearPage: () => set(() => ({ page: 0, formValue: {} })),

    setFormValue: (key, value) =>
      set((state) => ({
        formValue: {
          ...state.formValue,
          [key]: value,
        },
      })),
  }),
);

export default useBusinessFormValidationStore;
