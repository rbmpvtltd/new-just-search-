"use client";
import { z } from "zod";
// import {
//   GENDER,
//   LANGUAGES,
//   MARITAL_STATUS,
//   SUB_CATEGORY,
// } from "../constants/hire";

// const genderValues = GENDER.map((gender) => gender.value);
// const maritalStatusValues = MARITAL_STATUS.map((status) => status.value);
// const languageValues = LANGUAGES.map((language) => language.value);
// const subCategoryValue = SUB_CATEGORY.map((subCategory) => subCategory.value);

export const personalDetailsSchema = z.object({
  // photo: z.string().min(1, "Please upload your photo"),
  // appliedFor: z.string().min(1, "Please select a category"),
  // subcategory: z.array(z.enum(subCategoryValue)).min(1, {
  //   message: "Please select at least one subcategory",
  // }),

  name: z.string().min(3, "Please enter your full name"),
  // gender: z.enum(genderValues, {
  //   message: "Please select your gender",
  // }),
  // maritalStatus: z.enum(maritalStatusValues, {
  //   message: "Please select your marital status",
  // }),
  // fathersName: z.string().min(3, "Please enter your father's name"),
  // dateOfBirth: z.string().min(1, "Please enter your date of birth"),
  // languages: z
  //   .array(z.enum(languageValues))
  //   .min(1, "Please select at least one language"),

  // mobileNumber: z.string().min(1, "Please enter your mobile number"),
  // alternateMobileNumber: z.string().optional(),
  // email: z.string().optional(),
  // latitude: z.string().refine(
  //   (val) => {
  //     const num = parseFloat(val);
  //     return !isNaN(num) && num >= -90 && num <= 90;
  //   },
  //   { message: "Latitude must be a number between -90 and 90" },
  // ),
  // longitude: z.string().refine(
  //   (val) => {
  //     const num = parseFloat(val);
  //     return !isNaN(num) && num >= -180 && num <= 180;
  //   },
  //   { message: "Longitude must be a number between -180 and 180" },
  // ),
  // address: z.string().min(10, "Please enter your address"),
  // pincode: z.string().min(6, "Please enter your pincode"),
  // state: z.string().min(1, "Please select a state"),
  // city: z.string().min(1, "Please select a city"),
});

export type PersonalDetailsSchema = z.infer<typeof personalDetailsSchema>;
