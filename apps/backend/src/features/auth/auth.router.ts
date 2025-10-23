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
import { db, schemas } from "@repo/db";
import {eq} from "drizzle-orm"
import { UserRole } from "@repo/db/src/schema/auth.schema";

console.log("GOOGLE credentials is ", process.env.GOOGLE_CLIENT_ID)
console.log("GOOGLE credentials is ", process.env.GOOGLE_CLIENT_SECRET)



export const authRouter = router({
  googleLogin: publicProcedure.query(async ({ ctx }) => {
    console.log("google login procedure calling here")
    const redirectUrl = "https://accounts.google.com/o/oauth2/v2/auth?" +
      new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        redirect_uri: "http://localhost:4000/auth/google/callback", // oo url apne google console me authorized redirect url me add karno howe
        response_type: "code",
        scope: "profile email",
      }).toString();
    console.log("redirecting to url",redirectUrl)
    return { url: redirectUrl };
  }),
  appleLogin: publicProcedure.query(async () => {
    const redirectUrl =
      "https://appleid.apple.com/auth/authorize?" +
      new URLSearchParams({
        response_type: "code",
        response_mode: "form_post",  // <-- change here
        client_id: process.env.APPLE_CLIENT_ID!,
        redirect_uri: "https://esthetical-cletus-pessimistically.ngrok-free.dev/auth/apple/callback",
        scope: "name email",         // name/email requires form_post
        state: crypto.randomUUID(),
      }).toString();
      console.log("redirected successfully on ",redirectUrl)
  
    return { url: redirectUrl };
  }),

  login: publicProcedure
    .input(z.object({ username: z.string(), password: z.string().min(6) }))
    .mutation(async ({ input }) => {
      console.log("input", input);

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
