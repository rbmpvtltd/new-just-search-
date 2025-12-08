// features/banners/banners.admin.routes.ts
import { db } from "@repo/db";
import { users } from "@repo/db/dist/schema/auth.schema";
import {
  hireCategories,
  hireInsertSchema,
  hireListing,
  hireSubcategories,
  hireUpdateSchema,
} from "@repo/db/dist/schema/hire.schema";
import {
  categories,
  cities,
  subcategories,
} from "@repo/db/dist/schema/not-related.schema";
import { TRPCError } from "@trpc/server";
import { eq, inArray, sql } from "drizzle-orm";
import slugify from "slugify";
import z from "zod";
import {
  cloudinaryDeleteImageByPublicId,
  cloudinaryDeleteImagesByPublicIds,
} from "@/lib/cloudinary";
import {
  buildOrderByClause,
  buildWhereClause,
  tableInputSchema,
} from "@/lib/tableUtils";
import { adminProcedure, router } from "@/utils/trpc";
import {
  hireAllowedSortColumns,
  hireColumns,
  hireGlobalFilterColumns,
} from "./hire.admin.service";

export const adminHireRouter = router({
  list: adminProcedure.input(tableInputSchema).query(async ({ input }) => {
    const where = buildWhereClause(
      input.filters,
      input.globalFilter,
      hireColumns,
      hireGlobalFilterColumns,
    );

    const orderBy = buildOrderByClause(
      input.sorting,
      hireAllowedSortColumns,
      sql`created_at DESC`,
    );

    const offset = input.pagination.pageIndex * input.pagination.pageSize;

    const data = await db
      .select({
        id: hireListing.id,
        photo: hireListing.photo,
        name: hireListing.name,
        phone: users.phoneNumber,
        city: cities.city,
        category:
          sql<string>`string_agg(DISTINCT ${categories.title}, ', ' ORDER BY ${categories.title})`.as(
            "category",
          ),
        subcategories:
          sql<string>`string_agg(DISTINCT ${subcategories.name}, ', ' ORDER BY ${subcategories.name})`.as(
            "subcategories",
          ),
        status: hireListing.status,
        created_at: hireListing.createdAt,
      })
      .from(hireListing)
      .where(where)
      .orderBy(orderBy)
      .limit(input.pagination.pageSize)
      .leftJoin(users, eq(hireListing.userId, users.id))
      .leftJoin(cities, eq(hireListing.city, cities.id))
      .leftJoin(hireSubcategories, eq(hireListing.id, hireSubcategories.hireId))
      .leftJoin(
        subcategories,
        eq(hireSubcategories.subcategoryId, subcategories.id),
      )
      .leftJoin(hireCategories, eq(hireListing.id, hireCategories.hireId))
      .leftJoin(categories, eq(hireCategories.categoryId, categories.id))
      .offset(offset)
      .groupBy(
        hireListing.id,
        hireListing.photo,
        hireListing.name,
        users.phoneNumber,
        cities.id,
        hireListing.status,
        hireListing.createdAt,
      );

    const totalResult = await db
      .select({
        count: sql<number>`count(distinct ${hireListing.id})::int`,
      })
      .from(hireListing)
      .where(where)
      .leftJoin(hireSubcategories, eq(hireListing.id, hireSubcategories.hireId))
      .leftJoin(
        subcategories,
        eq(hireSubcategories.subcategoryId, subcategories.id),
      )
      .leftJoin(hireCategories, eq(hireListing.id, hireCategories.hireId))
      .leftJoin(categories, eq(hireCategories.categoryId, categories.id))
      .leftJoin(users, eq(hireListing.userId, users.id));
    // .groupBy(businessListings.id);

    const total = totalResult[0]?.count ?? 0;
    const totalPages = Math.ceil(total / input.pagination.pageSize);

    return {
      data,
      totalCount: total,
      totalPages,
      pageCount: totalPages,
    };
  }),
  add: adminProcedure.query(async () => {
    const getHireCategories = await db.query.categories.findMany({
      where: (categories, { eq }) => eq(categories.type, 2),
    });
    const getStates = await db.query.states.findMany();
    const users = await db.query.users.findMany({
      where: (user, { eq }) => eq(user.role, "visiter"),
      columns: {
        displayName: true,
        id: true,
      },
    });
    return {
      users,
      getHireCategories,
      getStates,
    };
  }),

  getSubCategories: adminProcedure
    .input(z.object({ categoryId: z.number() }))
    .query(async ({ input }) => {
      const businessSubCategories = await db.query.subcategories.findMany({
        where: (subcategories, { eq }) =>
          eq(subcategories.categoryId, input.categoryId),
      });
      return businessSubCategories;
    }),

  getCities: adminProcedure
    .input(z.object({ state: z.number() }))
    .query(async ({ input }) => {
      const cities = await db.query.cities.findMany({
        where: (cities, { eq }) => eq(cities.stateId, input.state),
      });
      return cities;
    }),

  create: adminProcedure.input(hireInsertSchema).mutation(async ({ input }) => {
    const user = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, input.userId),
    });
    if (!user) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "User not found",
      });
    }

    const existingBusiness = await db.query.businessListings.findFirst({
      where: (businessListings, { eq }) =>
        eq(businessListings.userId, input.userId),
    });
    if (existingBusiness) {
      throw new TRPCError({
        code: "CONFLICT",
        message: "User already have business listing",
      });
    }

    const existingHire = await db.query.hireListing.findFirst({
      where: (hireListing, { eq }) => eq(hireListing.userId, input.userId),
    });

    if (existingHire) {
      throw new TRPCError({
        code: "CONFLICT",
        message: "User already have hire listing",
      });
    }

    const isStateExists = await db.query.states.findFirst({
      where: (states, { eq }) => eq(states.id, Number(input.state)),
    });
    if (!isStateExists) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "State not found",
      });
    }

    const isCityExists = await db.query.cities.findFirst({
      where: (cities, { eq }) => eq(cities.id, input.city),
    });
    if (!isCityExists) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "City not found",
      });
    }
    const slugifyName = slugify(input.name, {
      lower: true,
      strict: true,
    });

    const [createHire] = await db
      .insert(hireListing)
      .values({
        userId: input.userId,
        name: input.name,
        photo: input.photo,
        fatherName: input.fatherName,
        dob: input.dob,
        gender: input.gender,
        maritalStatus: input.maritalStatus,
        languages: Array.isArray(input.languages)
          ? input.languages
          : JSON.parse(input.languages || "[]"),
        slug: slugifyName,
        specialities: input.specialities,
        description: input.description,
        latitude: input.latitude,
        longitude: input.longitude,
        area: input.area,
        pincode: input.pincode,
        state: input.state,
        city: input.city,
        email: input.email,
        mobileNumber: input.mobileNumber,
        alternativeMobileNumber: input.alternativeMobileNumber,
        highestQualification: input.highestQualification,
        workExperienceYear: input.workExperienceYear,
        workExperienceMonth: input.workExperienceMonth,
        jobRole: input.jobRole,
        previousJobRole: input.previousJobRole,
        skillset: input.skillset,
        jobType: Array.isArray(input.jobType)
          ? input.jobType
          : JSON.parse(input.jobType || "[]"),
        workShift: Array.isArray(input.workShift)
          ? input.workShift
          : JSON.parse(input.workShift || "[]"),
        jobDuration: Array.isArray(input.jobDuration)
          ? input.jobDuration
          : JSON.parse(input.jobDuration || "[]"),
        locationPreferred: input.locationPreferred,
        certificates: input.certificates,
        expectedSalaryFrom: input.expectedSalaryFrom,
        expectedSalaryTo: input.expectedSalaryTo,
        fromHour: input.fromHour,
        toHour: input.toHour,
        relocate: input.relocate,
        availability: input.availability,
        idProof: input.idProof,
        idProofPhoto: input.idProofPhoto,
        coverLetter: input.coverLetter,
        resumePhoto: input.resumePhoto,
        aboutYourself: input.aboutYourself,
        abilities: "",
        buildingName: "",
        streetName: "",
        landmark: "",
        whatsappNo: "",
        schedules: "",
        employmentStatus: "",
        expertise: "",
        facebook: "",
        twitter: "",
        linkedin: "",
        views: 0,
        isFeature: false,
        status: "Pending",
        website: "",
      })
      .returning({
        id: hireListing.id,
      });

    if (!createHire) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong",
      });
    }

    const hireId = createHire.id;

    await db.insert(hireCategories).values({
      hireId,
      categoryId: input.categoryId,
    });
    await db.insert(hireSubcategories).values(
      input.subcategoryId.map((subCategoryId) => ({
        subcategoryId: Number(subCategoryId),
        hireId,
      })),
    );

    await db
      .update(users)
      .set({
        role: "hire",
      })
      .where(eq(users.id, input.userId));

    return {
      success: true,
      message: "Hire listing created successfully",
    };
  }),

  edit: adminProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .query(async ({ input }) => {
      const getHireCategories = await db.query.categories.findMany({
        where: (categories, { eq }) => eq(categories.type, 2),
        columns: {
          title: true,
          id: true,
        },
      });
      const getStates = await db.query.states.findMany();
      const hire = await db.query.hireListing.findFirst({
        where: (hire, { eq }) => eq(hire.id, input.id),
      });
      const category = await db.query.hireCategories.findFirst({
        where: (hireCategory, { eq }) => eq(hireCategory.hireId, input.id),
        columns: {
          categoryId: true,
        },
      });
      const subcategory = await db.query.hireSubcategories.findMany({
        where: (hireSubCategory, { eq }) =>
          eq(hireSubCategory.hireId, input.id),
        columns: {
          subcategoryId: true,
        },
      });
      return {
        hire,
        category,
        subcategory,
        getHireCategories,
        getStates,
      };
    }),
  update: adminProcedure.input(hireUpdateSchema).mutation(async ({ input }) => {
    //TODO: delete photo from cloudinary
    const isHireExists = await db.query.hireListing.findFirst({
      where: (hireListing, { eq }) =>
        eq(hireListing.userId, Number(input.userId)),
    });

    if (!isHireExists) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Hire listing not found",
      });
    }

    const updateHire = await db
      .update(hireListing)
      .set({
        name: input.name,
        photo: input.photo,
        fatherName: input.fatherName,
        dob: input.dob,
        gender: input.gender,
        maritalStatus: input.maritalStatus,
        languages: Array.isArray(input.languages)
          ? input.languages
          : JSON.parse(input.languages || "[]"),
        slug: input.name,
        specialities: input.specialities,
        description: input.description,
        latitude: input.latitude,
        longitude: input.longitude,
        area: input.area,
        pincode: input.pincode,
        state: input.state,
        city: input.city,
        email: input.email,
        mobileNumber: input.mobileNumber,
        alternativeMobileNumber: input.alternativeMobileNumber,
        highestQualification: input.highestQualification,
        workExperienceYear: input.workExperienceYear,
        workExperienceMonth: input.workExperienceMonth,
        jobRole: input.jobRole,
        previousJobRole: input.previousJobRole,
        skillset: input.skillset,
        jobType: Array.isArray(input.jobType)
          ? input.jobType
          : JSON.parse(input.jobType || "[]"),
        jobDuration: Array.isArray(input.jobDuration)
          ? input.jobDuration
          : JSON.parse(input.jobDuration || "[]"),
        workShift: Array.isArray(input.workShift)
          ? input.workShift
          : JSON.parse(input.workShift || "[]"),
        locationPreferred: input.locationPreferred,
        certificates: input.certificates,
        expectedSalaryFrom: input.expectedSalaryFrom,
        expectedSalaryTo: input.expectedSalaryTo,
        employmentStatus: input.employmentStatus,
        relocate: input.relocate,
        availability: input.availability,
        idProof: input.idProof,
        idProofPhoto: input.idProofPhoto,
        coverLetter: input.coverLetter,
        resumePhoto: input.resumePhoto,
        aboutYourself: input.aboutYourself,
      })
      .where(eq(hireListing.userId, isHireExists.userId));

    // return { updateHire: updateHire };
    if (!updateHire) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong",
      });
    }

    await db
      .delete(hireSubcategories)
      .where(eq(hireSubcategories.hireId, isHireExists.id));

    await db.insert(hireSubcategories).values(
      input.subcategoryId.map((subCategoryId) => ({
        subcategoryId: subCategoryId,
        hireId: isHireExists.id,
      })),
    );

    await db
      .delete(hireCategories)
      .where(eq(hireCategories.hireId, isHireExists.id));

    await db.insert(hireCategories).values({
      categoryId: input.categoryId,
      hireId: isHireExists.id,
    });
    return {
      success: true,
      message: "Hire listing updated successfully",
    };
  }),
  multidelete: adminProcedure
    .input(
      z.object({
        ids: z.array(z.number()),
      }),
    )
    .mutation(async ({ input }) => {
      //TODO: remove subcategory of these categories;
      const allSeletedPhoto = await db
        .select({
          photo: categories.photo,
        })
        .from(categories)
        .where(inArray(categories.id, input.ids));
      await cloudinaryDeleteImagesByPublicIds(
        allSeletedPhoto.map((item) => item.photo),
      );
      //TODO: test that subcategory is also deleting
      await db
        .delete(subcategories)
        .where(inArray(subcategories.categoryId, input.ids));
      await db.delete(categories).where(inArray(categories.id, input.ids));
      return { success: true };
    }),
  multiactive: adminProcedure
    .input(
      z.array(
        z.object({
          id: z.number(),
          isActive: z.boolean(),
        }),
      ),
    )
    .mutation(async ({ input }) => {
      await db
        .update(categories)
        .set({
          status: sql`CASE ${categories.id} 
            ${sql.join(
              input.map(
                (item) =>
                  sql`WHEN ${item.id} THEN ${item.isActive ? sql`true` : sql`false`}`,
              ),
              sql` `,
            )}
                ELSE ${categories.status} 
                END`,
        })
        .where(
          inArray(
            categories.id,
            input.map((item) => item.id),
          ),
        );

      return { success: true };
    }),
  multipopular: adminProcedure
    .input(
      z.array(
        z.object({
          id: z.number(),
          isActive: z.boolean(),
        }),
      ),
    )
    .mutation(async ({ input }) => {
      await db
        .update(categories)
        .set({
          isPopular: sql`CASE ${categories.id} 
            ${sql.join(
              input.map(
                (item) =>
                  sql`WHEN ${item.id} THEN ${item.isActive ? sql`true` : sql`false`}`,
              ),
              sql` `,
            )} 
                ELSE ${categories.isPopular} 
                END`,
        })
        .where(
          inArray(
            categories.id,
            input.map((item) => item.id),
          ),
        );

      return { success: true };
    }),
});
