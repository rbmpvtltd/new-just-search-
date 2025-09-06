import { z } from "zod";

export const qualificationsAndSkillsFormSchema = z.object({
  highest_qualification: z
    .string()
    .min(1, "Please select at least one qualification"),

  skillset: z.string().optional(),

  employment_status: z.string().min(1, "Please select your employment status"),

  work_experience_year: z
    .string()
    .min(1, "Please select at least one work experience"),

  work_experience_month: z
    .string()
    .min(1, "Please select at least one work experience"),

  job_role: z.string().min(1, "Please select at least one job role"),

  previous_job_role: z.string().optional(),

  certificates: z.any().optional(),
});

export type QualificationsAndSkillsFormType = z.infer<
  typeof qualificationsAndSkillsFormSchema
>;
