import z from "zod";
import { JOB_DURATION, JOB_TYPE, WORK_SHIFT } from "../constants/hire";

export const preferredPositionSchema = z.object({
  jobType: z.array(z.enum(Object.values(JOB_TYPE))),
  // .min(1, "Please select at least one job type")
  locationPreferred: z.string().optional(),
  relocate: z.string().optional(),
  expectedSalaryFrom: z.string().optional(),
  expectedSalaryTo: z.string().optional(),
  jobDuration: z.array(z.enum(Object.values(JOB_DURATION))).optional(),
  fromHour: z.string().optional(),
  fromPeriod: z.string().optional(),
  toHour: z.string().optional(),
  toPeriod: z.string().optional(),
  workShift: z
    .array(z.enum(Object.values(WORK_SHIFT)))
    .min(1, "Please select at least one work shift"),
  availability: z.string().optional(),
});

export type PreferredPosition = z.infer<typeof preferredPositionSchema>;
