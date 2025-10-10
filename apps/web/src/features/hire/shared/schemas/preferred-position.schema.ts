import z from "zod";

export const preferredPositionSchema = z.object({
  jobType: z.array(z.string()).min(1, "Please select at least one job type"),
  // locationPreferred: z.string().optional(),
  // relocate: z.enum(relocateValue).optional(),
  // expectedSalaryFrom: z.string().optional(),
  // expectedSalaryTo: z.string().optional(),
  // jobDuration: z.array(z.string()).optional(),
  // fromHour: z.string().optional(),
  // fromPeriod: z.string().optional(),
  // toHour: z.string().optional(),
  // toPeriod: z.string().optional(),
  // workShift: z.array(z.string()).min(1, "Please select at least one work shift"),
  availability: z.string(),
});

export type PreferredPosition = z.infer<typeof preferredPositionSchema>;
