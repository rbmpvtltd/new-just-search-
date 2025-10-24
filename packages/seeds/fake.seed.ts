import { db, schemas } from "@repo/db";
import {
  businessCategories,
  businessPhotos,
  businessReviews,
  businessSubcategories,
} from "@repo/db/dist/schema/business.schema";
import { productReviews } from "@repo/db/dist/schema/product.schema";
import { env, logger } from "@repo/helper";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { eq, inArray } from "drizzle-orm";

const users = schemas.auth.users;
const businessListings = schemas.business.businessListings;
const cities = schemas.not_related.cities;

dotenv.config();

export const fakeSeed = async () => {
  try {
    const user = await seedFakeUser();
    const business = await seedFakeBusiness(user!.id);
    logger.info("adding fake admin");
    await seedAdminUser();
    logger.info("added fake admin");
    return { user };
  } catch (error) {
    console.error("Error in fakeSeed:", error);
    throw error;
  }
};

export const fakeUserSeed = async () => {
  const [fakeUser] = await db
    .select()
    .from(users)
    .where(eq(users.email, "fake"));
  return fakeUser;
};

export const fakeBusinessSeed = async () => {
  const [fakeBusiness] = await db
    .select()
    .from(businessListings)
    .where(eq(businessListings.slug, "fake"));
  return fakeBusiness;
};

const seedAdminUser = async () => {
  try {
    logger.info("....start");
    // Pehle associated business listings delete karo
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, "admin@gmail.com"))
      .limit(1);

    if (existingUser) {
      logger.info(existingUser);

      return;
    }
    const salt = await bcrypt.genSalt(env.BCRYPT_SALT);
    const hashPassword = await bcrypt.hash("admin@123", salt);

    logger.info("....start ...");
    const [insertedAdmin] = await db
      .insert(users)
      .values({
        displayName: "admin",
        phoneNumber: "fake",
        email: "admin@gmail.com",
        password: hashPassword,
        role: "admin",
        googleId: "fake",
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return insertedAdmin;
  } catch (error) {
    console.error("Error in seedFakeUser:", error);
    throw error;
  }
};

const seedFakeUser = async () => {
  try {
    // Pehle associated business listings delete karo
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.displayName, "fake user"))
      .limit(1);

    if (existingUser) {
      // await db.delete(hireListing).where(eq(hireListing.userId, existingUser.id))
      try {
        // Delete all reviews tied to business listings
        await db
          .delete(businessReviews)
          .where(
            inArray(
              businessReviews.businessId,
              db
                .select({ id: businessListings.id })
                .from(businessListings)
                .where(eq(businessListings.userId, existingUser.id)),
            ),
          );

        // Delete product reviews (foreign key constraint shows this is required)
        await db
          .delete(productReviews)
          .where(
            inArray(
              productReviews.businessId,
              db
                .select({ id: businessListings.id })
                .from(businessListings)
                .where(eq(businessListings.userId, existingUser.id)),
            ),
          );

        await db
          .delete(businessPhotos)
          .where(
            inArray(
              businessPhotos.businessId,
              db
                .select({ id: businessListings.id })
                .from(businessListings)
                .where(eq(businessListings.userId, existingUser.id)),
            ),
          );

        await db
          .delete(businessCategories)
          .where(
            inArray(
              businessCategories.businessId,
              db
                .select({ id: businessListings.id })
                .from(businessListings)
                .where(eq(businessListings.userId, existingUser.id)),
            ),
          );

        await db
          .delete(businessSubcategories)
          .where(
            inArray(
              businessSubcategories.businessId,
              db
                .select({ id: businessListings.id })
                .from(businessListings)
                .where(eq(businessListings.userId, existingUser.id)),
            ),
          );

        // Finally, delete the business listings
        await db
          .delete(businessListings)
          .where(eq(businessListings.userId, existingUser.id));
      } catch (err: any) {
        console.error(
          "Error deleting businessListings line 105:",
          err?.cause?.message || err,
        );
      }

      try {
        await db.delete(users).where(eq(users.displayName, "fake user"));
      } catch (err: any) {
        console.error("Error deleting user:", err?.cause?.message || err);
      }
    }

    const uniqueEmail = `fake${Math.floor(Math.random() * 1000)}@example.com`;

    const [insertedUser] = await db
      .insert(users)
      .values({
        displayName: "fake user",
        phoneNumber: "fake",
        email: uniqueEmail,
        password: "fake",
        role: "visiter",
        googleId: "fake",
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return insertedUser;
  } catch (error) {
    console.error("Error in seedFakeUser:", error);
    throw error;
  }
};

const seedFakeBusiness = async (userId: number) => {
  try {
    // Pehle existing fake business delete karo
    await db.delete(businessListings).where(eq(businessListings.slug, "fake"));

    const [city] = await db
      .select()
      .from(cities)
      .where(eq(cities.city, "Jodhpur"));

    if (!city) {
      throw new Error("City 'Jodhpur' not found in database");
    }

    const [insertedBusiness] = await db
      .insert(businessListings)
      .values({
        userId,
        name: "fake",
        slug: "fake",
        photo: "fake",
        specialities: "fake",
        description: "fake",
        homeDelivery: true,
        latitude: "26.2389",
        longitude: "73.0243",
        buildingName: "fake",
        streetName: "fake",
        area: "fake",
        landmark: "fake",
        pincode: 342001,
        state: city.stateId,
        cityId: city.id,
        schedules: {},
        status: true,
        email: "fake@example.com",
        phoneNumber: "1234567890",
        whatsappNo: "1234567890",
        alternativeMobileNumber: "1234567890",
        facebook: "https://facebook.com/fake",
        twitter: "https://twitter.com/fake",
        linkedin: "https://linkedin.com/fake",
        listingVideo: "https://youtube.com/fake",
        isFeature: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return insertedBusiness;
  } catch (error) {
    console.error("Error in seedFakeBusiness:", error);
    throw error;
  }
};
