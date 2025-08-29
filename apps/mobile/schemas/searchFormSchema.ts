import { z } from "zod";

export const searchFormSchema = z.object({
  location: z
    .string()
    .min(3, "for search any location must should be 3 characters"),

  category: z.string().min(5, "category should be have atleast 5 characters"),
});

export type SearchFormData = z.infer<typeof searchFormSchema>;
