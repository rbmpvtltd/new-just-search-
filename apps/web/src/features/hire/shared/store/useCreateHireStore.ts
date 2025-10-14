import type { personalDetailsHireSchema } from "@repo/db/src/schema/hire.schema";
import type z from "zod";
import { create } from "zustand";
import type { DocumentSchema } from "../schemas/documents.schema";
import type { EducationSchema } from "../schemas/education.schema";
import type { PreferredPosition } from "../schemas/preferred-position.schema";

type PersonalDetailsSchema = z.infer<typeof personalDetailsHireSchema>;
export type CombinedForm = PreferredPosition &
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
    value: string[] | string | number | undefined,
  ) => void;
};

// Combined initial value
const initialFormValue: CombinedForm = {
  // PreferredPosition
  jobType: ["FullTime"],
  workShift: [],
  jobDuration: [],
  fromHour: "",
  fromPeriod: "",
  toHour: "",
  toPeriod: "",
  availability: "",
  locationPreferred: "",
  expectedSalaryFrom: "",
  expectedSalaryTo: "",
  relocate: "",

  // EducationSchema
  highestQualification: "",
  currentlyEmployed: "",
  workExperienceYear: 0,
  workExperienceMonth: undefined,
  jobRole: "",
  skillset: "",
  previousJobRole: "",
  certificate: "",

  // DocumentSchema
  idProof: "",
  idProofPhoto: "",
  coverLetter: "",
  resumePdf: "",
  aboutYourself: "",
  referCode: "RBMHORJ00000",

  // PersonalDetailsSchema
  // photo: "",
  // categoryId: 0,
  // subcategoryId: [],
  name: "",
  gender: "Male",
  maritalStatus: "Others",
  // specialities: "",
  // description: "",
  // fatherName: "",
  // dob: "",
  // languages: [],
  // mobileNumber: "",
  // latitude: "",
  // longitude: "",
  // area: "",
  // pincode: "",
  // state: 0,
  // city: 0,

  // alternateMobileNumber: "",
  // email: "",
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
