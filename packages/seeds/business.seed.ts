import { uploadOnCloudinary } from "@repo/cloudinary";
import { db } from "@repo/db";
import { salesmen } from "@repo/db/dist/schema/user.schema";
import { logger } from "@repo/logger";
import { eq, type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import { users } from "../db/src/schema/auth.schema";
import {
  businessCategories,
  businessListings,
  businessPhotos,
  businessReviews,
  businessSubcategories,
  favourites,
} from "../db/src/schema/business.schema";
import {
  categories,
  cities,
  subcategories,
} from "../db/src/schema/not-related.schema";
import { getFakeBusinessUser } from "./fake.seed";
import { sql } from "./mysqldb.seed";
import { clouadinaryFake } from "./seeds";
import { insertUser } from "./utils";

export const businessSeed = async () => {
  await updateBusinessPhoto();
  // await clearAllTablesBusiness();
  // await addBusiness();
  // await seedFavourites();
  // await businessesCategories();
  // await businessesSubcategory();
  // await BusinessReviews();
  // await seedRecentViewsBusiness();
};

const updateBusinessPhoto = async () => {
  const [rows]: any[] = await sql.execute(
    "SELECT * FROM listings WHERE type = 1",
  );

  for (const row of rows) {
    //TODO: comment this line in future;
    if (row.id < 1329) continue;
    const isBuissnessExist = await db
      .select()
      .from(businessListings)
      .where(eq(businessListings.id, row.id))
      .limit(1);

    if (!isBuissnessExist) {
      console.error("Business not found", row.id);
      continue;
    }

    const invalidPhotos = [
      "20469712961736937230.jpg",
      "9233936721737361584.jpeg",
      "8263138481737439311.jpeg",
      "2542177821738044989.jpeg",
      "11006388771738843807.jpeg",
      "6708903161739015419.PNG",
      "460541731739343371.jpg",
      "15017575881740386618.jpg",
      "9027662451740469698.jpg",
      "21306861181742460413.jpg",
    ];

    if (invalidPhotos.includes(row.photo)) {
      console.error("Invalid photo", row.id);
      continue;
    }

    const liveBusinessImageUrl = `https://justsearch.net.in/assets/images/${row.photo}`;
    console.log("row id ", row.id, "row photo ", row.photo);
    const businessMainPhoto = await uploadOnCloudinary(
      liveBusinessImageUrl,
      "business",
      clouadinaryFake,
    );

    console.log("businessMainPhoto", businessMainPhoto);
    await db
      .update(businessListings)
      .set({
        photo: businessMainPhoto,
      })
      .where(eq(businessListings.id, row.id));
  }
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
  await db.execute(`TRUNCATE TABLE business_photos RESTART IDENTITY CASCADE;`);
  await db.execute(
    `TRUNCATE TABLE business_listings RESTART IDENTITY CASCADE;`,
  );
  console.log(" All tables cleared successfully!");
};

const addBusiness = async () => {
  const [rows]: any[] = await sql.execute(
    "SELECT *, REPLACE(longitude , ',', '') as clear_longitude, REPLACE(latitude , ',', '') as clear_latitude FROM listings WHERE type = 1",
  );

  // const fakeUser = await getFakeBusinessUser();

  // if (!fakeUser) {
  //   throw new Error("Failed to generate a fake user!");
  // }

  for (const row of rows) {
    // const row = rows[0];
    //

    let userId = 0;
    try {
      userId = await insertUser(row.user_id, "business");
    } catch (error) {
      console.log("error inside user");
      throw new Error(`User not found ${row.user_id} ${error}`);
    }

    let [city] = await db.select().from(cities).where(eq(cities.id, row.city));

    if (!city) {
      console.log("City not found", row.id);
      [city] = await db.select().from(cities).where(eq(cities.city, "Jodhpur"));
      if (!city) {
        throw new Error(`City not found ${row.city}`);
      }
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
      slug = `${row.slug}-${row.id}`;
    }
    try {
      const saleman = await db
        .select()
        .from(salesmen)
        .where(
          eq(
            salesmen.referCode,
            row.refer_code ? row.refer_code.toUpperCase() : null,
          ),
        );
      type BusinessData = InferInsertModel<typeof businessListings>;
      const { days, fromHour, toHour } = scheduleExtracter(row.schedules);
      const { latitude, longitude } = getRightLocation(row);

      const liveBusinessImageUrl = `https://justsearch.net.in/assets/images/${row.photo}`;
      const businessMainPhoto = await uploadOnCloudinary(
        liveBusinessImageUrl,
        "business",
        clouadinaryFake,
      );

      const businessData: BusinessData = {
        id: row.id,
        salesmanId: saleman[0]?.id ?? 1,
        userId,
        name: row.name,
        days,
        fromHour,
        toHour,
        contactPerson: row.contact_person,
        ownerNumber: row.owner_no,
        slug,
        photo: businessMainPhoto,
        specialities: row.specialities,
        description: row.description,
        homeDelivery: row.home_delivery,
        latitude,
        longitude,
        buildingName: row.building_name,
        streetName: row.street_name,
        address: row.real_address ?? row.area,
        landmark: row.landmark,
        pincode: String(row.pincode),
        state: city.stateId,
        city: city.id,
        status: "Approved",
        email: row.email,
        phoneNumber: row.phone_number,
        whatsappNo: row.whatsapp_no,
        alternativeMobileNumber: row.alternative_mobile_number,
        facebook: row.facebook,
        twitter: row.twitter,
        linkedin: row.linkedin,
        listingVideo: row.listing_video,
        isFeature: !!row.is_feature,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      };
      // console.log("businessData", businessData);
      const [newbusinessListing] = await db
        .insert(businessListings)
        .values(businessData)
        .returning();

      if (newbusinessListing) {
        const images = ["image1", "image2", "image3", "image4", "image5"];
        for (const image of images) {
          if (row[image]) {
            const liveBusinessImageUrl = `https://justsearch.net.in/assets/images/${row[image]}`;
            const businessPhotoUrl = await uploadOnCloudinary(
              liveBusinessImageUrl,
              "business",
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
    } catch (error: any) {
      console.error("row id is ", row.id, "user id", row.user_id);
      throw new Error("error in business", error);
    }
  }

  console.log(" Business migration completed!");
};
// favourite
const seedFavourites = async () => {
  const [favourite]: any[] = await sql.execute("SELECT * FROM wishlists");

  type FavouriteData = InferInsertModel<typeof favourites>;
  const allData: FavouriteData[] = [];
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
      continue;
    }

    if (!businessListing) {
      continue;
    }

    const favouriteData: FavouriteData = {
      businessId: businessListing.id,
      userId: user.id,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };

    allData.push(favouriteData);
  }
  await db.insert(favourites).values(allData);
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
// NOTE: This code required when we do analytics
// const seedRecentViewsBusiness = async () => {
//   const [rows]: any[] = await sql.execute(
//     "SELECT * FROM recent_views_listings",
//   );
//   for (const row of rows) {
//     const [user] = await db
//       .select()
//       .from(users)
//       .where(eq(users.id, row.user_id));
//     const [businessListing] = await db
//       .select()
//       .from(businessListings)
//       .where(eq(businessListings.id, row.listing_id));
//     if (!user) {
//       console.warn(`User not found, using fake user`);
//       continue;
//     }
//     if (!businessListing) {
//       console.warn(`Business not found, using fake business`);
//       throw new Error(`Business not found ${row.listing_id}`);
//     }
//     try {
//       await db.insert(recentViewBusiness).values({
//         id: row.id,
//         userId: user.id,
//         businessId: businessListing.id,
//         device: row.device,
//         browser: row?.browser ?? "fake device",
//         operatingSystem: row?.operating_system ?? "fake os",
//         createdAt: row.created_at,
//         updatedAt: row.updated_at,
//       });
//     } catch (e: any) {
//       console.log("successfully seed of recent views business");
//       console.error(e.message);
//     }
//   }
//   console.log("successfully recent views business");
// };

type DayKey = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";
interface OpenDay {
  opens_at: string;
  closes_at: string;
}
interface ClosedDay {
  closed: true;
}
type ScheduleDay = OpenDay | ClosedDay;
type Schedule = Record<DayKey, ScheduleDay>;
interface ScheduleResult {
  days: string[] | null;
  fromHour: string | null;
  toHour: string | null;
}

const scheduleExtracter = (
  schedule: string | null | undefined,
): ScheduleResult => {
  const empty = {
    days: null,
    fromHour: null,
    toHour: null,
  };
  if (!schedule) {
    return empty;
  }

  const scheduleObj = JSON.parse(schedule) as Schedule;

  const dayMap: Record<DayKey, string> = {
    Mon: "Monday",
    Tue: "Tuesday",
    Wed: "Wednesday",
    Thu: "Thursday",
    Fri: "Friday",
    Sat: "Saturday",
    Sun: "Sunday",
  };

  const openDays = Object.entries(scheduleObj).filter(
    ([_, value]) => !("closed" in value),
  ) as [DayKey, OpenDay][];

  const days = openDays.map(([key]) => dayMap[key]);

  if (days.length === 0) {
    return empty;
  }

  const firstDay = openDays[0];
  if (!firstDay) {
    return empty;
  }
  const { opens_at: fromHour, closes_at: toHour } = firstDay[1];

  return {
    days,
    fromHour,
    toHour,
  };
};

export const getRightLocation = (
  row: any,
): { latitude: number; longitude: number } => {
  const id = row.id;
  const { clear_longitude, clear_latitude } = row;
  if (
    ![
      292, 226, 433, 806, 1813, 1952, 2026, 2028, 2030, 2032, 2035, 2050, 2086,
      2088, 2091, 2092, 2094, 2126, 2136, 2200, 2215, 2398,
    ].includes(id)
  ) {
    return {
      latitude: Number(clear_longitude),
      longitude: Number(clear_latitude),
    };
  }

  if (id === 292) {
    return { latitude: 26.222869, longitude: 72.999919 };
  }
  if (id === 226) {
    return { latitude: 26.190672086239275, longitude: 73.00460935509179 };
  }
  if (id === 433) {
    return { latitude: 19.20175, longitude: 72.859194 };
  }
  if (id === 806) {
    return { latitude: 26.265225145989614, longitude: 73.01835466997551 };
  }
  if (id === 1813) {
    return { latitude: 26.27380557693804, longitude: 73.033499996705 };
  }
  if (id === 1952) {
    return { latitude: 26.28228070625321, longitude: 73.00706863377452 };
  }
  if (id === 2026) {
    return { latitude: 26.280298193900585, longitude: 73.0199678101972 };
  }
  if (id === 2028) {
    return { latitude: 26.280298193900585, longitude: 73.0199678101972 };
  }
  if (id === 2030) {
    return { latitude: 26.265225145989614, longitude: 73.01835466997551 };
  }
  if (id === 2032) {
    return { latitude: 26.28352566953517, longitude: 73.98338694088521 };
  }
  if (id === 2035) {
    return { latitude: 26.273762509760203, longitude: 73.00002145437699 };
  }
  if (id === 2050) {
    return { latitude: 26.280263515224608, longitude: 73.02797853903316 };
  }
  if (id === 2086) {
    return { latitude: 26.229073211487673, longitude: 73.04013562368779 };
  }
  if (id === 2088) {
    return { latitude: 26.229073211487673, longitude: 73.04013562368779 };
  }
  if (id === 2091) {
    return { latitude: 26.229073211487673, longitude: 73.04013562368779 };
  }
  if (id === 2092) {
    return { latitude: 26.229073211487673, longitude: 73.04013562368779 };
  }
  if (id === 2094) {
    return { latitude: 26.213271100657817, longitude: 73.02359999670337 };
  }
  if (id === 2126) {
    return { latitude: 26.2887, longitude: 73.0239 };
  }
  if (id === 2136) {
    return { latitude: 26.297463, longitude: 73.037453 };
  }
  if (id === 2200) {
    return { latitude: 26.309798173651373, longitude: 73.0434993261525 };
  }
  if (id === 2215) {
    return { latitude: 26.265225145989614, longitude: 73.01835466997551 };
  }
  if (id === 2398) {
    return { latitude: 26.2746863, longitude: 73.0212532 };
  }
  return {
    latitude: Number(clear_latitude),
    longitude: Number(clear_longitude),
  };
};
