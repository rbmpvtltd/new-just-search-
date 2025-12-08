import { db, schemas } from "@repo/db";
import { users } from "@repo/db/dist/schema/auth.schema";
import {
  hireInsertSchema,
  hireListing,
  hireUpdateSchema,
} from "@repo/db/dist/schema/hire.schema";
import { cities, states } from "@repo/db/dist/schema/not-related.schema";
import { logger } from "@repo/logger";
import { TRPCError } from "@trpc/server";
import { count, eq, gt, sql } from "drizzle-orm";
import slugify from "slugify";
import z from "zod";
import {
  hireProcedure,
  publicProcedure,
  router,
  visitorProcedure,
} from "@/utils/trpc";
import { changeRoleInSession } from "../auth/lib/session";

export const hirerouter = router({
  add: visitorProcedure.query(async () => {
    const getHireCategories = await db.query.categories.findMany({
      where: (categories, { eq }) => eq(categories.type, 2),
    });

    const getStates = await db.query.states.findMany();

    return {
      getHireCategories,
      getStates,
    };
  }),

  getSubCategories: visitorProcedure
    .input(z.object({ categoryId: z.number() }))
    .query(async ({ input }) => {
      const hireSubCategories = await db.query.subcategories.findMany({
        where: (subcategories, { eq }) =>
          eq(subcategories.categoryId, input.categoryId),
      });

      return hireSubCategories;
    }),

  getCities: visitorProcedure
    .input(z.object({ state: z.number() }))
    .query(async ({ input }) => {
      const cities = await db.query.cities.findMany({
        where: (cities, { eq }) => eq(cities.stateId, input.state),
      });
      return cities;
    }),
  create: visitorProcedure
    .input(
      hireInsertSchema.omit({
        userId: true,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await db.query.users.findFirst({
        where: (users, { eq }) => eq(users.id, ctx.userId),
      });
      if (!user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not found",
        });
      }

      const existingBusiness = await db.query.businessListings.findFirst({
        where: (businessListings, { eq }) =>
          eq(businessListings.userId, ctx.userId),
      });
      if (existingBusiness) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "User already have business listing",
        });
      }

      const existingHire = await db.query.hireListing.findFirst({
        where: (hireListing, { eq }) => eq(hireListing.userId, ctx.userId),
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
        .insert(schemas.hire.hireListing)
        .values({
          userId: ctx.userId,
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
          id: schemas.hire.hireListing.id,
        });

      if (!createHire) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }

      const hireId = createHire.id;

      await db.insert(schemas.hire.hireCategories).values({
        hireId,
        categoryId: input.categoryId,
      });
      await db.insert(schemas.hire.hireSubcategories).values(
        input.subcategoryId.map((subCategoryId) => ({
          subcategoryId: Number(subCategoryId),
          hireId,
        })),
      );

      await db
        .update(schemas.auth.users)
        .set({
          role: "hire",
        })
        .where(eq(schemas.auth.users.id, ctx.userId));

      changeRoleInSession(ctx.sessionId, "hire");

      logger.info("we not get here");
      return {
        success: true,
        message: "Hire listing created successfully",
      };
    }),

  edit: hireProcedure.query(async ({ ctx }) => {
    const hire = await db.query.hireListing.findFirst({
      where: (hireListing, { eq }) => eq(hireListing.userId, ctx.userId),
    });

    if (!hire) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Hire listing not found",
      });
    }
    return hire;
  }),

  update: hireProcedure
    .input(hireUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      const isHireExists = await db.query.hireListing.findFirst({
        where: (hireListing, { eq }) => eq(hireListing.userId, ctx.userId),
      });

      logger.info("isHireExists", isHireExists);
      // return isHireExists;
      if (!isHireExists) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Hire listing not found",
        });
      }

      const updateHire = await db
        .update(schemas.hire.hireListing)
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
          fromHour: input.fromHour,
          toHour: input.toHour,
          employmentStatus: input.employmentStatus,
          relocate: input.relocate,
          availability: input.availability,
          idProof: input.idProof,
          idProofPhoto: input.idProofPhoto,
          coverLetter: input.coverLetter,
          resumePhoto: input.resumePhoto,
          aboutYourself: input.aboutYourself,
        })
        .where(eq(schemas.hire.hireListing.userId, isHireExists.userId));

      // return { updateHire: updateHire };
      if (!updateHire) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }

      await db
        .delete(schemas.hire.hireSubcategories)
        .where(eq(schemas.hire.hireSubcategories.hireId, isHireExists.id));

      // return { deleteSubCategories: deleteSubCategories };
      await db.insert(schemas.hire.hireSubcategories).values(
        input.subcategoryId.map((subCategoryId) => ({
          subcategoryId: subCategoryId,
          hireId: isHireExists.id,
        })),
      );
      return {
        success: true,
        message: "Hire listing updated successfully",
      };
    }),

  show: hireProcedure.query(async ({ ctx }) => {
    if (!ctx.userId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "User not logged in",
      });
    }
    const hireListing = await db.query.hireListing.findFirst({
      where: (hireListing, { eq }) => eq(hireListing.userId, ctx.userId),
    });

    if (!hireListing?.city) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "City not found",
      });
    }
    const cityRecord = await db.query.cities.findFirst({
      where: (cities, { eq }) => eq(cities.id, hireListing.city),
      columns: { id: true, city: true },
    });
    if (!cityRecord) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "City Record not found",
      });
    }

    if (!hireListing?.state) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "State not found",
      });
    }
    const stateRecord = await db.query.states.findFirst({
      where: (states, { eq }) => eq(states.id, hireListing.state),
      columns: { id: true, name: true },
    });

    if (!stateRecord) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "State Record not found",
      });
    }

    const hireCategoryRecord = await db.query.hireCategories.findFirst({
      where: (hireCategories, { eq }) =>
        eq(hireCategories.hireId, hireListing?.id),
    });

    if (!hireCategoryRecord?.categoryId) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Category not found",
      });
    }
    const categoryRecord = await db.query.categories.findFirst({
      where: (categories, { eq }) =>
        eq(categories.id, hireCategoryRecord.categoryId),
      columns: { id: true, title: true },
    });
    if (!categoryRecord) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Category Record not found",
      });
    }
    const hireSubcategoryRecords = await db.query.hireSubcategories.findMany({
      where: (hireSubcategories, { eq }) =>
        eq(hireSubcategories.hireId, Number(hireListing?.id)),
    });

    const subcategoryIds = hireSubcategoryRecords.map(
      (item) => item.subcategoryId,
    );

    if (subcategoryIds.length === 0) {
      logger.info(
        "No subcategories found for this hire listing",
        subcategoryIds,
      );
    }
    const subcategoryRecords = await db.query.subcategories.findMany({
      where: (subcategories, { inArray }) =>
        inArray(subcategories.id, subcategoryIds),
      columns: { id: true, name: true },
    });

    return {
      ...hireListing,
      city: cityRecord,
      state: stateRecord,
      categoryId: categoryRecord,
      subcategoryId: subcategoryRecords,
      success: true,
    };
  }),

  delete: hireProcedure.mutation(async ({ ctx }) => {
    const hireListing = await db.query.hireListing.findFirst({
      where: (hireListing, { eq }) => eq(hireListing.userId, ctx.userId),
    });

    await db
      .delete(schemas.hire.hireSubcategories)
      .where(
        eq(schemas.hire.hireSubcategories.hireId, Number(hireListing?.id)),
      );

    await db
      .delete(schemas.hire.hireCategories)
      .where(eq(schemas.hire.hireCategories.hireId, Number(hireListing?.id)));

    await db
      .delete(schemas.hire.hireListing)
      .where(eq(schemas.hire.hireListing.userId, Number(ctx.userId)));

    await db
      .update(schemas.auth.users)
      .set({
        role: "visiter",
      })
      .where(eq(schemas.auth.users.id, ctx.userId));

    changeRoleInSession(ctx.sessionId, "visiter");

    return {
      success: true,
      message: "Hire listing deleted successfully",
    };
  }),
  allHireLising: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(20).nullish(),
        page: z.number().min(1),
      }),
    )
    .query(async ({ input }) => {
      const limit = input.limit ?? 10;
      const offset = (input.page - 1) * limit;

      const data = await db
        .select({
          id: hireListing.id,
          name: hireListing.name,
          photo: hireListing.photo,
          area: hireListing.area,
          streetName: hireListing.streetName,
          buildingName: hireListing.buildingName,
          longitude: hireListing.longitude,
          latitude: hireListing.latitude,
          phoneNumber: hireListing.mobileNumber,
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
        .groupBy(hireListing.id)
        .limit(limit)
        .offset(offset);

      const totalCount = await db.select({ count: count() }).from(hireListing);

      return {
        data,
        page: input.page,
        totalPages: Math.ceil(Number(totalCount[0]?.count ?? 0) / limit),
      };
    }),

  singleHire: publicProcedure
    .input(z.object({ hireId: z.number() }))
    .query(async ({ input }) => {
      const data = await db
        .select({
          id: hireListing.id,
          name: hireListing.name,
          email: hireListing.email,
          photo: hireListing.photo,
          languages: hireListing.languages,
          area: hireListing.area,
          streetName: hireListing.streetName,
          buildingName: hireListing.buildingName,
          qualification: hireListing.highestQualification,
          yearOfExp: hireListing.workExperienceYear,
          monthOfExp: hireListing.workExperienceMonth,
          dob: hireListing.dob,
          gender: hireListing.gender,
          employmentStatus: hireListing.employmentStatus,
          phone: hireListing.mobileNumber,
          wtspNumber: hireListing.whatsappNo,
          workingShift: hireListing.workShift,
          jobRole: hireListing.jobRole,
          expertise: hireListing.expertise,
          skillSet: hireListing.skillset,
          martialStatus: hireListing.maritalStatus,
          relocate: hireListing.relocate,
          specilities: hireListing.specialities,
          description: hireListing.description,
          latitude: hireListing.latitude,
          longitude: hireListing.latitude,
          pincode: hireListing.pincode,
          jobType: hireListing.jobType,
          city: cities.city,
          mobileNo: users.phoneNumber,
          state: states.name,
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
        .from(hireListing)
        .leftJoin(cities, eq(hireListing.city, cities.id))
        .leftJoin(states, eq(hireListing.state, states.id))
        .leftJoin(users, eq(hireListing.userId, users.id))
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

        .groupBy(hireListing.id, cities.city, states.name, users.phoneNumber)
        .where(eq(hireListing.id, input.hireId));

      console.log("================data is =============", data);
      return {
        data: data[0],
        status: true,
      };
    }),

  MobileAllHireLising: publicProcedure
    .input(
      z.object({
        cursor: z.number(),
        limit: z.number().min(1).max(20).nullish(),
      }),
    )
    .query(async ({ input }) => {
      const limit = input.limit ?? 10;

      const data = await db
        .select({
          id: hireListing.id,
          name: hireListing.name,
          photo: hireListing.photo,
          area: hireListing.area,
          streetName: hireListing.streetName,
          buildingName: hireListing.buildingName,
          longitude: hireListing.longitude,
          latitude: hireListing.latitude,
          phoneNumber: hireListing.mobileNumber,
          jobType: hireListing.jobType,
          jobRole: hireListing.jobRole,
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
        .where(gt(hireListing.id, input.cursor))
        .groupBy(hireListing.id)
        .limit(limit);

      const nextCursor = data[data.length - 1]?.id;

      return {
        data,
        nextCursor,
      };
    }),
});
