import { db, schemas } from "@repo/db";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import z from "zod";
import { protectedProcedure, router } from "@/utils/trpc";

export const userRouter = router({
  editProfile: protectedProcedure.query(async ({ ctx }) => {
    const getStates = await db.query.states.findMany();
    const getCities = await db.query.cities.findMany();
    return { getStates, getCities };
  }),

  updateProfile: protectedProcedure
    .input(
      z.object({
        profileImage: z.string(),
        salutation: z.string(),
        firstName: z.string().min(3, "First Name atleast contain 3 latter"),
        lastName: z.string(),
        email: z.string(),
        dateOfBirth: z.string(),
        occupation: z.string(),
        maritalStatus: z.enum(["married", "unmarried", "widowed", "divorced"]),
        area: z.string(),
        pincode: z.string(),
        city: z.number(),
        state: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const existingEmail = await db.query.users.findFirst({
        where: (users, { eq }) => eq(users.email, input.email),
      });

      if (existingEmail) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Something went wrong, Email already exits",
        });
      }
      const isStateExists = await db.query.states.findFirst({
        where: (states, { eq }) => eq(states.id, input.state),
      });

      if (!isStateExists) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "State not found",
        });
      }

      const isCityExists = await db.query.cities.findFirst({
        where: (cities, { eq }) => eq(cities.id, input.city),
      });

      if (!isCityExists) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "City not found",
        });
      }

      const profileExists = await db.query.profiles.findFirst({
        where: (userProfiles, { eq }) => eq(userProfiles.userId, ctx.userId),
      });
      if (!profileExists) {
        const createUser = await db.insert(schemas.user.profiles).values({
          userId: ctx.userId,
          ...input,
        });
      } else {
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
            address: input.area,
            dob: input.dateOfBirth,
            area: input.area,
            pincode: input.pincode,
            city: input.city,
            // ...input,
          })
          .where(eq(schemas.user.profiles.id, ctx.userId));
      }

      return { success: true, message: "Profile updated successfully" };
    }),

  getUserProfile: protectedProcedure.query(async ({ ctx }) => {
    const profile = await db.query.profiles.findFirst({
      where: (userProfiles, { eq }) => eq(userProfiles.userId, ctx.userId),
    });

    return { profile };
  }),
});
