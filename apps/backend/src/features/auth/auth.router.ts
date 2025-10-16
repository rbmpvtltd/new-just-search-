import { TRPCError } from "@trpc/server";
import z from "zod";
import {
  protectedProcedure,
  publicProcedure,
  router,
  visitorProcedure,
} from "@/utils/trpc";
import { checkPasswordGetUser } from "./auth.service";
import { createSession, deleteSession } from "./lib/session";

export const authRouter = router({
  login: publicProcedure
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
  testadmin: visitorProcedure.query(() => {
    return "yes";
  }),
  sendOTP: publicProcedure
    .input(z.object({ phoneNumber: z.string() }))
    .query(() => {
      // TODO: OTP in not complete
    }),
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
  logout: protectedProcedure.mutation(async ({ ctx }) => {
    await deleteSession(ctx.sessionId);
    return { success: true };
  }),
  dashboardverify: protectedProcedure.query(async ({ ctx }) => {
    if (
      ctx.role === "salesman" ||
      ctx.role === "franchises" ||
      ctx.role === "admin"
    )
      return { success: true };
    return { success: false };
  }),
});
