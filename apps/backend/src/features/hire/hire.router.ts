import {
  db,
  GENDER,
  ID_PROOF,
  JOB_DURATION,
  JOB_TYPE,
  LANGUAGES,
  MARITAL_STATUS,
  QUALIFICATION,
  RELOCATE,
  schemas,
  WORK_SHIFT,
} from "@repo/db";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import z from "zod";

import { hireProcedure, router, visitorProcedure } from "@/utils/trpc";
import { changeRoleInSession } from "../auth/lib/session";
export const hirerouter = router({
  add: hireProcedure.query(async ({ ctx }) => {
    const getHireCategories = await db.query.hireCategories.findMany();
    const getHireSubCategories = await db.query.hireSubcategories.findMany();
    const getCities = await db.query.cities.findMany();
    const getStates = await db.query.states.findMany();
    return {
      getHireCategories,
      getHireSubCategories,
      getCities,
      getStates,
    };

    // const user = await db.query.users.findFirst({
    //   where: (user, { eq }) => eq(user.id, ctx.userId),
    // });
    // return user;
  }),
  create: visitorProcedure
    .input(
      z.object({
        name: z.string(),
        // slug: z.string(),
        // categoryId: z.number(),
        // subcategoryId: z.array(z.number()),
        // fatherName: z.string(),
        // dob: z.string(),
        // gender: z.enum(Object.values(GENDER)),
        // maritalStatus: z.enum(Object.values(MARITAL_STATUS)),
        // languages: z.array(z.enum(Object.values(LANGUAGES))),
        // specialities: z.string(),
        // description: z.string(),
        // latitude: z.string(),
        // longitude: z.string(),
        // buildingName: z.string(),
        // streetName: z.string(),
        // area: z.string(),
        // landmark: z.string(),
        // pincode: z.number(),
        // city: z.number(),
        // state: z.number(),
        // schedules: z.array(
        //   z.object({
        //     fromHour: z.string(),
        //     fromPeriod: z.string(),
        //     toHour: z.string(),
        //     toPeriod: z.string(),
        //   }),
        // ),
        // photo: z.string(),
        // isFeature: z.boolean(),
        // email: z.string(),
        // mobileNumber: z.string(),
        // whatsappNumber: z.string(),
        // alternativeMobileNumber: z.string(),
        // highestQualification: z.enum(Object.values(QUALIFICATION)),
        // employmentStatus: z.string(),
        // workExperienceYear: z.number(),
        // workExperienceMonth: z.number(),
        // jobRole: z.string(),
        // previousJobRole: z.string(),
        // expertise: z.string(),
        skillset: z.string(),
        // abilities: z.string(),
        // jobType: z.array(z.enum(Object.values(JOB_TYPE))),
        // locationPreferred: z.string(),
        // certificates: z.string(),
        // workShift: z.array(z.enum(Object.values(WORK_SHIFT))),
        // expectedSalaryFrom: z.string(),
        // expectedSalaryTo: z.string(),
        // preferredWorkingHours: z.string(),
        // jobDuration: z.array(z.enum(Object.values(JOB_DURATION))),
        // relocate: z.enum(Object.values(RELOCATE)),
        availability: z.string(),
        // idProof: z.enum(Object.values(ID_PROOF)),
        // idProofPhoto: z.string(),
        coverLetter: z.string(),
        // resumePhoto: z.string(),
        // aboutYourself: z.string(),
        // referCode: z.string(),
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

      // const existingEmail = await db.query.hireListing.findFirst({
      //   where: (hireListing, { eq }) => eq(hireListing.email, input.email),
      // });
      // if (existingEmail) {
      //   throw new TRPCError({
      //     code: "CONFLICT",
      //     message: "Email address already exist",
      //   });
      // }

      // const isStateExists = await db.query.states.findFirst({
      //   where: (states, { eq }) => eq(states.id, input.state),
      // });
      // if (!isStateExists) {
      //   throw new TRPCError({
      //     code: "NOT_FOUND",
      //     message: "State not found",
      //   });
      // }

      // const isCityExists = await db.query.cities.findFirst({
      //   where: (cities, { eq }) => eq(cities.id, input.city),
      // });
      // if (!isCityExists) {
      //   throw new TRPCError({
      //     code: "NOT_FOUND",
      //     message: "City not found",
      //   });
      // }

      const [createHire] = await db
        .insert(schemas.hire.hireListing)
        .values({
          userId: ctx.userId,
          name: input.name,
          // photo: input.photo,
          // fatherName: input.fatherName,
          // dob: input.dob,
          // gender: input.gender,
          // maritalStatus: input.maritalStatus,
          // languages: input.languages,
          // slug: input.slug,
          // specialities: input.specialities,
          // description: input.description,
          // latitude: input.latitude,
          // longitude: input.longitude,
          // buildingName: input.buildingName,
          // streetName: input.streetName,
          // area: input.area,
          // landmark: input.landmark,
          // pincode: input.pincode,
          // state: input.state,
          // city: input.city,
          // schedules: JSON.stringify(input.schedules),
          // email: input.email,
          // mobileNumber: input.mobileNumber,
          // whatsappNo: input.whatsappNumber,
          // alternativeMobileNumber: input.alternativeMobileNumber,
          // highestQualification: input.highestQualification,
          // employmentStatus: input.employmentStatus,
          // workExperienceYear: input.workExperienceYear,
          // workExperienceMonth: input.workExperienceMonth,
          // jobRole: input.jobRole,
          // previousJobRole: input.previousJobRole,
          // expertise: input.expertise,
          skillset: input.skillset,
          // abilities: input.abilities,
          // jobType: input.jobType,
          // locationPreferred: input.locationPreferred,
          // certificates: input.certificates,
          // workShift: input.workShift,
          // expectedSalaryFrom: input.expectedSalaryFrom,
          // expectedSalaryTo: input.expectedSalaryTo,
          // preferredWorkingHours: input.preferredWorkingHours,
          // jobDuration: input.jobDuration,
          // relocate: input.relocate,
          availability: input.availability,
          // idProof: input.idProof,
          // idProofPhoto: input.idProofPhoto,
          coverLetter: input.coverLetter,
          // resumePhoto: input.resumePhoto,
          // aboutYourself: input.aboutYourself,
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

      // await db.insert(schemas.hire.hireCategories).values({
      //   hireId,
      //   categoryId: input.categoryId,
      // });
      // if (input.subcategoryId.length > 0) {
      //   await db.insert(schemas.hire.hireSubcategories).values(
      //     input.subcategoryId.map((subCategoryId) => ({
      //       hireId,
      //       subcategoryId: subCategoryId,
      //     })),
      //   );
      // }

      await db
        .update(schemas.auth.users)
        .set({
          role: "hire",
        })
        .where(eq(schemas.auth.users.id, ctx.userId));

      changeRoleInSession(ctx.sessionId, "hire");
      return {
        success: true,
        message: "Hire listing created successfully",
      };
    }),

  show: hireProcedure.query(async ({ ctx }) => {
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
});
