import { db, schemas } from "@repo/db";
import { hireListing } from "@repo/db/dist/schema/hire.schema";
import { cities, states } from "@repo/db/dist/schema/not-related.schema";
import { algoliasearch } from "algoliasearch";
import { eq, sql } from "drizzle-orm";

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

export { hireApproved };
