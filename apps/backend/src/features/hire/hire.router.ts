import { db, schemas } from "@repo/db";
import { logger } from "@repo/helper";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import z from "zod";
import { router, visitorProcedure } from "@/utils/trpc";
import { changeRoleInSession } from "../auth/lib/session";

// export const JobType = {
//   FullTime: "FullTime",
//   PartTime: "PartTime",
//   Both: "Both",
// } as const;
export const hirerouter = router({
  add: visitorProcedure.query(async ({ ctx }) => {
    const getHireCategories = await db.query.categories.findMany({
      where: (categories, { eq }) => eq(categories.type, 2),
    });
    const getCities = await db.query.cities.findMany();
    const getStates = await db.query.states.findMany();

    return {
      getHireCategories,
      getCities,
      getStates,
    };

    // const user = await db.query.users.findFirst({
    //   where: (user, { eq }) => eq(user.id, ctx.userId),
    // });
    // return user;
  }),

  getSubCategories: visitorProcedure
    .input(z.object({ categoryId: z.number() }))
    .query(async ({ ctx, input }) => {
      const hireSubCategories = await db.query.subcategories.findMany({
        where: (subcategories, { eq }) =>
          eq(subcategories.categoryId, input.categoryId),
      });
      return "hiii";
      // console.log("hireSubCategories", hireSubCategories);
      //
      // return hireSubCategories;
    }),

  getCities: visitorProcedure
    .input(z.object({ state: z.number() }))
    .query(async ({ ctx, input }) => {
      const cities = await db.query.cities.findMany({
        where: (cities, { eq }) => eq(cities.stateId, input.state),
      });
      return cities;
    }),
  create: visitorProcedure
    .input(schemas.hire.hireInsertSchema)
    .mutation(async ({ ctx, input }) => {
      // return input;
      // const user = await db.query.users.findFirst({
      //   where: (users, { eq }) => eq(users.id, ctx.userId),
      // });
      // if (!user) {
      //   throw new TRPCError({
      //     code: "UNAUTHORIZED",
      //     message: "User not found",
      //   });
      // }
      //
      // const existingBusiness = await db.query.businessListings.findFirst({
      //   where: (businessListings, { eq }) =>
      //     eq(businessListings.userId, ctx.userId),
      // });
      // if (existingBusiness) {
      //   throw new TRPCError({
      //     code: "CONFLICT",
      //     message: "User already have business listing",
      //   });
      // }
      //
      // const existingHire = await db.query.hireListing.findFirst({
      //   where: (hireListing, { eq }) => eq(hireListing.userId, ctx.userId),
      // });
      // if (existingHire) {
      //   throw new TRPCError({
      //     code: "CONFLICT",
      //     message: "User already have hire listing",
      //   });
      // }
      //
      // // const existingEmail = await db.query.hireListing.findFirst({
      // //   where: (hireListing, { eq }) => eq(hireListing.email, input.email),
      // // });
      // // if (existingEmail) {
      // //   throw new TRPCError({
      // //     code: "CONFLICT",
      // //     message: "Email address already exist",
      // //   });
      // // }
      //
      // const isStateExists = await db.query.states.findFirst({
      //   where: (states, { eq }) => eq(states.id, input.state),
      // });
      // if (!isStateExists) {
      //   throw new TRPCError({
      //     code: "NOT_FOUND",
      //     message: "State not found",
      //   });
      // }
      //
      // const isCityExists = await db.query.cities.findFirst({
      //   where: (cities, { eq }) => eq(cities.id, input.city),
      // });
      // if (!isCityExists) {
      //   throw new TRPCError({
      //     code: "NOT_FOUND",
      //     message: "City not found",
      //   });
      // }

      // const [createHire] = await db
      //   .insert(schemas.hire.hireListing)
      //   .values({
      //     userId: ctx.userId,
      //     name: input.name,
      //     photo: input.photo,
      //     fatherName: input.fatherName,
      //     dob: input.dob,
      //     // gender: input.gender,
      //     // maritalStatus: input.maritalStatus,
      //     languages: Array.isArray(input.languages)
      //       ? input.languages
      //       : JSON.parse(input.languages || "[]"),
      //     // slug: input.name,
      //     // specialities: input.specialities,
      //     // description: input.description,
      //     // latitude: input.latitude,
      //     // longitude: input.longitude,
      //     // pincode: 123456,
      //     // state: input.state,
      //     // city: input.city,
      //     // email: input.email,
      //     // mobileNumber: input.mobileNumber,
      //     // alternativeMobileNumber: input.alternativeMobileNumber,
      //     // highestQualification: input.highestQualification,
      //     // workExperienceYear: input.workExperienceYear,
      //     // workExperienceMonth: input.workExperienceMonth,
      //     // jobRole: input.jobRole,
      //     // previousJobRole: input.previousJobRole,
      //     // skillset: input.skillset,
      //     // jobType: Array.isArray(input.jobType)
      //     //   ? input.jobType
      //     //   : JSON.parse(input.jobType || "[]"),
      //     // workShift: Array.isArray(input.workShift)
      //     //   ? input.workShift
      //     //   : JSON.parse(input.workShift || "[]"),
      //     // jobDuration: Array.isArray(input.jobDuration)
      //     //   ? input.jobDuration
      //     //   : JSON.parse(input.jobDuration || "[]"),
      //     // locationPreferred: input.locationPreferred,
      //     // certificates: input.certificates,
      //     // expectedSalaryFrom: input.expectedSalaryFrom,
      //     // expectedSalaryTo: input.expectedSalaryTo,
      //     // relocate: input.relocate,
      //     // availability: input.availability,
      //     // idProof: input.idProof,
      //     // idProofPhoto: input.idProofPhoto,
      //     // coverLetter: input.coverLetter,
      //     // resumePhoto: input.resumePdf,
      //     // aboutYourself: input.aboutYourself,
      //     // abilities: "",
      //     // area: "",
      //     // buildingName: "",
      //     // streetName: "",
      //     // landmark: "",
      //     // whatsappNo: "",
      //     // schedules: "",
      //     // employmentStatus: "",
      //     // expertise: "",
      //     // facebook: "",
      //     // twitter: "",
      //     // linkedin: "",
      //     // views: 0,
      //     // isFeature: false,
      //     // preferredWorkingHours: "",
      //     // resumePhoto: input.resumePdf,
      //     // status: true,
      //     // website: "",
      //     // createdAt: new Date(),
      //     // updatedAt: new Date(),
      //     // referCode: input.referCode,
      //   })
      //   .returning({
      //     id: schemas.hire.hireListing.id,
      //   });
      //
      // if (!createHire) {
      //   throw new TRPCError({
      //     code: "INTERNAL_SERVER_ERROR",
      //     message: "Something went wrong",
      //   });
      // }
      //
      // const hireId = createHire.id;

      // await db.insert(schemas.hire.hireCategories).values({
      //   hireId,
      //   categoryId: input.categoryId,
      // });
      // await db.insert(schemas.hire.hireSubcategories).values(
      //   input.subcategoryId.map((subCategoryId) => ({
      //     subcategoryId: Number(subCategoryId),
      //     hireId,
      //   })),
      // );
      //
      // await db
      //   .update(schemas.auth.users)
      //   .set({
      //     role: "hire",
      //   })
      //   .where(eq(schemas.auth.users.id, ctx.userId));
      //
      // changeRoleInSession(ctx.sessionId, "hire");
      return {
        success: true,
        message: "Hire listing created successfully",
      };
    }),

  // show: hireProcedure.query(async ({ ctx }) => {
  //   const hire = await db.query.hireListing.findFirst({
  //     where: (hireListing, { eq }) => eq(hireListing.userId, ctx.userId),
  //   });

  //   if (!hire) {
  //     throw new TRPCError({
  //       code: "NOT_FOUND",
  //       message: "Hire listing not found",
  //     });
  //   }
  //   return hire;
  // }),
});
