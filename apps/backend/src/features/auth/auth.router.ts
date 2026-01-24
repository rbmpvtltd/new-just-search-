import { db } from "@repo/db";
import { UserRole } from "@repo/db/dist/enum/allEnum.enum";
import { users } from "@repo/db/dist/schema/auth.schema";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcryptjs";
import { eq, or } from "drizzle-orm";
import { OAuth2Client } from "google-auth-library";
import z from "zod";
import { isEmail, isMobileNumber, normalizeMobile } from "@/utils/identifier";
import { sendSMSOTP } from "@/utils/optGenerator";
import {
  protectedProcedure,
  publicProcedure,
  router,
  visitorProcedure,
} from "@/utils/trpc";
import { verifyOTP } from "@/utils/varifyOTP";
import { checkPasswordGetUser } from "./auth.service";
import {
  createSession,
  deleteSession,
  validateSessionToken,
} from "./lib/session";
import env from "@/utils/envaild";

const googleClient = new OAuth2Client(process.env.GOOGLE_ANDROID_CLIENT_ID);

export const authRouter = router({
  googleLogin: publicProcedure.query(async ({ ctx }) => {
    console.log("=====>===>",env.GOOGLE_REDIRECT_URI)
    console.log("=====>===>",env.GOOGLE_CLIENT_ID)

    const redirectUrl =
      "https://accounts.google.com/o/oauth2/v2/auth?" +
      new URLSearchParams({
        client_id: env.GOOGLE_CLIENT_ID,
        redirect_uri: env.GOOGLE_REDIRECT_URI, // oo url apne google console me authorized redirect url me add karno howe
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
  mobileOauth: publicProcedure
    .input(
      z.object({
        provider: z.enum(["google", "apple"]),
        idToken: z.string().nullable(),
        user: z.object({
          id: z.string(),
          email: z.string().nullable(),
          name: z.string().nullable(),
        }),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        let verifiedUser: {
          id: string;
          email: string | null;
          name: string | null;
          givenName: string | null;
        };

        console.log("execution comes here");

        if (input.provider === "google") {
          // Verify Google token
          if (!input.idToken) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "ID token required for Google sign-in",
            });
          }

          const ticket = await googleClient.verifyIdToken({
            idToken: input.idToken,
            audience: process.env.GOOGLE_ANDROID_CLIENT_ID,
          });

          const payload = ticket.getPayload();
          if (!payload) {
            throw new TRPCError({
              code: "UNAUTHORIZED",
              message: "Invalid Google token",
            });
          }

          verifiedUser = {
            id: payload.sub,
            email: payload.email || null,
            name: payload.name || null,
            givenName: payload.given_name || null,
          };
        } else {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Invalid provider",
          });
        }
        console.log("======= Verified User =========", input);

        const existingUser = await db
          .select()
          .from(users)
          .where(eq(users.email, verifiedUser.email ?? ""));
        let user = existingUser[0];
        if (!user) {
          const inserted = await db
            .insert(users)
            .values({
              displayName: verifiedUser.name || verifiedUser?.givenName,
              email: verifiedUser.email,
              role: UserRole.guest,
              googleId: verifiedUser.id,
              createdAt: new Date(),
            })
            .returning();

          user = inserted[0];
        }
        const session = await createSession(Number(user?.id));

        return {
          data: session,
          success: true,
        };
      } catch (error: any) {
        console.error("Login error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error.message || "Authentication failed",
        });
      }
    }),

  login: publicProcedure
    .input(z.object({ username: z.string(), password: z.string().min(6) }))
    .mutation(async ({ input }) => {
      console.log("=======================dsdss========");
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
  loginMobile: publicProcedure
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
      return {
        session: session?.token,
        role: session?.role,
        ravanueCatId: user.revanueCatId,
      };
    }),
  testadmin: visitorProcedure.query(() => {
    return "yes";
  }),
  sendOTP: publicProcedure
    .input(z.object({ phone: z.string(), email: z.string().optional() }))
    .mutation(async ({ input }) => {
      const { phone, email } = input;
      let whereCondition: any;

      if (email) {
        whereCondition = or(
          eq(users.phoneNumber, phone),
          eq(users.email, email),
        );
      } else {
        whereCondition = eq(users.phoneNumber, phone);
      }
      const existingUser = await db.select().from(users).where(whereCondition);

      if (existingUser.length > 0) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Phone number Or Email already registered",
        });
      }

      const result = await sendSMSOTP(input.phone);
      return {
        method: result?.method,
        success: true,
        message: `OTP send on ${input.phone}`,
      };
    }),
  verifyauth: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.token) {
      return { success: false };
    }

    const session = await validateSessionToken(ctx.token);
    if (!session) {
      return { success: false };
    }

    return { success: true, role: session.role };
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
      return { success: true, role: ctx.role };
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
        email: z.string().email().optional().or(z.literal("")),
        password: z.string().min(6),
      }),
    )
    .mutation(async ({ input }) => {
      const { phoneNumber, otp, displayName, email, password } = input;
      console.log("auth.router.ts:149 :: input is =>", input);

      let isValid = await verifyOTP(String(phoneNumber), otp);
      // if (email) {
      //   isValid = await verifyOTP(String(email), otp);
      // } else {
      //   isValid = await verifyOTP(String(phoneNumber), otp);
      // }
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
        const existingUser = await db
          .select()
          .from(users)
          .where(eq(users.email, identifier));

        if (existingUser.length === 0) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Phone number Or Email not registered yet",
          });
        }
        sendSMSOTP(identifier);
      } else {
        const normalNumber = normalizeMobile(identifier);
        const existingUser = await db
          .select()
          .from(users)
          .where(eq(users.phoneNumber, identifier));

        if (existingUser.length === 0) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Phone number Or Email not registered yet",
          });
        }
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
