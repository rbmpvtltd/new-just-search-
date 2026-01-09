import type {
  documentSchema,
  educationSchema,
  preferredPositionSchema,
} from "@repo/db/dist/schema/hire.schema";
import type z from "zod";
import { create } from "zustand";
import type { adminPersonalDetailsHireSchema } from "../../create/add-hire/forms/PersonalDetailsForm";

type PersonalDetailsSchema = z.infer<typeof adminPersonalDetailsHireSchema>;
type PreferredPositionSchema = z.infer<typeof preferredPositionSchema>;
type EducationSchema = z.infer<typeof educationSchema>;
type DocumentSchema = z.infer<typeof documentSchema>;
export type CombinedForm = PreferredPositionSchema &
  EducationSchema &
  DocumentSchema &
  PersonalDetailsSchema;

type HireFormProps = {
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
  // PreferredPosition
  jobType: [],
  workShift: [],
  jobDuration: [],
  fromHour: "10:30",
  toHour: "20:30",
  availability: "",
  locationPreferred: "",
  expectedSalaryFrom: "",
  expectedSalaryTo: "",
  relocate: "",

  // EducationSchema
  highestQualification: 0,
  employmentStatus: "",
  workExperienceYear: 0,
  workExperienceMonth: 0,
  jobRole: "",
  skillset: "",
  previousJobRole: "",
  certificates: "",

  // DocumentSchema
  idProof: 0,
  idProofPhoto: "",
  coverLetter: "",
  resumePhoto: "",
  aboutYourself: "",
  salesmanId: 0,
  // PersonalDetailsSchema
  userId: 0,
  photo: "",
  categoryId: 0,
  subcategoryId: [],
  name: "",
  gender: "Male",
  maritalStatus: "Married",
  fatherName: "",
  dob: "",
  languages: [],
  mobileNumber: "",
  latitude: null,
  longitude: null,
  address: "",
  pincode: "",
  state: 0,
  city: 0,
  alternativeMobileNumber: "",
  email: "",
};

export const useHireFormStore = create<HireFormProps>((set) => ({
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
