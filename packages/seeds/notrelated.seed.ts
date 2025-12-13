import { uploadOnCloudinary } from "@repo/cloudinary";
import { db } from "@repo/db";
import {
  highestQualification,
  languages,
  occupation,
  salutation,
} from "@repo/db/dist/schema/not-related.schema";
import { sql as dbsql, eq } from "drizzle-orm";
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
import { clouadinaryFake } from "./seeds";

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
  // console.log("rows", rows);

  for (const row of rows) {
    // console.log("row.id", row.id, "row.name", row.name);

    await db.insert(states).values({
      id: row.id,
      name: row.name,
    });
  }
  console.log("state migrated successfully!");
};

type DbCity = {
  city: string;
  stateId: number;
};
const citie = async () => {
  const [rows]: any[] = await sql.execute("SELECT * FROM cities");
  const dbcityvalue: DbCity[] = [];
  for (const row of rows) {
    const [state] = await db
      .select()
      .from(states)
      .where(eq(states.id, row.state_id));

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

type DbBanner = {
  mysqlId: number;
  route: string;
  photo: string;
  isActive: boolean;
  type: number;
  createdAt: Date;
  updatedAt: Date;
};
export const bannerSeed = async () => {
  const [rows]: any[] = await sql.execute("SELECT * FROM `banners`");
  const dbBannerValue: DbBanner[] = [];
  for (const row of rows) {
    const liveProfileImageUrl = `https://www.justsearch.net.in/assets/images/banners/${row.photo}`;

    let bannerPhotoPublicId: string | null = null;
    if (row.photo) {
      bannerPhotoPublicId = await uploadOnCloudinary(
        liveProfileImageUrl,
        "Banner",
        clouadinaryFake,
      );
    }

    dbBannerValue.push({
      mysqlId: row.id,
      route: row.route ?? null,
      photo: bannerPhotoPublicId ?? "",
      isActive: typeof row.status === "number" ? Boolean(row.status) : false,
      type: row.type,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    });
  }
  await db.insert(banners).values(dbBannerValue);
  console.log(" Banners migrated successfully!");
};

// categories
export const seedCategories = async () => {
  const [rows]: any[] = await sql.execute("SELECT * FROM categories");
  for (const row of rows) {
    const liveProfileImageUrl = `https://justsearch.net.in/assets/images/categories/${row.photo}`;
    let categoryPhotoPublicId: string | null = null;

    if (row.photo) {
      const result = await uploadOnCloudinary(
        liveProfileImageUrl,
        "category",
        clouadinaryFake,
      );

      console.log("category photo public id", result);
      categoryPhotoPublicId = result ?? null;

      await db.insert(categories).values({
        id: row.id,
        title: row.title ?? "",
        slug: row.slug ?? "",
        photo: categoryPhotoPublicId ?? "",
        isPopular: Boolean(row.id < 13),
        status: Boolean(row.status),
        type: Number(row.type),
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      });
    }
  }
};

// sub_categories
export const seedSubcategories = async () => {
  const [rows]: any[] = await sql.execute("SELECT * FROM sub_categories");
  for (const row of rows) {
    const [category] = await db
      .select()
      .from(categories)
      .where(eq(categories.id, row.parent_id));

    if (!category) {
      console.log(`Category not found for sub_category id ${row.id}`);
      continue;
    }

    const skipSlug = [""];
    if (skipSlug.includes(row.slug)) {
      row.slug = row.slug + row.id;
    }

    await db.insert(subcategories).values({
      id: row.id,
      name: row.name,
      slug: row.slug,
      categoryId: category.id,
      status: Boolean(row.status),
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    });
  }

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
