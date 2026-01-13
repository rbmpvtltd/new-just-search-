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
import { clouadinaryFake } from "./seeds";
import { insertUser, safeArray } from "./utils";
import { multiUploadOnCloudinary, type MultiUploadOnCloudinaryFile } from "@repo/cloudinary/dist/cloudinary";

export const hireSeed = async () => {
  await cleardataofhire();
  await addHire();
  // await seedHireCategories();
  // await seedHireSubcategories();
};

// const updateHirePhoto = async ()=>{

// }

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
  const clouadinaryHireData: MultiUploadOnCloudinaryFile[] = [];

  const allPromisesUser: Promise<number>[] = [];
  for(const row of rows){
      allPromisesUser.push(insertUser(row.user_id,"hire"))
  }
  
  const allSettledHireUsers = await Promise.allSettled(allPromisesUser);
  const allHireUsers = [];
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
  
  const categoryPhotoPublicIds = await multiUploadOnCloudinary(
    clouadinaryHireData,
    "hire",
    clouadinaryFake,
  );
  // const fakeUser = await getFakeHireUser();

  // if (!fakeUser) {
  //   throw new Error("Failed to generate a fake user!");
  // }
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
    const [jodhpur] = await db
      .select()
      .from(cities)
      .where(eq(cities.city, "Jodhpur"));
    if (!jodhpur) {
      throw new Error("Jodhpur city not found");
    }

  for (const row of rows) {
    // const row = rows[0];

    // return;
    // let [createUser] = await db
    //   .select()
    //   .from(users)
    //   .where(eq(users.id, Number(row.user_id)));

    // if (!createUser) {
    //   const [user]: any[] = await sql.execute(
    //     `SELECT * FROM users WHERE id = ${row.user_id}`,
    //   );

    //   if (user[0]) {
    //     const mySqlUser = user[0];
    //     // return
    //     try {
    //       [createUser] = await db
    //         .insert(users)
    //         .values({
    //           id: mySqlUser.id,
    //           displayName: row.name ?? mySqlUser.name,
    //           email: mySqlUser.email,
    //           googleId: mySqlUser.google_id,
    //           password: mySqlUser.password,
    //           role: UserRole.hire,
    //           phoneNumber: mySqlUser.phone,
    //         })
    //         .returning();
    //       console.log(createUser);
    //       // TODO: user profile is not added yet
    //     } catch (e) {
    //       if (e instanceof Error) {
    //         console.error("error is ", e.message);
    //       }
    //     }
    //   } else {
    //     createUser = fakeUser;
    //   }
    // }

    // // return
    // if (!createUser) {
    //   console.log("User not found" + row.id);
    // }
     const hireListingPhoto = categoryPhotoPublicIds.find(
      (item) => item.id === row.id,
    )?.public_id;

    const userId = await insertUser(row.user_id, "hire");
    const foundCity = allCities.find((c) => c.id === row.city);
    const city = foundCity ? foundCity : jodhpur;

    const invalidPhotos = [
      "20469712961736937230.jpg",
      "9233936721737361584.jpeg",
      "8263138481737439311.jpeg",
      "2542177821738044989.jpeg",
      "11006388771738843807.jpeg",
      "6708903161739015419.PNG",
      "460541731739343371.jpg",
      "15017575881740386618.jpg",
      "9027662451740469698.jpg",
      "3709273371738146929.jpeg",
      "6924536251755946456.jpeg",
      "19940945571746603611.jpg",
    ];


    // console.log("=====");
    // console.log("createUser-------------------", createUser);
    // return;

    try {
      // if (!createUser) {
      //   console.log("User not found" + row.id);
      // }
      const qualificationKey =
        typeof row.highest_qualification === "string"
          ? row.highest_qualification.toLowerCase().trim()
          : "";

      const saleman = await db
        .select()
        .from(salesmen)
        .where(
          eq(
            salesmen.referCode,
            row.refer_code ? row.refer_code.toUpperCase() : null,
          ),
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
      type HireData = InferInsertModel<typeof hireListing>;
      const jobType = safeArray(row.job_type).map((jobType: string) => {
        if (jobType.toLocaleLowerCase() === "full time")
          return JobType.FullTime;
        return jobType;
      });
      const workShift = safeArray(row.work_shift).map((workType: string) => {
        return workType.split("_")[0];
      });
      const hireData: HireData = {
        id: row.id,
        salesmanId: saleman[0]?.id ?? 1,
        fromHour: "",
        toHour: "",
        userId,
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
      };
      // const hireData: HireData = {
      //   id: 419,
      //   salesmanId: 1,
      //   fromHour: "",
      //   toHour: "",
      //   userId: 588,
      //   city: 449,
      //   name: "Ruchika Mewara",
      //   slug: "ruchika-mewara",
      //   fatherName: "Amarjeet Singh",
      //   dob: "Thu Jun 08 2000 00:00:00 GMT+0530 (India Standard Time)",
      //   gender: "Female",
      //   maritalStatus: "Others",
      //   languages: [2, 1],
      //   specialities: "alsdkfj",
      //   description: "aslkdfjalsdkj",
      //   latitude: 73.02745391487893,
      //   longitude: 26.214785486607322,
      //   buildingName: "kalsjdflsak",
      //   streetName: "alksdjf",
      //   address: "sector 2",
      //   landmark: "asldkfj",
      //   pincode: "342005",
      //   state: 19,
      //   photo: "banner/cbycmehjeetyxbuxc6ie",
      //   isFeature: false,
      //   status: "Approved",
      //   website: "alsdfkjalskdj",
      //   email: "sc@gmail.com",
      //   mobileNumber: "8695310446",
      //   whatsappNo: "95225654654",
      //   alternativeMobileNumber: "8695310446",
      //   facebook: "alksdjf",
      //   twitter: "alskdjf",
      //   linkedin: null,
      //   highestQualification: 12,
      //   employmentStatus: "no",
      //   workExperienceYear: 3,
      //   workExperienceMonth: 6,
      //   jobRole: "Pre primary",
      //   previousJobRole: null,
      //   expertise: "All Subjects",
      //   skillset: "js is",
      //   abilities: "afe",
      //   jobType: ["FullTime"],
      //   locationPreferred: "asdf",
      //   certificates: "safd",
      //   workShift: ["Morning"],
      //   expectedSalaryFrom: "asdf",
      //   expectedSalaryTo: "asdfk",
      //   jobDuration: ["Day"],
      //   relocate: "No",
      //   availability: "Now",
      //   idProof: 1,
      //   idProofPhoto: "banner/cbycmehjeetyxbuxc6ie",
      //   coverLetter: "asdklfj",
      //   resumePhoto: "banner/cbycmehjeetyxbuxc6ie",
      //   aboutYourself: "asdlfkjads",
      // };
      console.log("hireData", hireData);
      await db.insert(hireListing).values(hireData);

      // console.log("hire", hire);
    } catch (error) {
      throw new Error(`Error creating hire: ${error}`);
    }

    console.log("successsfully hire listings seed");
  }
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

  for (const row of rows) {
    const [hire] = await db
      .select()
      .from(hireListing)
      .where(eq(hireListing.id, row.listing_id));

    if (!hire) {
      console.log("hire not found", hire);
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
      continue;
    }

    const [category] = await db
      .select()
      .from(categories)
      .where(eq(categories.id, row.category_id));

    if (!category) {
      continue;
    }

    await db.insert(hireCategories).values({
      hireId: hire.id,
      categoryId: category.id,
    });
  }

  console.log("successfully seed of HireCategories");
};
