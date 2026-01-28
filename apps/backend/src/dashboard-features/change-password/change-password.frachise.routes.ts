import { db } from "@repo/db";
import { users } from "@repo/db/dist/schema/auth.schema";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import z from "zod";
import { franchisesProcedure, router } from "@/utils/trpc";

const changePasswordSchema = z
  .object({
    current_password: z
      .string()
      .min(6, { message: "Current password is required" }),
    new_password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
    confirm_new_password: z
      .string()
      .min(6, { message: "Please confirm your new password" }),
  })
  .refine((data) => data.new_password !== data.current_password, {
    message: "New password must be different from current password",
    path: ["new_password"],
  })
  .refine((data) => data.new_password === data.confirm_new_password, {
    message: "Password and confirm password do not match",
    path: ["confirm_new_password"],
  });

export const franchiseChangePasswordRouter = router({
  update: franchisesProcedure
    .input(changePasswordSchema)
    .mutation(async ({ input, ctx }) => {
      const user = await db.query.users.findFirst({
        where: (users, { eq }) => eq(users.id, ctx.userId),
      });

      const isPasswordCorrect = await bcrypt.compare(
        input.current_password,
        String(user?.password),
      );

      if (!isPasswordCorrect) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Current password is incorrect",
        });
      }

      const salt = await bcrypt.genSalt(Number(process.env.BCRYPT_SALT));
      const hashPassword = await bcrypt.hash(input.new_password, salt);

      await db
        .update(users)
        .set({ password: hashPassword })
        .where(eq(users.id, ctx.userId));
      return { message: "Password updated successfully" };
    }),
});
