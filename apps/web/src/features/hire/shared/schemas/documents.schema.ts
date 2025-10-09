import { z } from "zod";
// import { ID_PROOF } from "../constants/hire";

// const idProofValue = ID_PROOF.map((idProof) => idProof.value);

export const documentSchema = z.object({
  // idProof: z.enum(idProofValue, {
  //   message: "Please select at least one option",
  // }),
  // idProofPhoto: z.string().min(1, "Please upload your photo"),
  coverLetter: z.string(),
  // resumePdf: z.string().optional(),
  // aboutYourself: z.string().optional(),
  // referCode: z
  //   .string()
  //   .min(12, "Referral code must be at least 10 characters")
  //   .max(20, "Referral code must not exceed 20 characters"),
});

export type DocumentSchema = z.infer<typeof documentSchema>;
