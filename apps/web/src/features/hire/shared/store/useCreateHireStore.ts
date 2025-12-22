import type {
  documentSchema,
  educationSchema,
  personalDetailsHireSchema,
  preferredPositionSchema,
} from "@repo/db/dist/schema/hire.schema";
import type z from "zod";
import { create } from "zustand";

type PersonalDetailsSchema = z.infer<typeof personalDetailsHireSchema>;
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
  highestQualification: NaN,
  employmentStatus: "",
  workExperienceYear: NaN,
  workExperienceMonth: NaN,
  jobRole: "",
  skillset: "",
  previousJobRole: "",
  certificates: "",

  // DocumentSchema
  idProof: NaN,
  idProofPhoto: "",
  coverLetter: "",
  resumePhoto: "",
  aboutYourself: "",
  // referCode: "RBMHORJ00000",
  salesmanId: NaN,

  // PersonalDetailsSchema
  photo: "",
  categoryId: NaN,
  subcategoryId: [],
  name: "",
  gender: "Male",
  maritalStatus: "Married",
  fatherName: "",
  dob: "",
  languages: [],
  mobileNumber: "",
  latitude: "",
  longitude: "",
  area: "",
  pincode: "",
  state: NaN,
  city: NaN,
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
