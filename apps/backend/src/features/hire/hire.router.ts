import { db, schemas } from "@repo/db";
import {
  hireInsertSchema,
  hireUpdateSchema,
} from "@repo/db/src/schema/hire.schema";
import { logger } from "@repo/helper";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import z from "zod";
import { hireProcedure, router, visitorProcedure } from "@/utils/trpc";
import { changeRoleInSession } from "../auth/lib/session";

export const hirerouter = router({
  add: visitorProcedure.query(async ({ ctx }) => {
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

      let existingHire: any = null;
      try {
        existingHire = await db.query.hireListing.findFirst({
          where: (hireListing, { eq }) => eq(hireListing.userId, ctx.userId),
        });
      } catch (error) {
        logger.error("Error in existingHire:", error);
        return;
      }

      logger.info("existingHire", existingHire);
      if (existingHire) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "User already have hire listing",
        });
      }

      const existingEmail = await db.query.hireListing.findFirst({
        where: (hireListing, { eq }) =>
          eq(hireListing.email, String(input.email)),
      });
      if (existingEmail) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Email address already exist",
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
          preferredWorkingHours: "",
          status: true,
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
          preferredWorkingHours: input.preferredWorkingHours,
          employmentStatus: input.employmentStatus,
          relocate: input.relocate,
          availability: input.availability,
          idProof: input.idProof,
          idProofPhoto: input.idProofPhoto,
          coverLetter: input.coverLetter,
          resumePhoto: input.resumePhoto,
          aboutYourself: input.aboutYourself,
        })
        .where(eq(schemas.hire.hireListing.userId, ctx.userId));

      if (!updateHire) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }

      await db
        .delete(schemas.hire.hireSubcategories)
        .where(eq(schemas.hire.hireSubcategories.hireId, ctx.userId));

      await db.insert(schemas.hire.hireSubcategories).values(
        input.subcategoryId.map((subCategoryId) => ({
          subcategoryId: subCategoryId,
          hireId: ctx.userId,
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
    const isVisible = true;
    const hireListing = await db.query.hireListing.findFirst({
      where: (hireListing, { eq }) => eq(hireListing.userId, ctx.userId),
    });

    if (!hireListing) {
      return {
        success: false,
        message: "Hire listing not found",
        isVisible,
      };
    }
    const cityRecord = await db.query.cities.findFirst({
      where: (cities, { eq }) => eq(cities.id, Number(hireListing?.city)),
    });
    const stateRecord = await db.query.states.findFirst({
      where: (states, { eq }) => eq(states.id, Number(hireListing?.state)),
    });
    const hireCategoryRecord = await db.query.hireCategories.findFirst({
      where: (hireCategories, { eq }) =>
        eq(hireCategories.hireId, Number(hireListing?.id)),
    });

    const categoryRecord = await db.query.categories.findFirst({
      where: (categories, { eq }) =>
        eq(categories.id, Number(hireCategoryRecord?.categoryId)),
    });

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
      // return [];
    }
    const subcategoryRecords = await db.query.subcategories.findMany({
      where: (subcategories, { inArray }) =>
        inArray(subcategories.id, subcategoryIds),
    });

    return {
      ...hireListing,
      city: cityRecord?.city,
      state: stateRecord?.name,
      category: categoryRecord?.title,
      subCategories: subcategoryRecords.map((item) => item.name),
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
  }),
});
