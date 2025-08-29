import { z } from "zod";

export const businessContactSchema = z.object({
  contact_person: z
    .string()
    .min(2, "person name for contact must be 2 character")
    .max(50, "personal should not be 50 or above characters"),

  phone_number: z.string().length(10, "Invalid Mobile Number"),

  owner_no: z.string().length(10, "Invalid Mobile Number"),

  whatsapp_no: z.string().length(10, "Invalid Whatsapp Number"),

  email: z.string().email("Invalid email address"),

  refer_code: z.string().min(1, "Please enter a refer code"),
});

export type BusinessContactData = z.infer<typeof businessContactSchema>;
