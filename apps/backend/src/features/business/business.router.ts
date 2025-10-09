import { db, schemas } from "@repo/db";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import z from "zod";
import { businessProcedure, router, visitorProcedure } from "@/utils/trpc";
import { changeRoleInSession } from "../auth/lib/session";
export const businessrouter = router({
  add: businessProcedure.query(async ({ ctx }) => {
    const getBusinessCategories = await db.query.businessCategories.findMany();
    const getBusinessSubCategories =
      await db.query.businessSubcategories.findMany();
    const getStates = await db.query.states.findMany();
    const getCities = await db.query.cities.findMany();

    return {
      getBusinessCategories,
      getBusinessSubCategories,
      getStates,
      getCities,
    };
    // const user = await db.query.users.findFirst({
    //   where: (user, { eq }) => eq(user.id, ctx.userId),
    // });
    // return user;
  }),

  create: visitorProcedure
    .input(
      z.object({
        name: z.string(),
        slug: z.string(),
        photo: z.string(),
        categoryId: z.number(),
        subcategoryId: z.array(z.number()),
        specialities: z.string(),
        description: z.string(),
        homeDelivery: z.boolean(),
        shopImages: z.array(z.string()),
        latitude: z.string(),
        longitude: z.string(),
        buildingName: z.string(),
        streetName: z.string(),
        area: z.string(),
        landmark: z.string(),
        pincode: z.number(),
        cityId: z.number(),
        stateId: z.number(),
        schedules: z.array(
          z.object({
            days: z.array(z.string()),
            openingTime: z.string(),
            openingTimePeriod: z.string(),
            closingTime: z.string(),
            closingTimePeriod: z.string(),
          }),
        ),
        phoneNumber: z.string(),
        email: z.string(),
        contactPerson: z.string(),
        ownerNumber: z.string(),
        whatsappNo: z.string(),
        alternativeMobileNumber: z.string(),
        facebook: z.string(),
        twitter: z.string(),
        linkedin: z.string(),
        listingVideo: z.string(),
        isFeature: z.string(),
      }),
    )
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

      // const existingHire = await db.query.hireListings.findFirst({
      //   where: (hireListings, { eq }) => eq(hireListings.userId, ctx.userId),
      // });

      const existingBusiness = await db.query.businessListings.findFirst({
        where: (businessListings, { eq }) =>
          eq(businessListings.userId, ctx.userId),
      });

      if (existingBusiness) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Business already exist",
        });
      }

      const existingEmail = await db.query.businessListings.findFirst({
        where: (businessListings, { eq }) =>
          eq(businessListings.email, input.email),
      });

      if (existingEmail) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Email address already exist",
        });
      }

      const isStateExists = await db.query.states.findFirst({
        where: (states, { eq }) => eq(states.id, input.stateId),
      });
      // return isStateExists;

      if (!isStateExists) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "State not found",
        });
      }

      const isCityExists = await db.query.cities.findFirst({
        where: (cities, { eq }) => eq(cities.id, input.cityId),
      });
      if (!isCityExists) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "City not found",
        });
      }

      const [createBusiness] = await db
        .insert(schemas.business.businessListings)
        .values({
          userId: ctx.userId,
          name: input.name,
          slug: input.slug,
          photo: input.photo,
          specialities: input.specialities,
          description: input.description,
          homeDelivery: input.homeDelivery === false,
          latitude: input.latitude,
          longitude: input.longitude,
          buildingName: input.buildingName,
          streetName: input.streetName,
          area: input.area,
          landmark: input.landmark,
          pincode: Number(input.pincode),
          cityId: Number(input.cityId),
          schedules: input.schedules,
          email: input.email,
          phoneNumber: input.phoneNumber,
          whatsappNo: input.whatsappNo,
          contactPerson: input.contactPerson,
          ownerNumber: input.ownerNumber,
          alternativeMobileNumber: input.alternativeMobileNumber,
          facebook: input.facebook,
          twitter: input.twitter,
          linkedin: input.linkedin,
          listingVideo: input.listingVideo,
          isFeature: input.isFeature === "true",
        })
        .returning({
          id: schemas.business.businessListings.id,
        });
      if (!createBusiness) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Failed to create business",
        });
      }
      const businessId = createBusiness.id;
      await db.insert(schemas.business.businessCategories).values({
        businessId,
        categoryId: input.categoryId,
      });

      if (input.subcategoryId.length > 0) {
        await db.insert(schemas.business.businessSubcategories).values(
          input.subcategoryId.map((subCategoryId) => ({
            businessId,
            subcategoryId: subCategoryId,
          })),
        );
      }
      await db.insert(schemas.business.businessPhotos).values({
        businessId,
        photo: input.photo,
      });
      await db.insert(schemas.business.businessPhotos).values(
        input.shopImages.map((image) => ({
          businessId,
          photo: image,
        })),
      );
      await db
        .update(schemas.auth.users)
        .set({
          role: "business",
        })
        .where(eq(schemas.auth.users.id, ctx.userId));

      changeRoleInSession(ctx.sessionId, "business");
      return { success: true, message: "Business created successfully" };
    }),

  show: businessProcedure.query(async ({ ctx }) => {
    const business = await db.query.businessListings.findFirst({
      where: (businessListings, { eq }) =>
        eq(businessListings.userId, ctx.userId),
    });

    if (!business) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Business not found",
      });
    }

    return business;
  }),
});
