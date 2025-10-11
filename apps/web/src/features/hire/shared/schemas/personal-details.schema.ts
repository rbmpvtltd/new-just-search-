"use client";
// import { GENDER, LANGUAGES, MARITAL_STATUS } from "@repo/db";
import { z } from "zod";
import { GENDER, LANGUAGES, MaritalStatus } from "../constants/hire";

//  readonly Married: "Married";
//   readonly Unmarried: "Unmarried";
//   readonly Widowed: "Widowed";
//   readonly Divorced: "Divorced";
//   readonly Others: "Others";

export const personalDetailsSchema = z.object({
  // photo: z.string().min(1, "Please upload your photo"),
  // categoryId: z.number().min(1, "Please select a category"),
  // subcategoryId: z.array(z.number()).min(1, "Please select a subcategory"),

  // name: z.string().min(3, "Please enter your full name"),
  gender: z.enum(["Male", "Female", "Others"]),
  maritalStatus: z
    .array(z.enum(["Married", "Unmarried", "Widowed", "Divorced", "Others"]))
    .min(1, "Please select your marital status"),
  // specialities: z.string().min(3, "Please enter your specialities"),
  // fatherName: z.string().min(3, "Please enter your father's name"),
  // dob: z.string().min(1, "Please enter your date of birth"),
  // languages: z
  //   .array(z.enum(Object.values(LANGUAGES)))
  //   .min(1, "Please select a language"),
  // description: z.string().optional(),
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
  // area: z.string().min(10, "Please enter your address"),
  // pincode: z.string().min(6, "Please enter your pincode"),
  // state: z.number().min(1, "Please select a state"),
  // city: z.number().min(1, "Please select a city"),
});

export type PersonalDetailsSchema = z.infer<typeof personalDetailsSchema>;

// "use client";
// // import { GENDER, LANGUAGES, MARITAL_STATUS } from "@repo/db";
// import { GENDER } from "@repo/db";
// import { z } from "zod";

// export const personalDetailsSchema = z.object({
//   photo: z.string().min(1, "Please upload your photo"),
//   categoryId: z.number().min(1, "Please select a category"),
//   subcategoryId: z.array(z.number()).min(1, "Please select a subcategory"),

//   name: z.string().min(3, "Please enter your full name"),
//   gender: z.array(z.string()).min(1, "Please select your gender"),
//   maritalStatus: z.array(z.string()).min(1, "Please select"),
//   specialities: z.string().min(3, "Please enter your specialities"),
//   description: z.string().min(3, "Please enter your description"),
//   fatherName: z.string().min(3, "Please enter your father's name"),
//   dob: z.string().min(1, "Please enter your date of birth"),
//   languages: z.array(z.string()).min(1, "Please select a language"),

//   mobileNumber: z.string().min(1, "Please enter your mobile number"),
//   alternateMobileNumber: z.string().optional(),
//   email: z.string().optional(),
//   latitude: z.string().refine(
//     (val) => {
//       const num = parseFloat(val);
//       return !isNaN(num) && num >= -90 && num <= 90;
//     },
//     { message: "Latitude must be a number between -90 and 90" },
//   ),
//   longitude: z.string().refine(
//     (val) => {
//       const num = parseFloat(val);
//       return !isNaN(num) && num >= -180 && num <= 180;
//     },
//     { message: "Longitude must be a number between -180 and 180" },
//   ),
//   area: z.string().min(10, "Please enter your address"),
//   pincode: z.string().min(6, "Please enter your pincode"),
//   state: z.number().min(1, "Please select a state"),
//   city: z.number().min(1, "Please select a city"),
// });

// export type PersonalDetailsSchema = z.infer<typeof personalDetailsSchema>;
