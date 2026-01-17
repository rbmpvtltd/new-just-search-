import { uploadOnCloudinary } from "@repo/cloudinary";
import {
  type MultiUploadOnCloudinaryFile,
  multiUploadOnCloudinary,
} from "@repo/cloudinary/dist/cloudinary";
import { db } from "@repo/db";
import {
  highestQualification,
  languages,
  occupation,
  salutation,
} from "@repo/db/dist/schema/not-related.schema";
import { sql as dbsql, eq, type InferInsertModel } from "drizzle-orm";
import {
  banners,
  categories,
  cities,
  documents,
  states,
  subcategories,
} from "../db/src/schema/not-related.schema";
// import { uploadOnCloudinary } from "../db/src/index";
import { sql } from "./mysqldb.seed";
// import { uploadOnCloudinary } from "@repo/cloudinary";
import { cloudinaryUploadOnline } from "./seeds";
import { slugify } from "./utils";

export const notRelated = async () => {
  await clearAllTablesNotRelated();
  await state();
  await citie();
  await bannerSeed();
  await seedCategories();
  await seedSubcategories();
  await seedOccupation();
  await seedDocuments();
  await seedHighestQualification();
  await seedSalutation();
  await seedLanguages();
};

export const clearAllTablesNotRelated = async () => {
  // logger.info("================== execution comes here ====================");
  await db.execute(`TRUNCATE TABLE cities RESTART IDENTITY CASCADE;`);
  await db.execute(`TRUNCATE TABLE states RESTART IDENTITY CASCADE;`);
  await db.execute(`TRUNCATE TABLE banners RESTART IDENTITY CASCADE;`);
  await db.execute(`TRUNCATE TABLE subcategories RESTART IDENTITY CASCADE;`);
  await db.execute(`TRUNCATE TABLE categories RESTART IDENTITY CASCADE;`);
  await db.execute(`TRUNCATE TABLE occupation RESTART IDENTITY CASCADE;`);
  await db.execute(`TRUNCATE TABLE documents RESTART IDENTITY CASCADE;`);
  await db.execute(
    `TRUNCATE TABLE highest_qualification RESTART IDENTITY CASCADE;`,
  );
  await db.execute(`TRUNCATE TABLE salutation RESTART IDENTITY CASCADE;`);
  await db.execute(`TRUNCATE TABLE languages RESTART IDENTITY CASCADE;`);
  console.log(" All tables cleared successfully!");
};

const state = async () => {
  const [rows]: any[] = await sql.execute("SELECT * FROM states");
  type DbState = InferInsertModel<typeof states>;
  const dbStateValue: DbState[] = [];

  for (const row of rows) {
    dbStateValue.push({
      id: row.id,
      name: row.name,
    });
  }

  await db.insert(states).values(dbStateValue);
  console.log("state migrated successfully!");
};

const citie = async () => {
  const [rows]: any[] = await sql.execute("SELECT * FROM cities");
  type DbCity = InferInsertModel<typeof cities>;
  const allStates = await db.select().from(states)
  const dbcityvalue: DbCity[] = [];
  for (const row of rows) {
    const state = allStates.find((state)=>state.id === row.state_id)
    // const [state] = await db
    //   .select()
    //   .from(states)
    //   .where(eq(states.id, row.state_id));

    if (!state) {
      console.log("State not found for city id", row.id);
      continue;
    }

    dbcityvalue.push({
      city: row.city,
      stateId: state.id,
    });
  }

  await db.insert(cities).values(dbcityvalue);

  console.log("Cities migrated successfully!");
};

// banner

// export const bannerSeed1 = async () => {
//   const [rows]: any[] = await sql.execute("SELECT * FROM `banners`");
//   type DbBanner = InferInsertModel<typeof banners>;
//   const dbBannerValue: DbBanner[] = [];
//   for (const row of rows) {
//     const liveProfileImageUrl = `https://www.justsearch.net.in/assets/images/banners/${row.photo}`;
//
//     let bannerPhotoPublicId: string = "";
//     if (row.photo) {
//       bannerPhotoPublicId = await uploadOnCloudinary(
//         liveProfileImageUrl,
//         "banner",
//         clouadinaryFake,
//       );
//     }
//
//     dbBannerValue.push({
//       // id: row.id,
//       route: row.route ?? null,
//       photo: bannerPhotoPublicId,
//       isActive: typeof row.status === "number" ? Boolean(row.status) : false,
//       type: row.type,
//       createdAt: row.created_at,
//       updatedAt: row.updated_at,
//     });
//   }
//   await db.insert(banners).values(dbBannerValue);
//   console.log(" Banners migrated successfully!");
// };
export const bannerSeed = async () => {
  const [rows]: any[] = await sql.execute("SELECT * FROM `banners`");
  type DbBanner = InferInsertModel<typeof banners>;
  const dbBannerValue: DbBanner[] = [];
  const clouadinaryData: MultiUploadOnCloudinaryFile[] = [];
  for (const row of rows) {
    const liveProfileImageUrl = `https://www.justsearch.net.in/assets/images/banners/${row.photo}`;

    if (row.photo) {
      clouadinaryData.push({
        filename: liveProfileImageUrl,
        id: row.id,
      });
    }
  }
  const bannerPhotoPublicIds = await multiUploadOnCloudinary(
    clouadinaryData,
    "banner",
    cloudinaryUploadOnline,
  );
  for (const row of rows) {
    const bannerPhotoPublicId = bannerPhotoPublicIds.find(
      (item) => item.id === row.id,
    )?.public_id;

    dbBannerValue.push({
      // id: row.id,
      route: row.route ?? null,
      photo: bannerPhotoPublicId ?? "",
      isActive: typeof row.status === "number" ? Boolean(row.status) : false,
      type: row.type,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    });
  }

  await db.insert(banners).values(dbBannerValue);
  console.log(" Banners seed successfully!");
};

// categories

export const seedCategories = async () => {
  const [rows]: any[] = await sql.execute("SELECT * FROM categories");
  type DbCategory = InferInsertModel<typeof categories>;
  const dbCategoryValue: DbCategory[] = [];
  const clouadinaryData: MultiUploadOnCloudinaryFile[] = [];
  for (const row of rows) {
    const liveProfileImageUrl = `https://justsearch.net.in/assets/images/categories/${row.photo}`;
    if (row.photo) {
      clouadinaryData.push({
        filename: liveProfileImageUrl,
        id: row.id,
      });
    }
  }

  const categoryPhotoPublicIds = await multiUploadOnCloudinary(
    clouadinaryData,
    "category",
    cloudinaryUploadOnline,
  );
  for (const row of rows) {
    const categoryPhotoPublicId = categoryPhotoPublicIds.find(
      (item) => item.id === row.id,
    )?.public_id;

    // const row = rows.filter((item) => item.id === 207)[0];
    const slug =
      row.slug !== "" || row.slug !== null ? slugify(row.title) : row.slug;
    dbCategoryValue.push({
      id: Number(row?.id) ?? 12,
      title: row.title ?? "",
      slug,
      photo: categoryPhotoPublicId ?? "",
      isPopular: Boolean(row.is_popular),
      status: Boolean(row.status),
      type: Number(row.type),
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    });
  }
  await db.insert(categories).values(dbCategoryValue);
  await db.execute(
    dbsql`SELECT setval(
          'categories_id_seq',
          COALESCE((SELECT MAX(id) + 1 FROM categories), 1),
          false
        );`,
  );
};

// sub_categories
export const seedSubcategories = async () => {
  const [rows]: any[] = await sql.execute("SELECT * FROM sub_categories");
  type DbSubCategory = InferInsertModel<typeof subcategories>;
  const dbSubCategoryValue: DbSubCategory[] = [];
  for (const row of rows) {
    if (!row.parent_id) {
      console.log(`Category parent_id not found for sub_category id ${row.id}`);
      continue;
    }

      dbSubCategoryValue.push({
        id: row.id,
        name: row.name,
        slug: row.slug,
        categoryId: row.parent_id,
        status: Boolean(row.status),
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      });
    }
    await db.insert(subcategories).values(dbSubCategoryValue);

    await db.execute(
      dbsql`SELECT setval(
        'subcategories_id_seq',
        COALESCE((SELECT MAX(id) + 1 FROM subcategories), 1),
        false
      );`,
    );

    console.log("Subcategories migrated successfully!");
  };

  export const seedOccupation = async () => {
    const rows = [
      "Employed",
      "Unemployed",
      "Farmer",
      "Media",
      "Business Man",
      "Sports",
      "Armed forces",
      "Government Service",
      "CA",
      "Doctor",
      "Lawyer",
      "Retired",
      "Student",
      "Clerk",
      "Others",
    ];
    await db.insert(occupation).values(
      rows.map((item) => ({
        name: item,
      })),
    );
    console.log("occupation migrated successfully!");
  };

  export const seedDocuments = async () => {
    const rows = [
      "Aadhar Card",
      "Pan Card",
      "Voter Id Card",
      "Driving License",
      "Others",
    ];
    await db.insert(documents).values(
      rows.map((item) => ({
        name: item,
      })),
    );
    console.log("documents migrated successfully!");
  };

  export const seedHighestQualification = async () => {
    const rows = [
      "B.E / B.Tech",
      "M.E / M.Tech",
      "M.S Engineering",
      "M.Eng (Hons)",
      "B.Eng (Hons)",
      "Engineering Diploma",
      "AE",
      "AET",
      "B.Plan",
      "B.Arch",
      "B.Tech L.L.B.",
      "B.L.L.B.",
      "CSE",
      "IT",
      "M.Plan",
      "M.Arch",
      "M.Tech L.L.B.",
      "M.L.L.B.",
      "B.A",
      "B.A (Hons)",
      "M.A",
      "M.A (Hons)",
      "M.Phil",
      "B.Sc",
      "B.Sc (Hons)",
      "M.Sc",
      "M.Sc (Hons)",
      "M.Lib.I.Sc",
      "M.Lib.Sc",
      "B.Lib.I.Sc",
      "B.Lib.Sc",
      "B.Com",
      "M.Com",
      "B.Com (Hons)",
      "M.Com (Hons)",
      "CA / CPA",
      "CFA",
      "CS",
      "BBM",
      "BCM",
      "BBA",
      "MBA",
      "MBA (Finance)",
      "Executive MBA",
      "PGDM",
      "PGDBM",
      "PGDCA",
      "CPT",
      "CIA",
      "ICWA",
      "MFC",
      "MFM",
      "BFIA",
      "BBS",
      "BIBF",
      "BIT",
      "BCA",
      "B.Sc IT",
      "B.Sc Computer Science",
      "PGDCA",
      "ADCA",
      "DCA",
      "DOEACC",
      "NIIT",
      "J.J.T.I",
      "D. Pharma",
      "B. Pharma",
      "M. Pharma",
      "LL.B",
      "LL.M",
      "Diploma",
      "Monograph",
      "Doctorate",
      "Associate",
      "High School",
      "Less than High School",
      "Diploma in Trade School",
      "Uneducated",
      "5th Pass",
      "8th Pass",
      "10th Pass",
      "10+2 Pass",
    ];

    await db.insert(highestQualification).values(
      rows.map((item) => ({
        name: item,
      })),
    );
    console.log("highestQualification migrated successfully!");
  };

  export const seedSalutation = async () => {
    const rows = ["Mr.", "Ms.", "Mrs."];
    await db.insert(salutation).values(
      rows.map((item) => ({
        name: item,
      })),
    );
    console.log("salutation migrated successfully!");
  };

  export const seedLanguages = async () => {
    const rows = [
      "Hindi",
      "English",
      "Punjabi",
      "Gujarati",
      "Bengali",
      "Malayalam",
      "Kannada",
      "Tamil",
      "Other",
    ];

    await db.insert(languages).values(
      rows.map((item) => ({
        name: item,
      })),
    );
    console.log("languages migrated successfully!");
  };
