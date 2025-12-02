import { db, schemas } from "@repo/db";
// import { algoliaClient } from "@repo/algolia";
import { hireListing } from "@repo/db/src/schema/hire.schema";
import { eq, sql } from "drizzle-orm";
import { algoliasearch } from "algoliasearch";
import { cities, states } from "@repo/db/src/schema/not-related.schema";
import {
  businessCategories,
  businessListings,
} from "@repo/db/src/schema/business.schema";
import { offers } from "@repo/db/src/schema/offer.schema";
import { products } from "@repo/db/src/schema/product.schema";

const algoliaClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
  process.env.ALGOLIA_ADMIN_API_KEY!,
);

export async function algoliaSeed() {
  // await algoliaHireSeed()
  // await algoliaBusinessSeed()
  // await algoliaProductOfferSeed();
}

async function algoliaHireSeed() {
  try {
    const data = await db
      .select({
        id: hireListing.id,
        name: hireListing.name,
        photo: hireListing.photo,
        area: hireListing.area,
        gender: hireListing.gender,
        languages: hireListing.languages,
        workExp: hireListing.workExperienceYear,
        buildingName: hireListing.buildingName,
        expectedSalary: hireListing.expectedSalaryFrom,
        longitude: hireListing.longitude,
        latitude: hireListing.latitude,
        workShift: hireListing.workShift,
        phoneNumber: hireListing.mobileNumber,
        jobType: hireListing.jobType,
        city: cities.city,
        state: states.name,
        subcategories: sql<string[]>`
            COALESCE(
              ARRAY_AGG(DISTINCT subcategories.name) 
              FILTER (WHERE subcategories.id IS NOT NULL),
              '{}'
            )
          `,
        category: sql<string | null>`
          MAX(${schemas.not_related.categories.title})
        `,
      })
      .from(hireListing)
      .innerJoin(
        schemas.hire.hireCategories,
        eq(hireListing.id, schemas.hire.hireCategories.hireId),
      )
      .leftJoin(cities, eq(hireListing.city, cities.id))
      .leftJoin(states, eq(hireListing.state, states.id))
      .leftJoin(
        schemas.hire.hireSubcategories,
        eq(hireListing.id, schemas.hire.hireSubcategories.hireId),
      )
      .leftJoin(
        schemas.not_related.subcategories,
        eq(
          schemas.hire.hireSubcategories.subcategoryId,
          schemas.not_related.subcategories.id,
        ),
      )
      .leftJoin(
        schemas.not_related.categories,
        eq(
          schemas.not_related.subcategories.categoryId,
          schemas.not_related.categories.id,
        ),
      )
      .groupBy(hireListing.id, cities.city, states.name);

    const finalData = data.map((item) => {
      let longitude = item.longitude?.replaceAll(",", "");
      let latitude = item.latitude?.replaceAll(",", "");
      console.log("longi and lati", longitude, latitude);
      if (isNaN(Number(longitude))) {
        longitude = "73.0363583";
      }
      if (isNaN(Number(latitude))) {
        latitude = "26.292058";
      }

      return {
        objectID: item.id,
        name: item.name,
        photo: item.photo,
        area: item.area,
        gender: item.gender,
        languages: item.languages,
        workExp: item.workExp,
        expectedSalary: Number(item.expectedSalary),
        longitude,
        latitude,
        buildingName: item.buildingName,
        jobType: item.jobType,
        city: item.city,
        state: item.state,
        phoneNumber: item.phoneNumber,
        workShift: item.workShift,
        subcategories: item.subcategories,
        category: item.category,
        _geoloc: {
          lat: Number(latitude),
          lng: Number(longitude),
        },
      };
    });

    console.log(
      `Preparing to upload ${finalData.length} records to Algolia...`,
    );

    await algoliaClient.saveObjects({
      indexName: "hire_listing",
      objects: finalData,
    });

    console.log(
      `✅ Successfully uploaded ${finalData.length} records to Algolia index: hire_listing`,
    );

    return { success: true, count: finalData.length };
  } catch (error) {
    console.error("❌ Error uploading to Algolia:", error);
    throw error;
  }
}

async function algoliaBusinessSeed() {
  try {
    const data = await db
      .select({
        id: businessListings.id,
        name: businessListings.name,
        photo: businessListings.photo,
        area: businessListings.area,
        streetName: businessListings.streetName,
        buildingName: businessListings.buildingName,
        longitude: businessListings.longitude,
        latitude: businessListings.latitude,
        phoneNumber: businessListings.phoneNumber,
        categoryId: businessCategories.categoryId,
        rating: sql<
          string[]
        >`COALESCE(AVG(${schemas.business.businessReviews.rate}),0)`,
        subcategories: sql<string[]>`
          COALESCE(
            ARRAY_AGG(DISTINCT subcategories.name) 
            FILTER (WHERE subcategories.id IS NOT NULL),
            '{}'
          )
        `,
        category: sql<
          string | null
        >`MAX(${schemas.not_related.categories.title})`,
      })
      .from(businessListings)
      .innerJoin(
        businessCategories,
        eq(businessListings.id, businessCategories.businessId),
      )
      .leftJoin(
        schemas.business.businessSubcategories,
        eq(
          businessListings.id,
          schemas.business.businessSubcategories.businessId,
        ),
      )
      .leftJoin(
        schemas.not_related.subcategories,
        eq(
          schemas.business.businessSubcategories.subcategoryId,
          schemas.not_related.subcategories.id,
        ),
      )
      .leftJoin(
        schemas.not_related.categories,
        eq(
          schemas.not_related.subcategories.categoryId,
          schemas.not_related.categories.id,
        ),
      )
      .leftJoin(
        schemas.business.businessReviews,
        eq(businessListings.id, schemas.business.businessReviews.businessId),
      )
      .groupBy(businessListings.id, businessCategories.id);

    const finalData = data.map((item) => {
      let longitude = item.longitude?.replaceAll(",", "");
      let latitude = item.latitude?.replaceAll(",", "");
      console.log("longi and lati", longitude, latitude);
      if (isNaN(Number(longitude))) {
        longitude = "73.0363583";
      }
      if (isNaN(Number(latitude))) {
        latitude = "26.292058";
      }

      return {
        objectID: item.id,
        name: item.name,
        photo: item.photo,
        area: item.area,
        longitude,
        latitude,
        buildingName: item.buildingName,
        phoneNumber: item.phoneNumber,
        subcategories: item.subcategories,
        streetName: item.streetName,
        category: item.category,
        categoryId: item.categoryId,
        rating: Math.ceil(Number(item.rating)),
        _geoloc: {
          lat: Number(latitude),
          lng: Number(longitude),
        },
      };
    });

    console.log(
      `Preparing to upload ${finalData.length} records to Algolia...`,
    );

    await algoliaClient.saveObjects({
      indexName: "business_listing",
      objects: finalData,
    });

    console.log(
      `✅ Successfully uploaded ${finalData.length} records to Algolia index: business_listing`,
    );

    return { success: true, count: finalData.length };
  } catch (error) {
    console.error("❌ Error uploading to Algolia:", error);
    throw error;
  }
}

async function algoliaProductOfferSeed() {
  try {
    const offersData = await db
      .select({
        id: offers.id,
        price: offers.rate,
        discountPercent: offers.discountPercent,
        businessId: offers.businessId,
        finalPrice: offers.finalPrice,
        name: offers.offerName,
        photos: sql<string[]>`
      COALESCE(
        (SELECT ARRAY_AGG(offer_photos.photo)
         FROM offer_photos
         WHERE offer_photos.offer_id = offers.id),
        '{}'
      )
    `,
        subcategories: sql<string[]>`
      COALESCE(
        ARRAY_AGG(DISTINCT subcategories.name)
        FILTER (WHERE subcategories.id IS NOT NULL),
        '{}'
      )
    `,
        category: sql<string | null>`
      MAX(${schemas.not_related.categories.title})
    `,
      })
      .from(offers)
      .leftJoin(
        schemas.offer.offerSubcategory,
        eq(offers.id, schemas.offer.offerSubcategory.offerId),
      )
      .leftJoin(
        schemas.not_related.subcategories,
        eq(
          schemas.offer.offerSubcategory.subcategoryId,
          schemas.not_related.subcategories.id,
        ),
      )
      .leftJoin(businessListings, eq(offers.businessId, businessListings.id))
      .leftJoin(
        businessCategories,
        eq(businessListings.id, businessCategories.businessId),
      )
      .leftJoin(
        schemas.not_related.categories,
        eq(businessCategories.categoryId, schemas.not_related.categories.id),
      )
      .groupBy(offers.id);

    const productsData = await db
      .select({
        id: products.id,
        name: products.productName,
        discountPercent: products.discountPercent,
        businessId: products.businessId,
        finalPrice: products.finalPrice,
        price: products.rate,
        photos: sql<string[]>`
      COALESCE(
        (SELECT ARRAY_AGG(product_photos.photo)
         FROM product_photos
         WHERE product_photos.product_id = products.id),
        '{}'
      )
    `,
        subcategories: sql<string[]>`
      COALESCE(
        ARRAY_AGG(DISTINCT subcategories.name)
        FILTER (WHERE subcategories.id IS NOT NULL),
        '{}'
      )
    `,
        category: sql<string | null>`
      MAX(${schemas.not_related.categories.title})
    `,
      })
      .from(products)
      .leftJoin(
        schemas.product.productSubCategories,
        eq(products.id, schemas.product.productSubCategories.productId),
      )
      .leftJoin(
        schemas.not_related.subcategories,
        eq(
          schemas.product.productSubCategories.subcategoryId,
          schemas.not_related.subcategories.id,
        ),
      )
      .leftJoin(businessListings, eq(products.businessId, businessListings.id))
      .leftJoin(
        businessCategories,
        eq(businessListings.id, businessCategories.businessId),
      )
      .leftJoin(
        schemas.not_related.categories,
        eq(businessCategories.categoryId, schemas.not_related.categories.id),
      )
      .groupBy(products.id);

    const pdata = productsData.map((item) => {
      return {
        id: item.id,
        objectId: `product:${item.id}`,
        name: item.name,
        businessId: item.businessId,
        price: item.price,
        finalPrice: item.finalPrice,
        discountPercent: item.discountPercent,
        photos: item.photos,
        category : item.category,
        subecategory: item.subcategories,
      };
    });
    const odata = offersData.map((item) => {
      return {
        id: item.id,
        objectId: `offers:${item.id}`,
        name: item.name,
        businessId: item.businessId,
        price: item.price,
        finalPrice: item.finalPrice,
        discountPercent: item.discountPercent,
        photos: item.photos,
        category : item.category,
        subecategory: item.subcategories,
      };
    });

    const finalData = [...pdata, ...odata].map((item) => {
      return {
        objectID: item.objectId,
        navigationId: item.id,
        name: item.name,
        photo: item.photos,
        businessId: item.businessId,
        price: item.price,
        discountPercent: item.discountPercent ?? 0,
        finalPrice: item.finalPrice ?? 0,
        subcategories: item.subecategory,
        category : item.category,
      };
    });

    console.log(
      `Preparing to upload ${finalData.length} records to Algolia...`,
    );

    await algoliaClient.saveObjects({
      indexName: "product_offer_listing",
      objects: finalData,
    });

    console.log(
      `✅ Successfully uploaded ${finalData.length} records to Algolia index: business_listing`,
    );

    return { success: true, count: finalData.length };
  } catch (error) {
    console.error("❌ Error uploading to Algolia:", error);
    throw error;
  }
}

// Run the seed function
// algoliaSeed()
//   .then((result) => {
//     console.log("Seed completed:", result);
//     process.exit(0);
//   })
//   .catch((error) => {
//     console.error("Seed failed:", error);
//     process.exit(1);
//   });
