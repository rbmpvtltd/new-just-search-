import { z } from "zod";

export const reviewSchema = z.object({
  listing_id: z.number(),
  rate: z.number().min(1, "Please select a rating"),
  name: z.string().min(1, "Please enter your name"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(1, "Please enter a message"),
});

export type reviewSchemaType = z.infer<typeof reviewSchema>;
