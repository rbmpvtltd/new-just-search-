import { z } from "zod";

export const loginSchema = z.object({
  username: z
    .string()
    .min(2, "Email/Mobile should be at least 2 characters")
    .max(50, "Email/Mobile should be at most 50 characters")
    .refine(
      (value) => {
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

        const isMobile = /^[6-9]\d{9}$/.test(value); // Indian mobile number

        return isEmail || isMobile;
      },
      {
        message: "Enter a valid Email or Mobile number",
      },
    ),

  password: z.string().min(1, "Password should not be empty"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

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
