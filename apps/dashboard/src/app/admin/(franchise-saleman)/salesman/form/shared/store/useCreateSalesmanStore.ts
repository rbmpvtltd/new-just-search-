import type z from "zod";
import { create } from "zustand";
import type { adminAddProfileInsertSchema } from "../../create/add-salesman/forms/ProfileForm";
import type { adminSalesmenInsertSchema } from "../../create/add-salesman/forms/SalesmanForm";
import type { adminAddUserInsertSchema } from "../../create/add-salesman/forms/UserForm";

type UserInsertSchema = z.infer<typeof adminAddUserInsertSchema>;
type ProfileSchema = z.infer<typeof adminAddProfileInsertSchema>;
type SalesmanSchema = z.infer<typeof adminSalesmenInsertSchema>;
export type CombinedForm = ProfileSchema & UserInsertSchema & SalesmanSchema;

type SalesmanFormProps = {
  page: number;
  prevPage: () => void;
  nextPage: () => void;
  clearPage: () => void;
  formValue: CombinedForm;
  setFormValue: (
    key: keyof CombinedForm,
    value: string[] | number[] | string | number | boolean | undefined,
  ) => void;
};

// Combined initial value
const initialFormValue: CombinedForm = {
  //user
  // userId: NaN,
  password: "",
  googleId: "",
  status: true,
  phoneNumber: "",
  displayName: "",
  email: "",

  //profile
  profileImage: "",
  maritalStatus: "Married",
  dob: null,
  pincode: "",
  state: 0,
  city: 0,
  firstName: "",
  address: "",
  lastName: "",
  occupation: null,
  salutation: NaN,

  //salesman
  franchiseId: NaN,
  referCode: "",
};

export const useSalesmanFormStore = create<SalesmanFormProps>((set) => ({
  page: 0,
  formValue: initialFormValue,

  prevPage: () =>
    set((state) => ({
      page: Math.max(state.page - 1, 0),
    })),

  nextPage: () =>
    set((state) => ({
      page: Math.min(state.page + 1, 4),
    })),

  setFormValue: (key, value) =>
    set((state) => ({
      formValue: {
        ...state.formValue,
        [key]: value,
      },
    })),

  clearPage: () => set(() => ({ page: 0, formValue: initialFormValue })),
}));
