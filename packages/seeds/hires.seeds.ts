import { eq } from "drizzle-orm";
import { db } from "@repo/db";
import { users } from "../db/src/schema/auth.schema";
import {
  genderEnum,
  hireCategories,
  hireListing,
  hireSubcategories,
  idProofEnum,
  jobDurationEnum,
  jobTypeEnum,
  maritalStatusEnum,
  qualificationEnum,
  recentViewHire,
  relocateEnum,
  workShiftEnum,
} from "../db/src/schema/hire.schema";
import { cities } from "../db/src/schema/address.schema";
import { categories } from "../db/src/schema/category.schema";
import { subcategories } from "../db/src/schema/subcategory.schema";
import { uploadOnCloudinary } from "@repo/db";
import { fakeSeed, fakeUserSeed } from "./fake.seed";
import { sql } from "./mysqldb.seed";

export const hireSeed = async () => {
  await cleardataofhire();
  await addHire();
  await seedRecentViewsHire();
  await seedHireSubcategories();
  await seedHireCategories();
};

const cleardataofhire = async () => {
  await db.execute(`TRUNCATE  TABLE hire_categories RESTART IDENTITY CASCADE;`);
  await db.execute(
    `TRUNCATE  TABLE recent_view_hire RESTART IDENTITY CASCADE;`,
  );
  await db.execute(
    `TRUNCATE  TABLE hire_subcategories RESTART IDENTITY CASCADE;`,
  );
  await db.execute(`TRUNCATE  TABLE hire_listing RESTART IDENTITY CASCADE;`);
};

export const addHire = async () => {
  const [rows]: any[] = await sql.execute("SELECT * FROM listings");
  const fakeUser = (await fakeUserSeed()) || (await fakeSeed()).user;
  for (const row of rows) {
    if (row.type === 1) continue;

    let [createUser] = await db
      .select()
      .from(users)
      .where(eq(users.id, row.user_id));

    if (!createUser) {
      console.log("User not found" + row.id);
      createUser = fakeUser;
    }

    let [city] = await db.select().from(cities).where(eq(cities.id, row.city));

    if (!city) {
      console.log("City not found", row.id);
      [city] = await db.select().from(cities).where(eq(cities.city, "Jodhpur"));
    }

    const liveHireImageUrl = `https://www.justsearch.net.in/assets/images/${row.photo}`;
    const uploaded =
      row.photo && (await uploadOnCloudinary(liveHireImageUrl, "Hire"));

    const profilePhotoUrl = uploaded?.secure_url;
    try {
      await db.insert(hireListing).values({
        id: row.id,
        userId: createUser!.id,
        city: city!.id,
        name: row.name,
        slug: row.slug,
        fatherName: row.father_name,
        dob: row.dob,
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
        languages: row.languages,
        specialities: row.specialities,
        description: row.description,
        latitude: row.latitude,
        longitude: row.longitude,
        buildingName: row.building_name,
        streetName: row.street_name,
        area: row.area,
        landmark: row.landmark,
        pincode: row.pincode,
        state: row.state,
        schedules: row.schedules,
        photo: profilePhotoUrl,
        isFeature: row.is_feature,
        status: row.status,
        website: row.website,
        email: row.email,
        mobileNumber: row.mobile_number,
        whatsappNo: row.whatsapp_no,
        alternativeMobileNumber: row.alternative_mobile_number,
        facebook: row.facebook,
        twitter: row.twitter,
        linkedin: row.linkedin,
        views: row.views,
        highestQualification:
          row.highest_qualification === 1
            ? "PostGraduation"
            : row.highest_qualification === 2
              ? "Graduation"
              : "Diploma",

        employmentStatus: row.employment_status,
        workExperienceYear: row.work_experience_year,
        workExperienceMonth: row.work_experience_month,
        jobRole: row.job_role,
        previousJobRole: row.previous_job_role,
        expertise: row.expertise,
        skillset: row.skillset,
        abilities: row.abilities,
        jobType:
          row.job_type === 1
            ? "FullTime"
            : row.job_type === 2
              ? "PartTime"
              : "Both",
        locationPreferred: row.location_preferred,
        certificates: row.certificates,
        workShift:
          row.work_shift === 1
            ? "Morning"
            : row.work_shift === 2
              ? "Evening"
              : "Night",
        expectedSalaryFrom: row.expected_salary_from,
        expectedSalaryTo: row.expected_salary_to,
        preferredWorkingHours: row.preferred_working_hours,

        jobDuration:
          row.job_duration === 1
            ? "Day"
            : row.job_duration === 2
              ? "Week"
              : row.job_duration === 3
                ? "Month"
                : row.job_duration === 4
                  ? "Year"
                  : "Few Years",
        relocate: row.relocate === 1 ? "Yes" : "No",
        availability: row.availability,

        idProof:
          row.id_proof === 1
            ? "AadharCard"
            : row.id_proof === 2
              ? "PanCard"
              : row.id_proof === 3
                ? "VoterCard"
                : row.id_proof === 4
                  ? "DrivingLicense"
                  : "Others",
        idProofPhoto: row.id_proof_photo,
        resume: row.resume,
        resumePhoto: row.resume_photo,
        aboutYourself: row.about_yourself,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      });
    } catch (error) {
      console.log("error", error);
    }
  }
  console.log("successsfully hire listings seed");
};

// seedRecentViewsHire
const seedRecentViewsHire = async () => {
  const [recentViews]: any[] = await sql.execute(
    "SELECT * FROM recent_views_listings",
  );

  for (const row of recentViews) {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, row.user_id));
    if (!user) {
      console.log("user not found");
      continue;
    }

    const [hire] = await db
      .select()
      .from(hireListing)
      .where(eq(hireListing.id, row.listing_id));

    if (!hire) {
      console.log("hire not found");
      continue;
    }

    await db.insert(recentViewHire).values({
      userId: user.id,
      hireId: hire.id,
      device: row.device,
      browser: row.browser,
      operatingSystem: row.operating_system,
    });
  }
  console.log("successfully ");
};

// seedHireSubcategories
export const seedHireSubcategories = async () => {
  const [rows]: any[] = await sql.execute("SELECT * FROM listing_subcategory");
  for (const row of rows) {
    const [hire] = await db
      .select()
      .from(hireListing)
      .where(eq(hireListing.id, row.listing_id));

    if (!hire) {
      console.log("hire not found");
      continue;
    }

    const [subcat] = await db
      .select()
      .from(subcategories)
      .where(eq(subcategories.id, row.subcategory_id));

    if (!subcat) {
      console.log("subcategory not found");
      continue;
    }

    await db.insert(hireSubcategories).values({
      hireId: hire.id,
      subcategoryId: subcat.id,
    });
  }
};

// hires_categories
export const seedHireCategories = async () => {
  const [rows]: any[] = await sql.execute("SELECT * FROM listing_category");

  for (const row of rows) {
    const [hire] = await db
      .select()
      .from(hireListing)
      .where(eq(hireListing.id, row.listing_id));

    if (!hire) {
      console.log("hire not found");
      continue;
    }

    const [category] = await db
      .select()
      .from(categories)
      .where(eq(categories.id, row.category_id));

    if (!category) {
      console.log("category not found");
      continue;
    }

    await db.insert(hireCategories).values({
      hireId: hire.id,
      categoryId: category.id,
    });
  }

  console.log("successfully seed of HireCategories");
};
