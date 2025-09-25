import { TRPCError } from "@trpc/server";
import z from "zod";
import { protectedProcedure, publicProcedure, router } from "@/utils/trpc";
import { checkPasswordGetUser } from "./auth.service";
import { createSession } from "./lib/session";

export const authRouter = router({
  login: publicProcedure
    .input(z.object({ username: z.string(), password: z.string().min(6) }))
    .query(async ({ input }) => {
      const user = await checkPasswordGetUser(input.username, input.password);

      if (!user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "your credential is not correct",
        });
      }
      const session = await createSession(user.id);
      return session?.token;
    }),
  sendOTP: publicProcedure.input(z.object({phoneNumber: z.string()})).query(hh)
  register: publicProcedure
    .input(z.object({ username: z.string(), password: z.string().min(6) }))
    .mutation(async ({ input }) => {
      const user = await checkPasswordGetUser(input.username, input.password);

      if (!user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "your credential is not correct",
        });
      }
      const session = await createSession(user.id);
      return session?.token;
    }),
  verifyauth: protectedProcedure.query(async () => {
    return { success: true };
  }),
  logout: protectedProcedure.query(async ({ ctx }) => {
    // TODO: logout is not proper;
    const userId = ctx.userId;
    return userId;
  }),
});

export type AuthRouter = typeof authRouter;
