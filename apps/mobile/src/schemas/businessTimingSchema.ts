import { z } from "zod";

export const businessDetailSchema = z.object({
  opens_at_hour: z.string().optional(),
  opens_at_period: z.string().optional(),
  closes_at_hour: z.string().optional(),
  closes_at_period: z.string().optional(),
  days: z
    .array(
      z.string().min(3, {
        message:
          "Please select at least one sub-category for which you are applying",
      }),
    )
    .optional(),
});

export type BusinessDetailData = z.infer<typeof businessDetailSchema>;
