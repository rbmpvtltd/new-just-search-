import { z } from "zod";

export const personalDetailsFormSchema = z.object({
  photo: z.any().optional(),
  name: z
    .string()
    .min(2, "atleast two character should be in name")
    .max(25, "name should be under length 25"),
  father_name: z
    .string()
    .min(2, "Father name must have at least 2 characters")
    .max(25, "Father name must be under 25 characters")
    .regex(/^[A-Za-z\s]+$/, "Only alphabets are allowed"),

  dob: z.date({
    error: "Date of birth is required",
  }),

  gender: z.string().min(1, {
    message: "Please select your gender",
  }),

  marital_status: z.string().min(1, {
    message: "Please select your marital status",
  }),

  languages: z
    .array(
      z.string({
        error: "Please select at least one language",
      }),
    )
    .min(1, "Please select at least one language"),
  real_address: z
    .string()
    .min(10, "Address must be at least 10 characters long")
    .max(100, "Address must be at most 100 characters long"),

  latitude: z
    .string()
    .regex(/^-?\d+(\.\d+)?$/, "Invalid latitude format (e.g., 26.9124)")
    .refine(
      (val) => {
        const num = parseFloat(val);
        return num >= -90 && num <= 90;
      },
      {
        message: "Latitude must be between -90 and 90",
      },
    ),

  longitude: z
    .string()
    .regex(/^-?\d+(\.\d+)?$/, "Invalid longitude format (e.g., 75.7873)")
    .refine(
      (val) => {
        const num = parseFloat(val);
        return num >= -180 && num <= 180;
      },
      {
        message: "Longitude must be between -180 and 180",
      },
    ),

  pincode: z
    .string()
    .length(6, "Pincode must be exactly 6 digits")
    .regex(/^[1-9][0-9]{5}$/, "Invalid pincode format"),

  category_id: z.string().min(1, {
    message: "Please select at least one category for which you are applying",
  }),

  state: z.number().min(1, "Please select a state"),

  city: z.number().min(1, "Please select a city"),

  phone_number: z
    .string()
    .min(10, "Mobile number must be at least 10 digits")
    .max(15, "Mobile number must be at most 15 digits")
    .regex(/^[0-9]{10,15}$/, "Invalid mobile number"),

  alternative_mobile_number: z.string().optional(),

  subcategory_id: z
    .array(
      z.string().min(1, {
        message:
          "Please select at least one sub-category for which you are applying",
      }),
    )
    .min(1, {
      message:
        "Please select at least one sub-category for which you are applying",
    }),

  email: z.string().email("Invalid email address"),
});

export type PersonalDetailsFormType = z.infer<typeof personalDetailsFormSchema>;
