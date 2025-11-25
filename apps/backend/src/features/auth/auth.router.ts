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
import { sendSMSOTP } from "@/utils/optGenerator";
import { db } from "@repo/db";
import { userRoleEnum, users } from "@repo/db/dist/schema/auth.schema";
import { and, eq, or } from "drizzle-orm";
import { redis } from "@/lib/redis";
import bcrypt from "bcryptjs";
import { isEmail, isMobileNumber, normalizeMobile } from "@/utils/identifier";
import { verifyOTP } from "@/utils/varifyOTP";

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
    .input(z.object({ identifier: z.string() }))
    .mutation(async ({ input }) => {
      //TODO: add rate limiter for send otp in one minute
      const result = await sendSMSOTP(input.identifier);
      return {method : result?.method, success: true, message: `OTP send on ${input.identifier}` };
    }),
  verifyauth: protectedProcedure.query(async ({ ctx }) => {
    return { success: true, role: ctx.role };
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
    ) {
      return { success: true };
    }
    return { success: false };
  }),
  updateDisplayName: protectedProcedure
    .input(z.object({ userId: z.number(), displayName: z.string() }))
    .mutation(async ({ input }) => {
      const user = await db
        .update(users)
        .set({ displayName: input.displayName })
        .where(eq(users.id, input.userId))
        .returning();
      return {
        success: true,
        message: `user display name update successfully with ${input.displayName}`,
      };
    }),

  verifyOTP: publicProcedure
    .input(
      z.object({
        phoneNumber: z.string().length(10),
        otp: z.string().length(6),
        displayName: z.string().min(3).max(20),
        email: z.string().email().optional().nullable(),
        password: z.string().min(6),
      }),
    )
    .mutation(async ({ input }) => {
      const { phoneNumber, otp, displayName, email, password } = input;

      const isValid = await verifyOTP(String(email),otp);
      if (!isValid) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid OTP",
        });
      }

      const salt = await bcrypt.genSalt(Number(process.env.BCRYPT_SALT));
      const hashPassword = await bcrypt.hash(password, salt);

      let whereCondition: any;

      if (email) {
        whereCondition = or(
          eq(users.phoneNumber, phoneNumber),
          eq(users.email, email),
        );
      } else {
        whereCondition = eq(users.phoneNumber, phoneNumber);
      }

      const existingUser = await db.select().from(users).where(whereCondition);

      if (existingUser.length > 0) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Phone number Or Email already registered",
        });
      }

      const user = await db
        .insert(users)
        .values({
          displayName,
          email,
          password: hashPassword,
          phoneNumber,
          role: "visiter",
        })
        .returning();

      const session = await createSession(Number(user[0]?.id));
      // For now, just return success
      return {
        session: session?.token,
        role: session?.role,
        success: true,
        message: "User registered successfully",
        // userId: user.id, // if using DB
      };
    }),

  forgetPassword: publicProcedure
    .input(z.object({ identifier: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { identifier } = input;
      const isEmailInput = isEmail(identifier);
      const isMobileInput = isMobileNumber(identifier);

      if (!isEmailInput && !isMobileInput) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Please enter a valid email address or mobile number",
        });
      }

      if (isEmailInput) {
        // TODO: implement otp send on real email or phone number

        sendSMSOTP(identifier);
      } else {
        const normalNumber = normalizeMobile(identifier);
        sendSMSOTP(normalNumber);
      }
    }),

  resetPassword: publicProcedure
    .input(
      z.object({
        newPassword: z.string(),
        otp: z.string(),
        identifier: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const isValid = await verifyOTP(input.identifier, input.otp);
      if (!isValid) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid OTP",
        });
      }
      const salt = await bcrypt.genSalt(Number(process.env.BCRYPT_SALT));
      const hashPassword = await bcrypt.hash(input.newPassword, salt);
      const isEmailInput = isEmail(input.identifier);
      let whereCondition: any;
      if (isEmailInput) {
        whereCondition = eq(users.email, input.identifier);
      } else {
        whereCondition = eq(users.phoneNumber, input.identifier);
      }
      const [user] = await db
        .update(users)
        .set({ password: hashPassword })
        .where(whereCondition)
        .returning();
      return {
        success: true,
        message: "password updated successfully",
      };
    }),
});
