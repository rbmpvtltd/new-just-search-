import { create } from "zustand";
import type { DocumentSchema } from "../schemas/documents.schema";
import type { EducationSchema } from "../schemas/education.schema";
import type { PersonalDetailsSchema } from "../schemas/personal-details.schema";
import type { PreferredPosition } from "../schemas/preferred-position.schema";

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
  // jobType: [],
  // workShift: [],
  // jobDuration: [],
  // fromHour: undefined,
  // fromPeriod: undefined,
  // toHour: undefined,
  // toPeriod: undefined,
  availability: "",
  // locationPreferred: "",
  // expectedSalaryFrom: "",
  // expectedSalaryTo: "",
  // relocate: undefined,

  // EducationSchema
  // highestQualification: "",
  // currentlyEmployed: "",
  // workExperienceYears: "",
  // jobRole: "",
  skillset: "",
  // workExperienceMonths: undefined,
  // previousJobRole: undefined,
  // certificate: undefined,

  // DocumentSchema
  // idProof: "",
  // idProofPhoto: "",
  // referCode: "RBMHORJ00000",
  coverLetter: "",
  // resumePdf: undefined,
  // aboutYourself: undefined,

  // PersonalDetailsSchema
  // photo: "",
  // appliedFor: "",
  // subcategory: [],
  name: "",
  // gender: "",
  // maritalStatus: "",
  // fathersName: "",
  // dateOfBirth: "",
  // languages: [],
  // mobileNumber: "",
  // latitude: "",
  // longitude: "",
  // address: "",
  // pincode: "",
  // state: "",
  // city: "",
  // alternateMobileNumber: undefined,
  // email: undefined,
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
