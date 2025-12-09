import { uploadOnCloudinary } from "@repo/cloudinary";
import { db } from "@repo/db";
import { sql as dbsql, eq } from "drizzle-orm";
import {
  banners,
  categories,
  cities,
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
};

export const clearAllTablesNotRelated = async () => {
  // logger.info("================== execution comes here ====================");
  await db.execute(`TRUNCATE TABLE cities RESTART IDENTITY CASCADE;`);
  await db.execute(`TRUNCATE TABLE states RESTART IDENTITY CASCADE;`);
  await db.execute(`TRUNCATE TABLE banners RESTART IDENTITY CASCADE;`);
  await db.execute(`TRUNCATE TABLE subcategories RESTART IDENTITY CASCADE;`);
  await db.execute(`TRUNCATE TABLE categories RESTART IDENTITY CASCADE;`);

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
