import type z from "zod";
import { create } from "zustand";
import type { adminAddFranchiseInsertSchema } from "../../create/add-franchise/forms/FranchiseForm";
import type { adminAddProfileInsertSchema } from "../../create/add-franchise/forms/ProfileForm";
import type { adminAddUserInsertSchema } from "../../create/add-franchise/forms/UserForm";

type UserSchema = z.infer<typeof adminAddUserInsertSchema>;
type ProfileSchema = z.infer<typeof adminAddProfileInsertSchema>;
type FranchiseSchema = z.infer<typeof adminAddFranchiseInsertSchema>;
export type CombinedForm = ProfileSchema & UserSchema & FranchiseSchema;

type FranchiseFormProps = {
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
  area: "",
  pincode: "",
  state: 0,
  city: 0,
  firstName: "",
  address: "",
  lastName: "",
  occupation: null,
  salutation: "",

  //franchise
  referPrifixed: "",
  employeeLimit: NaN,
  gstNo: "",
};

export const useFranchiseFormStore = create<FranchiseFormProps>((set) => ({
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
