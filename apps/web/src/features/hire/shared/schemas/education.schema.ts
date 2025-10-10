import z from "zod";

export const educationSchema = z.object({
  // highestQualification: z.string().min(1, "Please select a qualification"),
  skillset: z.string(),
  // currentlyEmployed: z.string().min(1, "Please select an option"),
  // workExperienceYears: z.string().min(1, { message: "Please enter work experience" }),
  // workExperienceMonths: z.string().optional(),
  // jobRole: z.string().min(2, { message: "Please enter job role" }),
  // previousJobRole: z.string().optional(),
  // certificate: z.string().optional(),
});

export type EducationSchema = z.infer<typeof educationSchema>;
