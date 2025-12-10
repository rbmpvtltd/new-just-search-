import type { usersInsertSchema } from "@repo/db/dist/schema/auth.schema";
import type { profileInsertSchema } from "@repo/db/dist/schema/user.schema";
import type z from "zod";
import { create } from "zustand";

type UserInsertSchema = z.infer<typeof usersInsertSchema>;
type ProfileSchema = z.infer<typeof profileInsertSchema>;
export type CombinedForm = ProfileSchema & UserInsertSchema;

type UserFormProps = {
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
  userId: NaN,
  password: "",
  role: "visiter",
  googleId: "",
  status: true,
  phoneNumber: "",
  displayName: "",
  email: "",
  //profile
  profileImage: "",
  maritalStatus: "Married",
  dob: "",
  area: "",
  pincode: "",
  state: 0,
  city: 0,
  firstName: "",
  address: "",
  lastName: "",
  occupation: "",
  salutation: "",
};

export const useUserFormStore = create<UserFormProps>((set) => ({
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
