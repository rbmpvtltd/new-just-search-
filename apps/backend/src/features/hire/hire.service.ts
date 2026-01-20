import { db, schemas } from "@repo/db";
import { hireListing, hireReviews } from "@repo/db/dist/schema/hire.schema";
import { cities, states } from "@repo/db/dist/schema/not-related.schema";
import { TRPCError } from "@trpc/server";
import { algoliasearch } from "algoliasearch";
import { and, eq, sql } from "drizzle-orm";

const algoliaClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
  process.env.ALGOLIA_ADMIN_API_KEY!,
);
async function hireApproved(hireId: number) {
  const hire = (
    await db
      .select({
        id: hireListing.id,
        name: hireListing.name,
        photo: hireListing.photo,
        address: hireListing.address,
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
      .where(eq(hireListing.id, hireId))
  )[0];

  await algoliaClient.saveObjects({
    indexName: "hire_listing",
    objects: [
      {
        objectID: hireId,
        name: hire?.name,
        photo: hire?.photo,
        address: hire?.address,
        gender: hire?.gender,
        languages: hire?.languages,
        workExp: hire?.workExp,
        expectedSalary: Number(hire?.expectedSalary),
        longitude: Number(hire?.longitude),
        latitude: Number(hire?.latitude),
        buildingName: hire?.buildingName,
        jobType: hire?.jobType,
        city: hire?.city,
        state: hire?.state,
        phoneNumber: hire?.phoneNumber,
        workShift: hire?.workShift,
        subcategories: hire?.subcategories,
        category: hire?.category,
        _geoloc: {
          lat: Number(hire?.latitude),
          lng: Number(hire?.longitude),
        },
      },
    ],
  });

  await db
    .update(hireListing)
    .set({
      status: "Approved",
    })
    .where(eq(hireListing.id, hireId));
}

async function reviewExist(
  hireId: number,
  userId: number,
): Promise<boolean> {
  // find review based on userId and businessId
  const data = await db
    .select()
    .from(hireReviews)
    .where(
      and(
        eq(hireReviews.userId, userId),
        eq(hireReviews.hireId, hireId),
      ),
    );

  // return true if reviwe already exist
  if (data.length > 0) {
    return true;
  }
  // return if review is not exist
  return false;
}

async function createReview(
  userId: number,
  hireId: number,
  message: string,
) {
  try {
    console.log("execution comes here===>", userId, hireId, message);
    const data = await db
      .insert(hireReviews)
      .values({
        hireId,
        userId,
        message,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    console.log("review created successfully", data);
    return data;
  } catch (err: any) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Could Not Create Review",
    });
  }
}

export { hireApproved,createReview,reviewExist };

