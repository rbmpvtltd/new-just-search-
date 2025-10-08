import z from "zod";
// import {
//   EXPERIENCE_MONTHS,
//   EXPERIENCE_YEARS,
//   QUALIFICATIONS,
//   YES_NO_OPTIONS,
// } from "../constants/hire";

// const qualificationValue = QUALIFICATIONS.map(
//   (qualification) => qualification.value,
// );
// const currentlyEmployedValue = YES_NO_OPTIONS.map(
//   (currentlyEmployed) => currentlyEmployed.value,
// );
// const experienceMonthsValue = EXPERIENCE_MONTHS.map(
//   (experienceMonths) => experienceMonths.value,
// );
// const experienceYearsValue = EXPERIENCE_YEARS.map(
//   (experienceYears) => experienceYears.value,
// );

export const educationSchema = z.object({
  // highestQualification: z.enum(qualificationValue, {
  //   message: "Please select at least one option",
  // }),
  skillset: z.string(),
  // currentlyEmployed: z.enum(currentlyEmployedValue, {
  //   message: "Please select at least one option",
  // }),
  // workExperienceYears: z.enum(experienceYearsValue, {
  //   message: "Please select at least one option",
  // }),
  // workExperienceMonths: z.enum(experienceMonthsValue).optional(),
  // jobRole: z.string().min(2, { message: "Please enter job role" }),
  // previousJobRole: z.string().optional(),
  // certificate: z.string().optional(),
});

export type EducationSchema = z.infer<typeof educationSchema>;
