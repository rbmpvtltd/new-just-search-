import { db, schemas } from "@repo/db";
import { hireCategories } from "@repo/db/dist/schema/hire.schema";
import {
  categories,
  languages,
  subcategories,
} from "@repo/db/dist/schema/not-related.schema";
import {
  businessCategories,
  businessListings,
} from "@repo/db/src/schema/business.schema";
// import { algoliaClient } from "@repo/algolia";
import { hireListing } from "@repo/db/src/schema/hire.schema";
import { cities, states } from "@repo/db/src/schema/not-related.schema";
import { offers } from "@repo/db/src/schema/offer.schema";
import { products } from "@repo/db/src/schema/product.schema";
import { algoliasearch } from "algoliasearch";
import { eq, sql } from "drizzle-orm";

const algoliaClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
  process.env.ALGOLIA_ADMIN_API_KEY!,
);

export async function algoliaSeed() {
  // await algoliaHireSeed();
  // await algoliaBusinessSeed();
  // await algoliaProductOfferSeed();
  await algoliaAllListingSeed();
}

async function algoliaHireSeed() {
  await algoliaClient.setSettings({
    indexName: "hire_listing",
    indexSettings: {
      attributesForFaceting: [
        "gender",
        "languages",
        "searchable(category)",
        "searchable(subcategories)",
        "expectedSalary",
        "searchable(workShift)",
        "workExp",
      ],
    },
  });
  try {
    const data = await db
      .select({
        id: hireListing.id,
        name: hireListing.name,
        photo: hireListing.photo,
        address: hireListing.address,
        gender: hireListing.gender,
        languages: sql<string[]>`
          COALESCE(
            ARRAY_AGG(DISTINCT ${languages.name})
            FILTER (WHERE ${languages.name} IS NOT NULL),
            '{}'
          )
        `,
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
      .leftJoin(
        sql`LATERAL unnest(${hireListing.languages}) AS lang_id(id)`,
        sql`true`,
      )
      .leftJoin(languages, sql`lang_id.id = ${languages.id}`)
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
      const longitude = item.longitude;
      const latitude = item.latitude;
      console.log("longi and lati", longitude, latitude);
      // if (isNaN(Number(longitude))) {
      //   longitude = "73.0363583";
      // }
      // if (isNaN(Number(latitude))) {
      //   latitude = "26.292058";
      // }

      return {
        objectID: item.id,
        name: item.name,
        photo: item.photo,
        address: item.address,
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
          lat: latitude,
          lng: longitude,
        },
      };
    });

    console.log(
      `Preparing to upload ${finalData.length} records to Algolia...`,
    );

    await algoliaClient.clearObjects({ indexName: "hire_listing" });

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
  await algoliaClient.setSettings({
    indexName: "business_listing",
    indexSettings: {
      attributesForFaceting: [
        "searchable(category)",
        "searchable(rating)",
        "searchable(subcategories)",
        "categoryId",
      ],
    },
  });
  try {
    const data = await db
      .select({
        id: businessListings.id,
        name: businessListings.name,
        photo: businessListings.photo,
        address: businessListings.address,
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
      const longitude = item.longitude;
      const latitude = item.latitude;
      console.log("longi and lati", longitude, latitude);
      // if (isNaN(Number(longitude))) {
      //   longitude = 73.0363583;
      // }
      // if (isNaN(Number(latitude))) {
      //   latitude = 26.292058;
      // }

      return {
        objectID: item.id,
        name: item.name,
        photo: item.photo,
        address: item.address,
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
          lat: latitude,
          lng: longitude,
        },
      };
    });

    console.log(
      `Preparing to upload ${finalData.length} records to Algolia...`,
    );

    await algoliaClient.clearObjects({ indexName: "business_listing" });
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
  await algoliaClient.setSettings({
    indexName: "product_offer_listing",
    indexSettings: {
      attributesForFaceting: [
        "price",
        "searchable(category)",
        "searchable(subcategories)",
        "discountPercent",
        "finalPrice",
        "offerEndDate",
      ],
    },
  });
  try {
    const offersData = await db
      .select({
        id: offers.id,
        price: offers.rate,
        discountPercent: offers.discountPercent,
        offerEndDate: offers.offerEndDate,
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
        offerEndDate: 0,
        businessId: item.businessId,
        price: item.price,
        finalPrice: item.finalPrice,
        discountPercent: item.discountPercent,
        photos: item.photos,
        category: item.category,
        subecategory: item.subcategories,
      };
    });
    const odata = offersData.map((item) => {
      return {
        id: item.id,
        objectId: `offers:${item.id}`,
        name: item.name,
        offerEndDate: new Date(item.offerEndDate).getTime(),
        businessId: item.businessId,
        price: item.price,
        finalPrice: item.finalPrice,
        discountPercent: item.discountPercent,
        photos: item.photos,
        category: item.category,
        subecategory: item.subcategories,
      };
    });

    const finalData = [...pdata, ...odata].map((item) => {
      return {
        objectID: item.objectId,
        navigationId: item.id,
        name: item.name,
        offerEndDate: item.offerEndDate,
        photo: item.photos,
        businessId: item.businessId,
        price: item.price,
        discountPercent: item.discountPercent ?? 0,
        finalPrice: item.finalPrice ?? 0,
        subcategories: item.subecategory,
        category: item.category,
      };
    });

    console.log(
      `Preparing to upload ${finalData.length} records to Algolia...`,
    );

    await algoliaClient.clearObjects({ indexName: "product_offer_listing" });
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

async function algoliaAllListingSeed() {
  await algoliaClient.setSettings({
    indexName: "all_listing",
    indexSettings: {
      attributesForFaceting: [
       "gender",
       "searchable(rating)",
        "languages",
        "searchable(category)",
        "searchable(subcategories)",
        "expectedSalary",
        "searchable(workShift)",
        "workExp",
        "categoryId",
      ],
    },
  });
  try {
    // =========== BUSINESS DATA ============
    const businessData = await db
      .select({
        id: businessListings.id,
        name: businessListings.name,
        photo: businessListings.photo,
        address: businessListings.address,
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

    // =========== HIRE DATA ============
    const hireData = await db
      .select({
        id: hireListing.id,
        name: hireListing.name,
        photo: hireListing.photo,
        address: hireListing.address,
        gender: hireListing.gender,
        languages: hireListing.languages,
        workExp: hireListing.workExperienceYear,
        buildingName: hireListing.buildingName,
        streetName: hireListing.streetName,
        expectedSalary: hireListing.expectedSalaryFrom,
        longitude: hireListing.longitude,
        latitude: hireListing.latitude,
        workShift: hireListing.workShift,
        phoneNumber: hireListing.mobileNumber,
        jobType: hireListing.jobType,
        categoryId: hireCategories.categoryId,
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
      .groupBy(hireListing.id, cities.city, states.name, hireCategories.id);

    const bdata = businessData.map((item) => {
      const longitude = item.longitude;
      const latitude = item.latitude;
      console.log("longi and lati", longitude, latitude);
      // if (isNaN(Number(longitude))) {
      //   longitude = "73.0363583";
      // }
      // if (isNaN(Number(latitude))) {
      //   latitude = "26.292058";
      // }

      return {
        objectID: item.id,
        name: item.name,
        listingType: "business",
        photo: item.photo,
        address: item.address,
        gender: null,
        languages: null,
        workExp: null,
        expectedSalary: null,
        longitude,
        latitude,
        buildingName: item.buildingName,
        jobType: null,
        city: null,
        state: null,
        phoneNumber: item.phoneNumber,
        workShift: null,
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

    const hdata = hireData.map((item) => {
      const longitude = item.longitude;
      const latitude = item.latitude;
      console.log("longi and lati", longitude, latitude);
      // if (isNaN(Number(longitude))) {
      //   longitude = "73.0363583";
      // }
      // if (isNaN(Number(latitude))) {
      //   latitude = "26.292058";
      // }

      return {
        objectID: item.id,
        name: item.name,
        listingType: "hire",
        photo: item.photo,
        address: item.address,
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
        categoryId: item.categoryId,
        rating: null,
        streetName: item.streetName,
        category: item.category,
        _geoloc: {
          lat: Number(latitude),
          lng: Number(longitude),
        },
      };
    });

    const finalData = [...bdata, ...hdata];
    console.log(
      `Preparing to upload ${finalData.length} records to Algolia...`,
    );

    await algoliaClient.clearObjects({ indexName: "all_listing" });
    await algoliaClient.saveObjects({
      indexName: "all_listing",
      objects: finalData,
    });

    console.log(
      `✅ Successfully uploaded ${finalData.length} records to Algolia index: all_listing`,
    );

    return { success: true, count: finalData.length };
  } catch (error) {
    console.error("❌ Error uploading to Algolia:", error);
    throw error;
  }
}
