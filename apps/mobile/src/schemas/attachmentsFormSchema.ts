import { z } from "zod";

export const attachmentsFormSchema = z.object({
  id_proof: z.string().min(1, "Please upload an ID proof"),
  id_proof_photo: z
    .string()
    .nullable()
    .refine((val) => val !== null && val.trim() !== "", {
      message: "Please upload an ID proof",
    }),

  resume_photo: z.any().optional(),
  resume: z.string().optional(),
  about_yourself: z.string().optional(),
  refer_code: z.string().min(1, "Please enter a refer code"),
});

export type AttachmentsFormSchemaType = z.infer<typeof attachmentsFormSchema>;
