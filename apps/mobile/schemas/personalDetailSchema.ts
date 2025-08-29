import { z } from "zod";

export const personalDetailSchema = z.object({
  photo: z.any().optional(),
  salutation: z.string().min(1, {
    message: "Please select your salutation",
  }),

  first_name: z
    .string()
    .min(2, "atleast two character should be in first name")
    .max(25, "first name should be under length 25")
    .regex(/^[A-Za-z\s]+$/, "Only alphabets are allowed"),

  last_name: z
    .string()
    .min(2, "atleast two character should be in last name")
    .max(25, "last name should be under length 25")
    .regex(/^[A-Za-z\s]+$/, "Only alphabets are allowed"),

  email: z.string().email("Invalid Email Address"),

  dob: z.date({
    required_error: "Date of birth is required",
    invalid_type_error: "Invalid date",
  }),

  occupation: z.string().min(1, {
    message: "Please select your occupation",
  }),

  marital_status: z.string().min(1, {
    message: "Please select your marital status",
  }),

  area: z
    .string()
    .min(12, "area must have atleast 12 character")
    .max(500, "area should have under length 500")
    .optional(),

  zip: z
    .string()
    .length(6, "pin code must be exacly 6 digits")
    .regex(/^[1-9][0-9]{5}$/, "Invalid Pin Code Format"),

  state: z.number().min(1, "Please select a state"),

  city: z.number().min(1, "Please select a city"),
});

export type PersonalDetail = z.infer<typeof personalDetailSchema>;
