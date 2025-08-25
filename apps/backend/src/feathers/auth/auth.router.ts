import { TRPCError } from "@trpc/server";
import z from "zod";
import { publicProcedure, router } from "../../utils/trpc";
import { checkUserPassword, generateToken } from "./auth.service";

export const authRouter = router({
  checkUserPassword: publicProcedure
    .input(z.object({ email: z.string(), password: z.string() }))
    .query(async ({ input }) => {
      const isCredentialCorrect = checkUserPassword(
        input.email,
        input.password,
      );

      if (!isCredentialCorrect) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "your credential is not correct",
        });
      }

      const token = generateToken();

      return token;
    }),
});
