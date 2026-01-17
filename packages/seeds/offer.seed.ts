import { uploadOnCloudinary } from "@repo/cloudinary";
import { db } from "@repo/db";
import { eq, type InferInsertModel } from "drizzle-orm";
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
import { multiUploadOnCloudinary, type MultiUploadOnCloudinaryFile } from "@repo/cloudinary/dist/cloudinary";

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
  type DbOfferType = InferInsertModel<typeof offers>;
  type DbOfferPhotoType = InferInsertModel<typeof offerPhotos>;
  const dbOfferValue : DbOfferType[]=[];
  const dbOfferPhotosValues:DbOfferPhotoType[]=[];
  const cloudinaryOfferData : MultiUploadOnCloudinaryFile[] = [];
  const cloudinaryOfferPhotosData:MultiUploadOnCloudinaryFile[]=[];

  for(const offer of mysqlOffers){
    const liveOfferImageUrl = `https://justsearch.net.in/assets/images/${offer.image1}`;
    if(offer.image1){
      cloudinaryOfferData.push({
        filename:liveOfferImageUrl,
        id:offer.id
      })
    }
    const images = ["image2", "image3", "image4", "image5"];
    for (const image of images) {
      if(!offer[image]){
        console.log(`====== Offer Doesn't have ${image} ======`);
        continue
      }
      if (offer[image].startsWith("/tmp") === true) continue;
      const liveProductsPhotoImageUrl = `https://justsearch.net.in/assets/images/${offer[image]}`;
      cloudinaryOfferPhotosData.push({
        filename: liveProductsPhotoImageUrl,
        id: `${offer.id}-${image}`,
      });
    }
  }

  const offerPhotosPublicIds = await multiUploadOnCloudinary(
    [...cloudinaryOfferData,...cloudinaryOfferPhotosData],
    "offer",
    cloudinaryUploadOnline,
  )
  

  const allBusinesslistings = await db.select().from(businessListings);
  const allCategories = await db.select().from(categories);
  for (const row of mysqlOffers) {
    // const business = await db
    //   .select()
    //   .from(businessListings)
    //   .where(eq(businessListings.id, row.listing_id));
    const business = allBusinesslistings.find((business)=> business.id,row.listing_id);
    const category = allCategories.find((category)=> category.id,row.category_id);
    const mainImage = offerPhotosPublicIds.find((offer)=> offer.id === row.id)?.public_id;
    if (!business) {
      console.log("business not found", row.id);
      continue;
    }
    // const liveOfferImageUrl = `https://justsearch.net.in/assets/images/${row.image1}`;
    // const mainImage = await uploadOnCloudinary(
    //   liveOfferImageUrl,
    //   "offer",
    //   cloudinaryUploadOnline,
    // );


    // const [category] = await db
    //   .select()
    //   .from(categories)
    //   .where(eq(categories.id, row.category_id));

    if (!category) {
      console.log("category not found", row.id);
      continue;
    }

    
    dbOfferValue.push({
        id:row.id,
        businessId: business.id,
        mainImage:mainImage ?? "",
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
      

    
    const images = ["image2", "image3", "image4", "image5"];
    for (const image of images) {
      if (row[image]) {
        if (row[image].startsWith("/tmp") === true) continue;
        const offerPhotoUrl = offerPhotosPublicIds.find((item)=> item.id === `${item.id}-${image}`)?.public_id

        dbOfferPhotosValues.push({
          offerId: row.id,
          photo: offerPhotoUrl ?? "",
          createdAt: row.created_at,
          updatedAt: row.updated_at,
        });
      }
    }
  }
  if(Array.isArray(dbOfferValue) && dbOfferValue.length > 0){
    await db.insert(offers).values(dbOfferValue);
    console.log("============= Successfully Insert Offers Data =============");
  }else {
    console.log("========================= dbOfferValue =========================",dbOfferValue);
    console.log("====== dbOfferValue Doesn't have Data Or May Not Be Array ======")
  }

  if(Array.isArray(dbOfferPhotosValues) && dbOfferPhotosValues.length > 0){
    await db.insert(offerPhotos).values(dbOfferPhotosValues);
    console.log("========== Successfully Insert OffersPhotos Data ==========");
  }else {
    console.log("====================== dbOfferPhotosValue ======================",dbOfferValue);
    console.log("=== dbOfferPhotosValue Doesn't have Data Or May Not Be Array ===")
  }

  console.log("successfully seed of offer and offer photo");
};
// 2. offer_reviews
export const addOfferReviews = async () => {
  const [reviews]: any[] = await sql.execute("SELECT * FROM offer_reviews");
  // const fakeUser = await getFakeBusinessUser()
  type DbOfferReview = InferInsertModel<typeof offerReviews>;
  const dbOfferReviewValue:DbOfferReview[] = []
  const allUsers = await db.select().from(users);
  const allOffers = await db.select().from(offers);


  for (const row of reviews) {
    const user = allUsers.find((user)=> user.id === row.user_id);
    const offer = allOffers.find((offer)=> offer.id === row.offer_id)
 
    if (!user) {
      console.log("user not found", row.id);
      continue;
    }
    if (!offer) {
      console.log("offer not found", row.id);
      continue;
    }

    dbOfferReviewValue.push({
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
   if(Array.isArray(dbOfferReviewValue) && dbOfferReviewValue.length > 0){
    await db.insert(offerReviews).values(dbOfferReviewValue);
    console.log("========== Successfully Insert dbOfferReviewValue Data ==========");
  }else {
    console.log("====================== dbOfferReviewValue ======================",dbOfferReviewValue);
    console.log("=== dbOfferReviewValue Doesn't have Data Or May Not Be Array ===")
  }
  console.log("successfully seed of offerReviews");
};

// 3. OfferSubcategory
export const addOfferSubcategories = async () => {
  const [rows]: any[] = await sql.execute("SELECT * FROM offer_subcategory");
  type DbOfferSubcategory = InferInsertModel<typeof offerSubcategory>;
  const dbOfferSubcategoryValue: DbOfferSubcategory[] = [];
  const allOffers = await db.select().from(offers);
  const allSubcategories = await db.select().from(subcategories);

  for (const row of rows) {
    const offer = allOffers.find((offer)=> offer.id === row.offer_id);
    const subcategory = allSubcategories.find((subcategory)=> subcategory.id === row.subcategory_id);

    if (!offer) {
      console.log("offerId not found", row.id);
      continue;
    }
    if (!subcategory) {
      console.log("subCategory not found", row.id);
      continue;
    }

    dbOfferSubcategoryValue.push({
      offerId: offer.id,
      subcategoryId: subcategory.id,
    });
  }
  if(Array.isArray(dbOfferSubcategoryValue) && dbOfferSubcategoryValue.length > 0){
    await db.insert(offerSubcategory).values(dbOfferSubcategoryValue);
    console.log("========== Successfully Insert dbOfferSubcategoryValue Data ==========");
  }else {
    console.log("====================== dbOfferSubcategoryValue ======================",dbOfferSubcategoryValue);
    console.log("=== dbOfferSubcategoryValue Doesn't have Data Or May Not Be Array ===")
  }
  console.log("successfully seed of OfferSubcategories");
};

// TODO
// 4. RecentViewsOffer
