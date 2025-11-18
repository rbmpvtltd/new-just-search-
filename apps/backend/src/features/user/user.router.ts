import { db, schemas } from "@repo/db";
import {
  feedbackInsertSchema,
  requestAccountsInsertSchema,
  userUpdateSchema,
} from "@repo/db/src/schema/user.schema";
import { logger } from "@repo/logger";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import z from "zod";
import { protectedProcedure, router } from "@/utils/trpc";

export const userRouter = router({
  add: protectedProcedure.query(async ({ ctx }) => {
    const getStates = await db.query.states.findMany();
    return { getStates };
  }),

  getCities: protectedProcedure
    .input(z.object({ state: z.number() }))
    .query(async ({ input }) => {
      const cities = await db.query.cities.findMany({
        where: (cities, { eq }) => eq(cities.stateId, input.state),
      });
      return cities;
    }),
  update: protectedProcedure
    .input(
      userUpdateSchema.omit({
        userId: true,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const existingEmail = await db.query.users.findFirst({
        where: (users, { eq }) => eq(users.email, String(input.email)),
      });

      if (existingEmail) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Something went wrong, Email already exits",
        });
      }
      const isStateExists = await db.query.states.findFirst({
        where: (states, { eq }) => eq(states.id, Number(input.state)),
      });

      if (!isStateExists) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "State not found",
        });
      }

      const isCityExists = await db.query.cities.findFirst({
        where: (cities, { eq }) => eq(cities.id, Number(input.city)),
      });

      if (!isCityExists) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "City not found",
        });
      }

      const profileExists = await db.query.profiles.findFirst({
        where: (userProfiles, { eq }) => eq(userProfiles.userId, ctx.userId),
      });

      logger.info("profileExists", profileExists);
      if (!profileExists) {
        const createUser = await db.insert(schemas.user.profiles).values({
          userId: ctx.userId,
          profileImage: input.profileImage,
          salutation: input.salutation,
          firstName: input.firstName,
          lastName: input.lastName,
          occupation: input.occupation,
          dob: input.dob,
          email: input.email,
          maritalStatus: input.maritalStatus,
          area: input.area,
          address: input.address,
          pincode: input.pincode,
          city: input.city ?? 0,
          state: input.state ?? 0,
        });
      } else {
        logger.info("indside update ", input);
        const updateProfile = await db
          .update(schemas.user.profiles)
          .set({
            profileImage: input.profileImage,
            userId: ctx.userId,
            salutation: input.salutation,
            firstName: input.firstName,
            lastName: input.lastName,
            occupation: input.occupation,
            maritalStatus: input.maritalStatus,
            email: input.email,
            address: input.area,
            dob: input.dob,
            area: input.area,
            pincode: input.pincode,
            city: input.city,
            state: input.state,
          })
          .where(eq(schemas.user.profiles.userId, ctx.userId));
      }

      return { success: true, message: "Profile updated successfully" };
    }),

  getUserProfile: protectedProcedure.query(async ({ ctx }) => {
    const profile = await db.query.users.findFirst({
      where: (userProfiles, { eq }) => eq(userProfiles.id, ctx.userId),
    });

    const role = ctx.role;
    return { ...profile, role };
  }),

  accountDeleteRequest: protectedProcedure
    .input(requestAccountsInsertSchema)
    .mutation(async ({ ctx, input }) => {
      const user = await db.query.users.findFirst({
        where: (users, { eq }) => eq(users.id, ctx.userId),
      });

      if (!user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not found",
        });
      }

      await db.insert(schemas.user.request_accounts).values({
        reason: input.reason,
        userId: ctx.userId,
      });

      return {
        success: true,
        message: "Request sent successfully",
      };
    }),

  feedback: protectedProcedure
    .input(feedbackInsertSchema)
    .mutation(async ({ ctx, input }) => {
      const user = await db.query.users.findFirst({
        where: (users, { eq }) => eq(users.id, ctx.userId),
      });

      if (!user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not found",
        });
      }

      await db.insert(schemas.user.feedbacks).values({
        userId: user.id,
        feedbackType: Array.isArray(input.feedbackType)
          ? input.feedbackType
          : JSON.parse(input.feedbackType || ""),
        additionalFeedback: input.additionalFeedback,
      });

      return {
        success: true,
        message: "Feedback sent successfully",
      };
    }),
});
