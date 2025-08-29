import { create } from "zustand";

type FormValidationStore = {
  page: number;
  setPage: (page: number) => void;
  clearPage: () => void;
  formValue: Record<string, any>;
  setFormValue: (key: string, value: any) => void;
};

const useFormValidationStore = create<FormValidationStore>((set) => ({
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
}));

export default useFormValidationStore;
