// // import dotenv from "dotenv";
// // import { eq } from "drizzle-orm";
// // import { db } from "@/config/dbConnections";
// // import { users } from "@/features/auth/auth.model";
// // import { businessListings } from "@/features/business/business.model";
// // import { cities } from "@/features/not-related/address/address.model";
// // import { UserRole } from "@/types/auth";

// // dotenv.config();

// // export const fakeSeed = async () => {
// //   try {
// //     const user = await seedFakeUser(1);
// //     const business = await seedFakeBusiness(user.id);
// //     return { user, business };
// //   } catch (error) {
// //     console.error("Error in fakeSeed:", error);
// //     throw error;
// //   }
// // };

// // export const fakeUserSeed = async () => {
// //   const [fakeUser] = await db
// //     .select()
// //     .from(users)
// //     .where(eq(users.username, "fake"));
// //   return fakeUser;
// // };

// // export const fakeBusinessSeed = async () => {
// //   const [fakeBusiness] = await db
// //     .select()
// //     .from(businessListings)
// //     .where(eq(businessListings.slug, "fake"));
// //   return fakeBusiness;
// // };

// // const seedFakeUser = async (userId: number) => {
// //   await db.delete(users).where(eq(users.username, "fake"));

// //   const uniqueEmail = `fake${Math.floor(Math.random() * 1000)}@example.com`;

// //   const [insertedUser] = await db
// //     .insert(users)
// //     .values({
// //       username: "fake",
// //       phoneNumber: "fake",
// //       email: uniqueEmail,
// //       password: "fake",
// //       role: UserRole.visiter,
// //       googleId: "fake",
// //       createdAt: new Date(),
// //       updatedAt: new Date(),
// //     })
// //     .returning();

// //   return insertedUser;
// // };

// // const seedFakeBusiness = async (userId: number) => {
// //   // Ab business delete karo
// //   await db.delete(businessListings).where(eq(businessListings.slug, "fake"));

// //   const [city] = await db
// //     .select()
// //     .from(cities)
// //     .where(eq(cities.city, "Jodhpur"));

// //   if (!city) {
// //     throw new Error("City 'Jodhpur' not found in database");
// //   }

// //   const [insertedBusiness] = await db
// //     .insert(businessListings)
// //     .values({
// //       userId,
// //       name: "fake",
// //       slug: "fake",
// //       photo: "fake",
// //       specialities: "fake",
// //       description: "fake",
// //       homeDelivery: true,
// //       latitude: "fake",
// //       longitude: "fake",
// //       buildingName: "fake",
// //       streetName: "fake",
// //       area: "fake",
// //       landmark: "fake",
// //       pincode: 0,
// //       cityId: city.id,
// //       schedules: {},
// //       status: true,
// //       email: "fake",
// //       phoneNumber: "fake",
// //       whatsappNo: "fake",
// //       alternativeMobileNumber: "fake",
// //       facebook: "fake",
// //       twitter: "fake",
// //       linkedin: "fake",
// //       listingVideo: "fake",
// //       isFeature: true,
// //       createdAt: new Date(),
// //       updatedAt: new Date(),
// //     })
// //     .returning();

// //   return insertedBusiness;
// // };

// import { log } from "node:console";
// import dotenv from "dotenv";
// import { eq } from "drizzle-orm";
// import { db } from "@/config/dbConnections";
// import { users } from "@/features/auth/auth.model";
// import { businessListings } from "@/features/business/business.model";
// import { cities } from "@/features/not-related/address/address.model";
// import { UserRole } from "@/types/auth";

// dotenv.config();

// export const fakeSeed = async () => {
//   try {
//     const user = await seedFakeUser(1);
//     const business = await seedFakeBusiness(user.id);
//     return { user, business };
//   } catch (error) {
//     console.error("Error in fakeSeed:", error);
//     throw error;
//   }
// };

// export const fakeUserSeed = async () => {
//   const [fakeUser] = await db
//     .select()
//     .from(users)
//     .where(eq(users.username, "fake"));
//   return fakeUser;
// };

// export const fakeBusinessSeed = async () => {
//   const [fakeBusiness] = await db
//     .select()
//     .from(businessListings)
//     .where(eq(businessListings.slug, "fake"));
//   return fakeBusiness;
// };

// const seedFakeUser = async (userId: number) => {
//   try {
//     // Pehle associated business listings delete karo
//     const [existingUser] = await db
//       .select()
//       .from(users)
//       .where(eq(users.username, "fake"))
//       .limit(1);

//     if (existingUser) {
//       await db
//         .delete(businessListings)
//         .where(eq(businessListings.userId, existingUser.id));

//       // Ab user delete karo
//       await db.delete(users).where(eq(users.username, "fake"));
//     }

//     const uniqueEmail = `fake${Math.floor(Math.random() * 1000)}@example.com`;

//     const [insertedUser] = await db
//       .insert(users)
//       .values({
//         username: "fake",
//         phoneNumber: "fake",
//         email: uniqueEmail,
//         password: "fake",
//         role: UserRole.visiter,
//         googleId: "fake",
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       })
//       .returning();

//     return insertedUser;
//   } catch (error) {
//     console.error("Error in seedFakeUser:", error);
//     throw error;
//   }
// };

// const seedFakeBusiness = async (userId: number) => {
//   try {
//     // Pehle existing fake business delete karo
//     await db.delete(businessListings).where(eq(businessListings.slug, "fake"));

//     const [city] = await db
//       .select()
//       .from(cities)
//       .where(eq(cities.city, "Jodhpur"));

//     if (!city) {
//       throw new Error("City 'Jodhpur' not found in database");
//     }

//     const [insertedBusiness] = await db
//       .insert(businessListings)
//       .values({
//         userId,
//         name: "fake",
//         slug: "fake",
//         photo: "fake",
//         specialities: "fake",
//         description: "fake",
//         homeDelivery: true,
//         latitude: "fake",
//         longitude: "fake",
//         buildingName: "fake",
//         streetName: "fake",
//         area: "fake",
//         landmark: "fake",
//         pincode: 0,
//         cityId: city.id,
//         schedules: {},
//         status: true,
//         email: "fake",
//         phoneNumber: "fake",
//         whatsappNo: "fake",
//         alternativeMobileNumber: "fake",
//         facebook: "fake",
//         twitter: "fake",
//         linkedin: "fake",
//         listingVideo: "fake",
//         isFeature: true,
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       })
//       .returning();

//     return insertedBusiness;
//   } catch (error) {
//     console.error("Error in seedFakeBusiness:", error);
//     throw error;
//   }
// };

import dotenv from "dotenv";
import { eq } from "drizzle-orm";
import { db } from "../index";
import { users } from "../schema/auth.schema";
import { businessListings } from "../schema/business.schema";
import { cities } from "../schema/address.schema";
import { UserRole } from "../schema/auth.schema";
// import { hireListing } from "@/features/hire/hire.model";

dotenv.config();

export const fakeSeed = async () => {
  try {
    const user = await seedFakeUser(1);
    const business = await seedFakeBusiness(user!.id);
    return { user, business };
  } catch (error) {
    console.error("Error in fakeSeed:", error);
    throw error;
  }
};

export const fakeUserSeed = async () => {
  const [fakeUser] = await db
    .select()
    .from(users)
    .where(eq(users.username, "fake"));
  return fakeUser;
};

export const fakeBusinessSeed = async () => {
  const [fakeBusiness] = await db
    .select()
    .from(businessListings)
    .where(eq(businessListings.slug, "fake"));
  return fakeBusiness;
};

const seedFakeUser = async (userId: number) => {
  try {
    // Pehle associated business listings delete karo
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.username, "fake"))
      .limit(1);

    if (existingUser) {
            // await db.delete(hireListing).where(eq(hireListing.userId, existingUser.id))
      await db
        .delete(businessListings)
        .where(eq(businessListings.userId, existingUser.id));

      // Ab user delete karo
      await db.delete(users).where(eq(users.username, "fake"));
    }

    const uniqueEmail = `fake${Math.floor(Math.random() * 1000)}@example.com`;

    const [insertedUser] = await db
      .insert(users)
      .values({
        username: "fake",
        phoneNumber: "fake",
        email: uniqueEmail,
        password: "fake",
        role: UserRole.visiter,
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
