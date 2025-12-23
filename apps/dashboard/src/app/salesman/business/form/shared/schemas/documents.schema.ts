import { z } from "zod";

export const documentSchema = z.object({
  idProof: z.string().min(1, "Please upload your photo"),
  idProofPhoto: z.string().min(1, "Please upload your photo"),
  coverLetter: z.string().optional(),
  resumePdf: z.string().optional(),
  aboutYourself: z.string().optional(),
  referCode: z
    .string()
    .optional()
});

export type DocumentSchema = z.infer<typeof documentSchema>;
