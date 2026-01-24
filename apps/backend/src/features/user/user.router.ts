import { db, schemas } from "@repo/db";
import { plans, planUserActive } from "@repo/db/dist/schema/plan.schema";
import {
  account_delete_request,
  feedbackInsertSchema,
  profiles,
  profileUpdateSchema,
  requestAccountsInsertSchema,
} from "@repo/db/dist/schema/user.schema";
import { logger } from "@repo/logger";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import z from "zod";
import { protectedProcedure, router } from "@/utils/trpc";

export const userRouter = router({
  edit: protectedProcedure.query(async ({ ctx }) => {
    const getStates = await db.query.states.findMany();
    const getOccupations = await db.query.occupation.findMany();
    const getSlutation = await db.query.salutation.findMany();
    const userEmail = (
      await db.query.users.findFirst({
        where: (users, { eq }) => eq(users.id, ctx.userId),
        columns: {
          email: true,
        },
      })
    )?.email;
    const profile = await db.query.profiles.findFirst({
      where: (userProfiles, { eq }) => eq(userProfiles.userId, ctx.userId),
    });

    const plan = (
      await db
        .select({
          name: plans.name,
        })
        .from(planUserActive)
        .leftJoin(plans, eq(plans.id, planUserActive.planId))
        .where(eq(planUserActive.userId, ctx.userId))
    )[0];
    const role = ctx.role;
    return {
      role,
      plan,
      profile,
      userEmail,
      getStates,
      getSlutation,
      getOccupations,
    };
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
      profileUpdateSchema.omit({
        userId: true,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      console.log("Hiii", input);

      // const isStateExists = await db.query.states.findFirst({
      //   where: (states, { eq }) => eq(states.id, Number(input.state)),
      // });

      // if (!isStateExists) {
      //   throw new TRPCError({
      //     code: "NOT_FOUND",
      //     message: "State not found",
      //   });
      // }

      // const isCityExists = await db.query.cities.findFirst({
      //   where: (cities, { eq }) => eq(cities.id, Number(input.city)),
      // });

      // if (!isCityExists) {
      //   throw new TRPCError({
      //     code: "NOT_FOUND",
      //     message: "City not found",
      //   });
      // }

      const profileExists = await db.query.profiles.findFirst({
        where: (userProfiles, { eq }) => eq(userProfiles.userId, ctx.userId),
      });

      console.log("profile E", profileExists, ctx.userId);

      if (!profileExists) {
        const createUser = await db.insert(profiles).values({
          userId: ctx.userId,
          profileImage: input.profileImage,
          salutation: input.salutation,
          firstName: input.firstName,
          lastName: input.lastName,
          occupation: input.occupation,
          dob: input.dob,
          maritalStatus: input.maritalStatus,
          address: input.address,
          pincode: input.pincode,
          city: input.city ?? 0,
          state: input.state ?? 0,
        });
      } else {
        const updateProfile = await db
          .update(profiles)
          .set({
            profileImage: input.profileImage,
            userId: ctx.userId,
            salutation: input.salutation,
            firstName: input.firstName,
            lastName: input.lastName,
            occupation: input.occupation,
            maritalStatus: input.maritalStatus,
            address: input.address,
            dob: input.dob,
            pincode: input.pincode,
            city: input.city,
            state: input.state,
          })
          .where(eq(schemas.user.profiles.userId, ctx.userId));
      }

      return { success: true, message: "Profile updated successfully" };
    }),

  getUserProfile: protectedProcedure.query(async ({ ctx }) => {
    console.log("Hiii");

    const userEmail = (
      await db.query.users.findFirst({
        where: (users, { eq }) => eq(users.id, ctx.userId),
        columns: {
          email: true,
        },
      })
    )?.email;

    const profile = await db.query.profiles.findFirst({
      where: (userProfiles, { eq }) => eq(userProfiles.userId, ctx.userId),
      columns: {
        profileImage: true,
        salutation: true,
        firstName: true,
        lastName: true,
        address: true,
      },
    });

    const plan = (
      await db
        .select({
          name: plans.name,
        })
        .from(planUserActive)
        .leftJoin(plans, eq(plans.id, planUserActive.planId))
        .where(eq(planUserActive.userId, ctx.userId))
    )[0];
    const role = ctx.role;
    logger.info("profile is", profile);
    logger.info("plan is", plan);
    logger.info("role is", role);
    logger.info("userEmail is", userEmail);
    return { role, profile, plan, userEmail };
  }),
  getUserDetail: protectedProcedure.query(async ({ ctx }) => {
    const user = await db.query.users.findFirst({
      where: (userDetail, { eq }) => eq(userDetail.id, ctx.userId),
    });

    return user;
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

      await db.insert(account_delete_request).values({
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
