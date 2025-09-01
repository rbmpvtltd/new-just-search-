import { eq } from "drizzle-orm";
import { db } from "../index";
import { cities, states } from "../schema/address.schema";
import { banners } from "../schema/banner.schema";
import { categories } from "../schema/category.schema";
import { subcategories } from "../schema/sucategory.schema";
import { uploadOnCloudinary } from "../index";
import { sql } from "./mysqldb.seed";

export const notRelated = async () => {
  await clearAllTablesNotRelated();
  await state();
  await citie();
  await bannerSeed();
  await seedCategories();
  await seedSubcategories();
};

export const clearAllTablesNotRelated = async () => {
  await db.execute(`TRUNCATE  TABLE cities RESTART IDENTITY CASCADE;`);
  await db.execute(`TRUNCATE TABLE states RESTART IDENTITY CASCADE;`);
  await db.execute(`TRUNCATE TABLE banners RESTART IDENTITY CASCADE;`);
  await db.execute(`TRUNCATE TABLE subcategories RESTART IDENTITY CASCADE;`);
  await db.execute(`TRUNCATE TABLE categories RESTART IDENTITY CASCADE;`);

  console.log(" All tables cleared successfully!");
};

const state = async () => {
  const [rows]: any[] = await sql.execute("SELECT * FROM states");
  for (const row of rows) {
    await db.insert(states).values({
      id: row.id,
      name: row.name,
    });
  }
  console.log("state migrated successfully!");
};

const citie = async () => {
  const [rows]: any[] = await sql.execute("SELECT * FROM cities");
  for (const row of rows) {
    const [state] = await db
      .select()
      .from(states)
      .where(eq(states.id, row.state_id));

    if (!state) {
      console.log("State not found for city id", row.id);
      continue;
    }

    await db.insert(cities).values({
      city: row.city,
      stateId: state.id,
    });
  }

  console.log("Cities migrated successfully!");
};

// banner
export const bannerSeed = async () => {
  const [rows]: any[] = await sql.execute("SELECT * FROM `banners`");
  for (const row of rows) {
    const liveProfileImageUrl = `https://www.justsearch.net.in/assets/images/banners/${row.photo}`;
    const bannerPhotoUrl =
      row.photo &&
      (await uploadOnCloudinary(liveProfileImageUrl, "Banner"))?.secure_url;

    await db.insert(banners).values({
      mysqlId: row.id,
      route: row.route ?? null,
      photo: bannerPhotoUrl ?? null,
      isActive: typeof row.status === "number" ? Boolean(row.status) : false,
      type: row.type,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    });
  }

  console.log(" Banners migrated successfully!");
};

// categories
export const seedCategories = async () => {
  const [rows]: any[] = await sql.execute("SELECT * FROM categories");
  for (const row of rows) {
    const liveProfileImageUrl = `https://justsearch.net.in/assets/images/categories/${row.photo}`;
    const uploaded =
      row.photo &&
      (await uploadOnCloudinary(liveProfileImageUrl, "categories"));
    const categoriesPhotoUrl = uploaded?.secure_url;

    console.log(categoriesPhotoUrl);

    await db.insert(categories).values({
      id: row.id,
      title: row.title ?? null,
      slug: row.slug ?? null,
      photo: categoriesPhotoUrl,
      isPopular: Boolean(row.is_popular),
      status: Boolean(row.status),
      type: Number(row.type),
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    });
  }

  console.log("Categories migrated successfully!");
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

  console.log("Subcategories migrated successfully!");
};
