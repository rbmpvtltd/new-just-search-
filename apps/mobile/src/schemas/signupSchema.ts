import { z } from "zod";

export const signupSchema = z
  .object({
    mobile_no: z.string().length(10, "Invalid Mobile Number"),

    otp: z.string().length(6, "Invalid OTP"),

    email: z.string().email({ message: "Invalid Email Address" }),

    password: z.string().min(6, "Password Must Be 6 Character"),

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"], // 👈 error confirmPassword field me show hoga
  });

export type SignupFormData = z.infer<typeof signupSchema>;
