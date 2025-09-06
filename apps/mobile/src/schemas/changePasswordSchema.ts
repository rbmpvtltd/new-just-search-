import { z } from "zod";

export const changePasswordSchema = z
  .object({
    cpass: z.string().min(1, "Password Should Not Be Empty"),
    newpass: z.string().min(8, "Password Should Be Have 8 Characters"),
    renewpass: z.string().min(8, "Password Should Be Have 8 Characters"),
  })
  .refine((data) => data.newpass === data.renewpass, {
    message: "New Password and Confirm password do not match",
    path: ["renewpass"],
  });

export type ChangePasswordData = z.infer<typeof changePasswordSchema>;
