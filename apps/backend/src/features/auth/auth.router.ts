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
  googleLogin: publicProcedure.query(async ({ ctx }) => {
    const redirectUrl =
      "https://accounts.google.com/o/oauth2/v2/auth?" +
      new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        redirect_uri: "http://localhost:4000/auth/google/callback", // oo url apne google console me authorized redirect url me add karno howe
        response_type: "code",
        scope: "profile email",
      }).toString();
    return { url: redirectUrl };
  }),
  appleLogin: publicProcedure.query(async () => {
    const redirectUrl =
      "https://appleid.apple.com/auth/authorize?" +
      new URLSearchParams({
        response_type: "code",
        response_mode: "form_post", // <-- change here
        client_id: process.env.APPLE_CLIENT_ID!,
        redirect_uri:
          "https://esthetical-cletus-pessimistically.ngrok-free.dev/auth/apple/callback",
        scope: "name email", // name/email requires form_post
        state: crypto.randomUUID(),
      }).toString();
    return { url: redirectUrl };
  }),

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
      return { session: session?.token, role: session?.role };
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
  verifyauth: protectedProcedure.query(async ({ctx}) => {
    return { success: true,role : ctx.role };
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
