import { uploadOnCloudinary } from "@repo/cloudinary";
import { db } from "@repo/db";
import { eq } from "drizzle-orm";
import { users } from "../db/src/schema/auth.schema";
import { businessListings } from "../db/src/schema/business.schema";
import { categories, subcategories } from "../db/src/schema/not-related.schema";

import {
  offerPhotos,
  offerReviews,
  offerSubcategory,
  offers,
} from "../db/src/schema/offer.schema";
// import { fakeSeed, fakeUserSeed } from "./fake.seed";
import { sql } from "./mysqldb.seed";
import { cloudinaryUploadOnline } from "./seeds";

export const offerSeed = async () => {
  await clearOfferSeed();
  await addOffer();
  await addOfferReviews();
  await addOfferSubcategories();
};

const clearOfferSeed = async () => {
  await db.execute(
    `TRUNCATE TABLE offer_subcagtegorys RESTART IDENTITY CASCADE;`,
  );
  await db.execute(`TRUNCATE TABLE offer_reviews RESTART IDENTITY CASCADE;`);
  await db.execute(`TRUNCATE TABLE offer_photos RESTART IDENTITY CASCADE;`);
  await db.execute(`TRUNCATE TABLE offers RESTART IDENTITY CASCADE;`);
  console.log("all tables cleared successfully");
};

// 1. offer
export const addOffer = async () => {
  const [mysqlOffers]: any[] = await (sql as any).execute(
    "SELECT * FROM offers",
  );

  for (const row of mysqlOffers) {
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

    const liveOfferImageUrl = `https://justsearch.net.in/assets/images/${row.image1}`;
    const mainImage = await uploadOnCloudinary(
      liveOfferImageUrl,
      "offer",
      cloudinaryUploadOnline,
    );

    const [offerCreate] = await db
      .insert(offers)
      .values({
        businessId: business.id,
        mainImage,
        categoryId: category.id,
        offerName: row.product_name,
        offerSlug: row.product_slug,
        rate: Math.round(Number(row.rate)),
        discountPercent: Math.round(Number(row.discount_percent)),
        finalPrice: Math.round(Number(row.final_price)),
        offerDescription: row.product_description,
        offerStartDate: row.offer_start_date,
        offerEndDate: row.offer_end_date,
        reuploadCount: row.reupload_count,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        expires_at: row.expires_at ?? new Date(),
      })
      .returning({ id: offers.id });

    if (!offerCreate) {
      console.log("offer not created", row.id);
      throw new Error("offer not created");
    }
    const images = ["image2", "image3", "image4", "image5"];
    for (const image of images) {
      if (row[image]) {
        if (row[image].startsWith("/tmp") === true) continue;
        const liveOfferImageUrl = `https://justsearch.net.in/assets/images/${row[image]}`;
        const offerPhotoUrl = await uploadOnCloudinary(
          liveOfferImageUrl,
          "offer",
          cloudinaryUploadOnline,
        );

        await db.insert(offerPhotos).values({
          offerId: offerCreate.id,
          photo: offerPhotoUrl,
          createdAt: row.created_at,
          updatedAt: row.updated_at,
        });
      }
    }
  }

  console.log("successfully seed of offer and offer photo");
};
// 2. offer_reviews
export const addOfferReviews = async () => {
  const [reviews]: any[] = await sql.execute("SELECT * FROM offer_reviews");
  // const fakeUser = await getFakeBusinessUser()

  for (const row of reviews) {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, row.user_id));

    if (!user) {
      console.log("user not found", row.id);
      continue;
    }

    const [offer] = await db
      .select()
      .from(offers)
      .where(eq(offers.id, row.offer_id));

    if (!offer) {
      console.log("offer not found", row.id);
      continue;
    }

    await db.insert(offerReviews).values({
      userId: user!.id,
      offerId: offer.id,
      name: row.name,
      email: row.email,
      message: row.message,
      rate: row.rate,
      view: row.view,
      status: row.status,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    });
  }
  console.log("successfully seed of offerReviews");
};

// 3. OfferSubcategory
export const addOfferSubcategories = async () => {
  const [rows]: any[] = await sql.execute("SELECT * FROM offer_subcategory");

  for (const row of rows) {
    const [offer] = await db
      .select()
      .from(offers)
      .where(eq(offers.id, row.offer_id));

    if (!offer) {
      console.log("offerId not found", row.id);
      continue;
    }

    const [subcategory] = await db
      .select()
      .from(subcategories)
      .where(eq(subcategories.id, row.subcategory_id));

    if (!subcategory) {
      console.log("subCategory not found", row.id);
      continue;
    }

    await db.insert(offerSubcategory).values({
      offerId: offer.id,
      subcategoryId: subcategory.id,
    });
  }
  console.log("successfully seed of OfferSubcategories");
};

// TODO
// 4. RecentViewsOffer
