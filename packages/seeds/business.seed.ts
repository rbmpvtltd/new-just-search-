import { uploadOnCloudinary } from "@repo/cloudinary";
import { db } from "@repo/db";
import { eq } from "drizzle-orm";
import { UserRole, users } from "../db/src/schema/auth.schema";
import {
  businessCategories,
  businessListings,
  businessPhotos,
  businessReviews,
  businessSubcategories,
  favourites,
  recentViewBusiness,
} from "../db/src/schema/business.schema";
import {
  categories,
  cities,
  subcategories,
} from "../db/src/schema/not-related.schema";
import { fakeBusinessSeed, fakeSeed, fakeUserSeed } from "./fake.seed";
import { sql } from "./mysqldb.seed";
import { clouadinaryFake } from "./seeds";

export const businessSeed = async () => {
  await clearAllTablesBusiness();
  await addBusiness();
  // await seedFavourites();
  // await businessesSubcategory();
  // await businessesCategories();
  // await BusinessReviews();
  // await seedRecentViewsBusiness();
};

export const clearAllTablesBusiness = async () => {
  // await db.execute(`TRUNCATE  TABLE favourites RESTART IDENTITY CASCADE;`);
  await db.execute(
    `TRUNCATE TABLE business_categories RESTART IDENTITY CASCADE;`,
  );
  await db.execute(
    `TRUNCATE TABLE business_subcategories RESTART IDENTITY CASCADE;`,
  );
  // await db.execute(`TRUNCATE TABLE business_reviews RESTART IDENTITY CASCADE;`);
  // await db.execute(
  //   `TRUNCATE TABLE recent_view_business RESTART IDENTITY CASCADE;`,
  // );
  // await db.execute(`TRUNCATE TABLE business_photos RESTART IDENTITY CASCADE;`);
  await db.execute(
    `TRUNCATE TABLE business_listings RESTART IDENTITY CASCADE;`,
  );
  console.log(" All tables cleared successfully!");
};

// business listing
// const addBusiness = async () => {
//   const [businessRows] = await (sql as any).execute("SELECT * FROM listings");
//   // const fakeUser = (await fakeUserSeed()) || (await fakeSeed()).user;

//   // const row = businessRows.slice(0, 5);

//   // console.log("row", row);
//   for (const row of businessRows) {
//     if (Number(row.type) === 1) {
//       console.log("row", row);

//       const [user] = await sql.execute(
//         `SELECT * FROM users WHERE id = ${row.user_id} `,
//       );
//       console.log("user", user);
//       // return;

//       const mysqlUser = (user as any[])[0];
//       // console.log("mysqlUser", mysqlUser);
//       // return
//       if (mysqlUser) {
//         console.log("mysqlUser", mysqlUser);

//         try {
//           const newUser = await db
//             .insert(users)
//             .values({
//               id: mysqlUser.id,
//               displayName: mysqlUser.display_name ?? `business${mysqlUser.id}`,
//               phoneNumber: mysqlUser.phone,
//               email: mysqlUser.email ?? `business${mysqlUser.id}@example.com`,
//               password: mysqlUser.password,
//               role: UserRole.business,
//               googleId: mysqlUser.google_id,
//               refreshToken: null,
//               createdAt: mysqlUser.created_at || new Date(),
//               updatedAt: mysqlUser.updated_at || new Date(),
//             })
//             .returning();
//           console.log("newUser", newUser);
//         } catch (error) {
//           const updateUser = await db
//             .update(users)
//             .set({ role: UserRole.business })
//             .where(eq(users.id, mysqlUser.id));
//           console.log("updateUser", updateUser);
//         }
//       }

//       return;

//       // if (!mysqlUser) {
//       //   console.log(`User not found for business ${row.id}, using fake user`);
//       //   // mysqlUser = fakeUser;
//       // }
//       // //  Slug skip logic
//       // const skipSlug = [
//       //   "ritik",
//       //   "rajasthan-arts-crafts",
//       //   "payal-prajapat",
//       //   "prince-art-exporter",
//       //   "parikrama-advertising",
//       //   "manish-garment",
//       //   "yash-aman-hospital",
//       //   "hotel-ratan-vilas",
//       //   "bhadariya-mobile",
//       //   "vinayak-shopee",
//       //   "",
//       //   "dinesh-auto-repair",
//       //   "mayur-plastics",
//       //   "mahalaxmi-mobile",
//       //   "ambika-enterprises",
//       //   "creation-point",
//       //   "pawan-electricals",
//       //   "mahaveer-kirana-store",
//       //   "mahadev-sabji-mandi",
//       //   "shri-balaji-medical-store",
//       //   "lakki-fresh-fruit-sabji-bhandar",
//       //   "lakshmi-cement-jali-udyog",
//       //   "mobile-doctor",
//       //   "anmol-fashion",
//       //   "sunil-handicrafts-exports",
//       //   "sarwan-kumar",
//       //   "sagar",
//       // ];
//       // let slug = row.slug;
//       // if (skipSlug.includes(row.slug)) {
//       //   slug = `${row.slug}${row.id}`;
//       // }

//       // let [city] = await db
//       //   .select()
//       //   .from(cities)
//       //   .where(eq(cities.id, row.city));
//       // if (!city) {
//       //   console.log(` City not found for ${row.id}, using Jodhpur`);
//       //   [city] = await db
//       //     .select()
//       //     .from(cities)
//       //     .where(eq(cities.city, "Jodhpur"));
//       // }

//       // let businessListing: any;

//       // try {
//       //   [businessListing] = await db
//       //     .insert(businessListings)
//       //     .values({
//       //       id: row.id,
//       //       userId: mysqlUser.id,
//       //       name: row.name,
//       //       slug,
//       //       photo: row.photo,
//       //       specialities: row.specialities,
//       //       description: row.description,
//       //       homeDelivery: row.home_delivery,
//       //       latitude: row.latitude,
//       //       longitude: row.longitude,
//       //       buildingName: row.building_name,
//       //       streetName: row.street_name,
//       //       area: row.area,
//       //       landmark: row.landmark,
//       //       pincode: row.pincode,
//       //       cityId: city!.id,
//       //       schedules: row.schedules ? JSON.parse(row.schedules) : null,
//       //       status: row.status,
//       //       email: row.email,
//       //       phoneNumber: row.phone_number,
//       //       whatsappNo: row.whatsapp_no,
//       //       alternativeMobileNumber: row.alternative_mobile_number,
//       //       facebook: row.facebook,
//       //       twitter: row.twitter,
//       //       linkedin: row.linkedin,
//       //       listingVideo: row.listing_video,
//       //       isFeature: row.is_feature,
//       //       createdAt: row.created_at,
//       //       updatedAt: row.updated_at,
//       //     })
//       //     .returning();
//       // } catch (e) {
//       //   console.error("row id is ", row.id, "user id", row.user_id);
//       // }

//     }
//   }
//   console.log(" Business migration completed!");
// };
const addBusiness = async () => {
  const [rows]: any[] = await sql.execute(
    "SELECT * FROM listings WHERE type = 1",
  );

  let fakeUser = await fakeUserSeed();

  if (!fakeUser) {
    const seed = await fakeSeed();
    fakeUser = seed?.user;
  }
  if (!fakeUser) {
    throw new Error("Failed to generate a fake user!");
  }

  for (const row of rows) {
    // const row = rows[0];
    let [createUser] = await db
      .select()
      .from(users)
      .where(eq(users.id, Number(row.user_id)));

    if (!createUser) {
      const [user]: any[] = await sql.execute(
        `SELECT * FROM users WHERE id = ${row.user_id}`,
      );

      if (user[0]) {
        const mySqlUser = user[0];
        console.log("mySqlUser", mySqlUser);
        // return
        try {
          createUser = await db
            .insert(users)
            .values({
              id: mySqlUser.id,
              displayName: row.name ?? mySqlUser.name,
              email: mySqlUser.email,
              googleId: mySqlUser.google_id,
              password: mySqlUser.password,
              role: "business",
              phoneNumber: mySqlUser.phone,
            })
            .returning();
          console.log(createUser);
        } catch (e) {
          console.error("error is ", e.message);
        }
      } else {
        createUser = fakeUser;
      }
    }

    if (!createUser);
    console.log("User not found" + row.id);

    let [city] = await db.select().from(cities).where(eq(cities.id, row.city));

    if (!city) {
      console.log("City not found", row.id);
      [city] = await db.select().from(cities).where(eq(cities.city, "Jodhpur"));
    }

    const skipSlug = [
      "ritik",
      "rajasthan-arts-crafts",
      "payal-prajapat",
      "prince-art-exporter",
      "parikrama-advertising",
      "manish-garment",
      "yash-aman-hospital",
      "hotel-ratan-vilas",
      "bhadariya-mobile",
      "vinayak-shopee",
      "",
      "dinesh-auto-repair",
      "mayur-plastics",
      "mahalaxmi-mobile",
      "ambika-enterprises",
      "creation-point",
      "pawan-electricals",
      "mahaveer-kirana-store",
      "mahadev-sabji-mandi",
      "shri-balaji-medical-store",
      "lakki-fresh-fruit-sabji-bhandar",
      "lakshmi-cement-jali-udyog",
      "mobile-doctor",
      "anmol-fashion",
      "sunil-handicrafts-exports",
      "sarwan-kumar",
      "sagar",
    ];
    let slug = row.slug;
    if (skipSlug.includes(row.slug)) {
      slug = `${row.slug}${row.id}`;
    }

    try {
      if (!createUser) {
        console.log("User not found" + row.id);
      }
      const [newbusinessListing] = await db
        .insert(businessListings)
        .values({
          id: row.id,
          userId: createUser?.id,
          name: row.name,
          slug,
          photo: row.photo,
          specialities: row.specialities,
          description: row.description,
          homeDelivery: row.home_delivery,
          latitude: row.latitude,
          longitude: row.longitude,
          buildingName: row.building_name,
          streetName: row.street_name,
          area: row.area,
          landmark: row.landmark,
          pincode: row.pincode,
          state: city!.stateId,
          cityId: city!.id,
          schedules: row.schedules ? JSON.parse(row.schedules) : null,
          status: row.status,
          email: row.email,
          phoneNumber: row.phone_number,
          whatsappNo: row.whatsapp_no,
          alternativeMobileNumber: row.alternative_mobile_number,
          facebook: row.facebook,
          twitter: row.twitter,
          linkedin: row.linkedin,
          listingVideo: row.listing_video,
          isFeature: row.is_feature,
          createdAt: row.created_at,
          updatedAt: row.updated_at,
        })
        .returning();

      // images handle
      if (newbusinessListing) {
        const images = ["image1", "image2", "image3", "image4", "image5"];
        for (const image of images) {
          if (row[image]) {
            const liveBusinessImageUrl = `https://justsearch.net.in/assets/images/${row[image]}`;
            const businessPhotoUrl = await uploadOnCloudinary(
              liveBusinessImageUrl,
              "Business",
              clouadinaryFake,
            );

            if (businessPhotoUrl) {
              await db.insert(businessPhotos).values({
                businessId: newbusinessListing.id,
                photo: businessPhotoUrl,
                createdAt: row.created_at,
                updatedAt: row.updated_at,
              });
            }
          }
        }
      }
    } catch (e) {
      console.error("row id is ", row.id, "user id", row.user_id);
    }
  }

  console.log(" Business migration completed!");
};

// favourite

const seedFavourites = async () => {
  const [favourite]: any[] = await sql.execute("SELECT * FROM wishlists");

  for (const row of favourite) {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, row.user_id));

    const [businessListing] = await db
      .select()
      .from(businessListings)
      .where(eq(businessListings.id, row.listing_id));

    if (!user) {
      console.log("user not found", row.id);
      continue;
    }

    if (!businessListing) {
      console.log("business not found", row.id);
      continue;
    }

    await db.insert(favourites).values({
      businessId: businessListing.id,
      userId: user.id,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }
};

// businessesSubcategory
const businessesSubcategory = async () => {
  const [rows]: any[] = await sql.execute("SELECT * FROM listing_subcategory");

  for (const row of rows) {
    const [business] = await db
      .select()
      .from(businessListings)
      .where(eq(businessListings.id, row.listing_id));

    if (!business) {
      console.log("business not found", row.id);
      continue;
    }

    const [subcategory] = await db
      .select()
      .from(subcategories)
      .where(eq(subcategories.id, row.subcategory_id));

    if (!subcategory) {
      console.log("subcategory not found", row.id);
      continue;
    }

    await db.insert(businessSubcategories).values({
      businessId: business.id,
      subcategoryId: subcategory.id,
    });
  }

  console.log("businessSubcategories seeding complete");
};

// businesses_categories
const businessesCategories = async () => {
  const [rows]: any[] = await sql.execute("SELECT * FROM listing_category");

  for (const row of rows) {
    const [business] = await db
      .select()
      .from(businessListings)
      .where(eq(businessListings.id, row.listing_id));
    if (!business) {
      console.log("business not found", row.id);
      continue;
    }
    const [category] = await db
      .select()
      .from(categories)
      .where(eq(categories.id, row.category_id));
    if (!category) {
      console.log("category not found", row.id);
      continue;
    }

    await db.insert(businessCategories).values({
      businessId: business.id,
      categoryId: category.id,
    });
  }
};

// business_reviews

const BusinessReviews = async () => {
  const [rows]: any[] = await sql.execute("SELECT * FROM listing_reviews");
  for (const row of rows) {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, row.user_id));

    if (!user) {
      console.log("user not found:", row.id);
      continue;
    }

    const [business] = await db
      .select()
      .from(businessListings)
      .where(eq(businessListings.id, row.listing_id));

    if (!business) {
      console.log("business not found:", row.id);
      continue;
    }

    // insert into postgres (business_reviews table)
    await db.insert(businessReviews).values({
      id: row.id,
      userId: user.id,
      businessId: business.id,
      rate: row.rate,
      message: row.message ?? "",
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    });
  }

  console.log("Business reviews migrated successfully!");
};

// recent_views_business
export const seedRecentViewsBusiness = async () => {
  const [rows]: any[] = await sql.execute(
    "SELECT * FROM recent_views_listings",
  );

  for (const row of rows) {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, row.user_id));

    const [businessListing] = await db
      .select()
      .from(businessListings)
      .where(eq(businessListings.id, row.listing_id));

    if (!user) {
      console.warn(`User not found, using fake user`);
      continue;
    }

    if (!businessListing) {
      console.warn(`Business not found, using fake business`);
    }
    try {
      await db.insert(recentViewBusiness).values({
        id: row.id,
        userId: user.id,
        businessId: businessListing!.id,
        device: row.device,
        browser: row?.browser ?? "fake device",
        operatingSystem: row?.operating_system ?? "fake os",
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      });
    } catch (e: any) {
      console.log("successfully seed of recent views business");

      console.error(e.message);
    }
  }
  console.log("successfully recent views business");
};

// const business_refer = async () => {
//   await BusinessRefer.deleteMany();
//   const [business_refer]: any[] = await sql.execute("SELECT * FROM listings");
//   for (const row of business_refer) {
//     const business = await BusinessListing.findOne({
//       mysql_id: row.business_id,
//     });
//     const salesman = await Salesman.findOne({ mysql_id: row.salesman_id });
//     if (!business || !salesman) {
//       console.log("business or salesman not found", row.id);
//       continue;
//     }
//     const businessRefer = await BusinessRefer.create({
//       business_id: business._id,
//       salesman_id: salesman._id,
//     });
//   }
// };
