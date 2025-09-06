import { z } from "zod";

export const loginBusinesSchema = z.object({
  mobile_no: z
    .string()
    .min(10, "Mobile number must be at least 10 characters")
    .max(12, "Mobile number must be at most 12 characters"),
  password: z.string().min(1, "Password Should Not Be Empty"),
});

export type LoginBusinessFormData = z.infer<typeof loginBusinesSchema>;

export const loginVisitorSchema = z.object({
  mobile_no: z
    .string()
    .min(10, "Mobile number must be at least 10 characters")
    .max(12, "Mobile number must be at most 12 characters"),
  otp: z.string().length(6, "Invalid Otp"),
});

export type LoginVisitorFormData = z.infer<typeof loginVisitorSchema>;

export const forgetPasswordSchema = z.object({
  mobile_no: z
    .string()
    .min(10, "Mobile number must be at least 10 characters")
    .max(12, "Mobile number must be at most 12 characters"),

  otp: z.string().length(6, "Invalid Otp"),
  password: z.string().min(1, "Password Should Not Be Empty"),
});

export type ForgetPasswordFormData = z.infer<typeof forgetPasswordSchema>;
