import { uploadOnCloudinary } from "@repo/cloudinary";
import { db } from "@repo/db";
import { JobType } from "@repo/db/dist/enum/allEnum.enum";
import { languages } from "@repo/db/dist/schema/not-related.schema";
import { salesmen } from "@repo/db/dist/schema/user.schema";
import { eq, type InferInsertModel } from "drizzle-orm";
import {
  hireCategories,
  hireListing,
  hireSubcategories,
} from "../db/src/schema/hire.schema";
import {
  categories,
  cities,
  subcategories,
} from "../db/src/schema/not-related.schema";
import { getRightLocation } from "./business.seed";
import { sql } from "./mysqldb.seed";
import { cloudinaryUploadOnline } from "./seeds";
import { insertUser, safeArray } from "./utils";
import {
  multiUploadOnCloudinary,
  type MultiUploadOnCloudinaryFile,
} from "@repo/cloudinary/dist/cloudinary";

export const hireSeed = async () => {
  await cleardataofhire();
  await addHire();
  await seedHireCategories();
  await seedHireSubcategories();
};

const cleardataofhire = async () => {
  await db.execute(`TRUNCATE  TABLE hire_categories RESTART IDENTITY CASCADE;`);
  await db.execute(
    `TRUNCATE  TABLE hire_subcategories RESTART IDENTITY CASCADE;`,
  );
  await db.execute(`TRUNCATE  TABLE hire_listing RESTART IDENTITY CASCADE;`);
  console.log("all tables clear successfully");
};

const addHire = async () => {
  const [rows]: any[] = await sql.execute(
    "SELECT *, REPLACE(longitude , ',', '') as clear_longitude, REPLACE(latitude , ',', '') as clear_latitude FROM listings WHERE type = 2",
  );
  type HireData = InferInsertModel<typeof hireListing>;
  const dbHireData: HireData[] = [];

  const clouadinaryHireData: MultiUploadOnCloudinaryFile[] = [];
  const allPromisesUser: Promise<number>[] = [];
  for (const row of rows) {
    allPromisesUser.push(insertUser(row.user_id, "hire"));
  }
  const allSettledHireUsers = await Promise.allSettled(allPromisesUser);
  const allHireUsers: number[] = [];
  allSettledHireUsers.forEach((o, i) => {
    if (o.status === "fulfilled") {
      allHireUsers.push(o.value);
    } else {
      console.error(i, "reason", o.reason);
    }
  });
  for (const row of rows) {
    const liveHireImageUrl = `https://www.justsearch.net.in/assets/images/${row.photo}`;
    if (row.photo) {
      clouadinaryHireData.push({
        filename: liveHireImageUrl,
        id: row.id,
      });
    }
  }

  const hirePhotosPublicIds = await multiUploadOnCloudinary(
    clouadinaryHireData,
    "hire",
    cloudinaryUploadOnline,
  );

  const educationMap: Record<string, number | null> = {
    "2": null,
    "b.e / b.tech": 1,
    "b.tech ll.b.": 11,
    "b.a ll.b": 69,

    bsw: null,

    "b.a": 19,
    "m.a": 21,
    master: 21,

    "b.com": 32,
    "m.com": 33,

    bca: 57,
    "ca / cpa": 36,

    "b.lib.sc.": 31,

    "5th pass": 79,
    "8th pass": 80,
    "10th pass": 81,
    "10+2 pass": 82,

    uneducated: 78,
  };

  const allCities = await db.select().from(cities);
  const allSalesmen = await db.select().from(salesmen);
  const [jodhpur] = await db
    .select()
    .from(cities)
    .where(eq(cities.city, "Jodhpur"));
  if (!jodhpur) {
    throw new Error("Jodhpur city not found");
  }

  for (const row of rows) {
    const hireListingPhoto = hirePhotosPublicIds.find(
      (item) => item.id === row.id,
    )?.public_id;

    const userId = allHireUsers?.find((item) => item === row.user_id);
    const foundCity = allCities.find((c) => c.id === row.city);
    const city = foundCity ? foundCity : jodhpur;

    try {
      const qualificationKey =
        typeof row.highest_qualification === "string"
          ? row.highest_qualification.toLowerCase().trim()
          : "";

      const saleman = allSalesmen.find((salesman) =>
        salesman.referCode === row.refer_code
          ? row.refer_code.toUpperCase()
          : null,
      );

      const highestQualification = educationMap[qualificationKey] ?? null;
      const { latitude, longitude } = getRightLocation(row);

      const languagesIds = await Promise.all(
        safeArray(row.languages).map(async (language: string) => {
          const [languageDB] = await db
            .select()
            .from(languages)
            .where(eq(languages.name, language));
          return languageDB?.id;
        }),
      );
      const jobType = safeArray(row.job_type).map((jobType: string) => {
        if (jobType.toLocaleLowerCase() === "full time")
          return JobType.FullTime;
        return jobType;
      });
      const workShift = safeArray(row.work_shift).map((workType: string) => {
        return workType.split("_")[0];
      });
      dbHireData.push({
        id: row.id,
        salesmanId: saleman?.id ?? 1,
        fromHour: "",
        toHour: "",
        userId: userId ?? 0,
        city: city?.id ?? 449,
        name: row.name,
        slug: row.slug,
        fatherName: row.father_name,
        dob: new Date(row.dob).toISOString().split("T")[0],
        gender:
          row.gender === 1 ? "Male" : row.gender === 2 ? "Female" : "Others",
        maritalStatus:
          row.marital_status === 1
            ? "Married"
            : row.marital_status === 2
              ? "Unmarried"
              : row.marital_status === 3
                ? "Widowed"
                : row.marital_status === 4
                  ? "Divorced"
                  : "Others",
        languages: languagesIds,
        specialities: row.specialities,
        description: row.description,
        latitude,
        longitude,
        buildingName: row.building_name,
        streetName: row.street_name,
        address: row.real_address ?? row.area,
        landmark: row.landmark,
        pincode: String(row.pincode),
        state: row.state,
        // city: city!.id,

        photo: hireListingPhoto ?? "",
        isFeature: row.is_feature === 1,
        status: "Approved",
        website: row.website,
        email: row.email,
        mobileNumber: row.mobile_number,
        whatsappNo: row.whatsapp_no,
        alternativeMobileNumber: row.alternative_mobile_number,
        facebook: row.facebook,
        twitter: row.twitter,
        linkedin: row.linkedin,
        highestQualification: highestQualification ?? 12,
        employmentStatus: row.employment_status,
        workExperienceYear: row.work_experience_year,
        workExperienceMonth: row.work_experience_month,
        jobRole: row.job_role,
        previousJobRole: row.previous_job_role,
        expertise: row.expertise,
        skillset: row.skillset,
        abilities: row.abilities,
        jobType,
        locationPreferred: row.location_preferred,
        certificates: row.certificates,
        workShift,
        expectedSalaryFrom: row.expected_salary_from,
        expectedSalaryTo: row.expected_salary_to,
        jobDuration: safeArray(row.job_duration),
        relocate: row.relocate === 1 ? "Yes" : "No",
        availability: row.availability,
        idProof: row.id_proof,
        idProofPhoto: "",
        coverLetter: row.cover_letter,
        resumePhoto: "",
        aboutYourself: row.about_yourself,
      });
    } catch (error) {
      throw new Error(`Error creating hire: ${error}`);
    }
  }
  if (Array.isArray(dbHireData) && dbHireData.length > 0) {
    await db.insert(hireListing).values(dbHireData);
    console.log("========== Successfully Insert dbHireData Data ==========");
  } else {
    console.log(
      "====================== dbHireData ======================",
      dbHireData,
    );
    console.log("=== dbHireData Doesn't have Data Or May Not Be Array ===");
  }

  console.log("successsfully hire listings seed");
};

// seedRecentViewsHire
// const seedRecentViewsHire = async () => {
//   const [recentViews]: any[] = await sql.execute(
//     "SELECT * FROM recent_views_listings",
//   );
//
//   for (const row of recentViews) {
//     const [user] = await db
//       .select()
//       .from(users)
//       .where(eq(users.id, row.user_id));
//     if (!user) {
//       console.log("user not found");
//       continue;
//     }
//
//     const [hire] = await db
//       .select()
//       .from(hireListing)
//       .where(eq(hireListing.id, row.listing_id));
//
//     if (!hire) {
//       console.log("hire not found");
//       continue;
//     }
//
//     await db.insert(recentViewHire).values({
//       userId: user.id,
//       hireId: hire.id,
//       device: row.device,
//       browser: row.browser,
//       operatingSystem: row.operating_system,
//     });
//   }
//   console.log("successfully ");
// };

// seedHireSubcategories
export const seedHireSubcategories = async () => {
  const [rows]: any[] = await sql.execute("SELECT * FROM listing_subcategory");
  console.log("rows", rows);
  type DbHireSubcategory = InferInsertModel<typeof hireSubcategories>;
  const dbHireSubcategoryValue: DbHireSubcategory[] = [];
  const allHires = await db.select().from(hireListing);
  const allSubcategories = await db.select().from(subcategories);

  for (const row of rows) {
    const hire = allHires.find((hire) => hire.id === row.listing_id);
    const subcat = allSubcategories.find(
      (subcategory) => subcategory.id === row.subcategory_id,
    );
    if (!hire) {
      console.log("hire not found", hire);
      continue;
    }

    if (!subcat) {
      console.log("subcategory not found");
      continue;
    }

    dbHireSubcategoryValue.push({
      hireId: hire.id,
      subcategoryId: subcat.id,
    });
  }
  if (
    Array.isArray(dbHireSubcategoryValue) &&
    dbHireSubcategoryValue.length > 0
  ) {
    await db.insert(hireSubcategories).values(dbHireSubcategoryValue);
    console.log(
      "========== Successfully Insert dbHireSubcategoryValue Data ==========",
    );
  } else {
    console.log(
      "====================== dbHireSubcategoryValue ======================",
      dbHireSubcategoryValue,
    );
    console.log(
      "=== dbHireSubcategoryValue Doesn't have Data Or May Not Be Array ===",
    );
  }
  console.log("successfully seed of dbHireSubcategoryValue");
};

// hires_categories
export const seedHireCategories = async () => {
  const [rows]: any[] = await sql.execute("SELECT * FROM listing_category");
  type DbHireCategory = InferInsertModel<typeof hireCategories>;
  const dbHireCategoryValue: DbHireCategory[] = [];
  const allHires = await db.select().from(hireListing);
  const allCategories = await db.select().from(categories);

  for (const row of rows) {
    const hire = allHires.find((hire) => hire.id === row.listing_id);
    const category = allCategories.find(
      (category) => category.id === row.category_id,
    );

    if (!hire) {
      continue;
    }
    if (!category) {
      continue;
    }

    dbHireCategoryValue.push({
      hireId: hire.id,
      categoryId: category.id,
    });
  }
  if (Array.isArray(dbHireCategoryValue) && dbHireCategoryValue.length > 0) {
    await db.insert(hireCategories).values(dbHireCategoryValue);
    console.log(
      "========== Successfully Insert dbHireCategoryValue Data ==========",
    );
  } else {
    console.log(
      "====================== dbHireCategoryValue ======================",
      dbHireCategoryValue,
    );
    console.log(
      "=== dbHireCategoryValue Doesn't have Data Or May Not Be Array ===",
    );
  }

  console.log("successfully seed of HireCategories");
};
