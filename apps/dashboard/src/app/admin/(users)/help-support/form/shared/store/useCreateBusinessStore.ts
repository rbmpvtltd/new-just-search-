import type {
  addressDetailSchema,
  businessTimingSchema,
  contactDetailSchema,
} from "@repo/db/dist/schema/business.schema";
import type z from "zod";
import { create } from "zustand";
import type { adminBusinessDetailSchema } from "../../create/add-business/forms/BusinessDetail";

type BusinessDetailSchema = z.infer<typeof adminBusinessDetailSchema>;
type AddressDetailSchema = z.infer<typeof addressDetailSchema>;
type BusinessTimingSchema = z.infer<typeof businessTimingSchema>;
type ContactDetailSchema = z.infer<typeof contactDetailSchema>;

export type CombinedBusinessForm = BusinessDetailSchema &
  AddressDetailSchema &
  BusinessTimingSchema &
  ContactDetailSchema;
type BusinessFormProps = {
  page: number;
  prevPage: () => void;
  nextPage: () => void;
  formValue: CombinedBusinessForm;
  setFormValue: (
    key: keyof CombinedBusinessForm,
    value: string[] | number[] | string | number | boolean | undefined,
  ) => void;
  clearPage: () => void;
};

const initialFormValue: CombinedBusinessForm = {
  userId: NaN,
  photo: "",
  name: "",
  categoryId: 0,
  subcategoryId: [],
  specialities: "",
  homeDelivery: "",
  description: "",
  image1: "",
  image2: "",
  image3: "",
  image4: "",
  image5: "",

  buildingName: "",
  streetName: "",
  area: "",
  landmark: "",
  latitude: null,
  longitude: null,
  pincode: "",
  state: 0,
  city: 0,
  days: [],
  fromHour: "10:30",
  toHour: "20:30",

  contactPerson: "",
  phoneNumber: "",
  ownerNumber: "",
  email: "",
  whatsappNo: "",
  salesmanId: 0,
  // slug: "",
};
export const useBusinessFormStore = create<BusinessFormProps>((set) => ({
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

  clearPage: () => set((state) => ({ page: 0, formValue: initialFormValue })),
}));
