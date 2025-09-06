import { z } from "zod";

export const businessDetailSchema = z.object({
  name: z
    .string()
    .min(5, "business name atleast contain 5 latter")
    .max(50, "business name should not be contain 50 or above characters")
    .regex(/^[A-Za-z\s]+$/, "Only alphabets are allowed"),

  photo: z.string(),
  image1: z.any().refine((file) => file !== undefined && file !== null, {
    message: "Image 1 is required",
  }),

  // optional images
  image2: z.any().optional(),
  image3: z.any().optional(),
  image4: z.any().optional(),
  image5: z.any().optional(),

  category_id: z.string().min(1, {
    message: "Please select at least one category for which you are applying",
  }),

  subcategory_id: z
    .array(
      z.string().min(1, {
        message:
          "Please select at least one sub-category for which you are applying",
      }),
    )
    .min(1, {
      message:
        "Please select at least one sub-category for which you are applying", // this handles empty array
    }),

  specialities: z.string().optional(),

  home_delivery: z.string().min(1, {
    message: "select atleat one option",
  }),

  description: z.string().optional(),
});

export type BusinessDetailData = z.infer<typeof businessDetailSchema>;
