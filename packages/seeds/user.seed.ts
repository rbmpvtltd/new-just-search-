import dotenv from "dotenv";
import { eq } from "drizzle-orm";
import { db } from "../drizzle";
import { users ,UserRole} from "../db/src/schema/auth.schema.js";
import {
  feedbacks,
  franchises,
  profiles,
  request_accounts,
  salesmen,
} from "../db/src/schema/user.schema.js";
import { uploadOnCloudinary } from "../drizzle";
import { sql } from "./mysqldb.seed.js";

dotenv.config();
export const userSeed = async () => {
  await clearAllTablesUser();
  await seedUsers();
  await seedfranchises();
  await seedOfSalesman();
};

export const clearAllTablesUser = async () => {
  await db.execute(`TRUNCATE TABLE franchises RESTART IDENTITY CASCADE;`);
  await db.execute(`TRUNCATE TABLE profiles RESTART IDENTITY CASCADE;`);
  await db.execute(`TRUNCATE TABLE users RESTART IDENTITY CASCADE;`);

  console.log(" All tables cleared successfully!");
};

export const seedUsers = async () => {
  const [rows]: any[] = await sql.execute("SELECT * FROM users");

  for (const row of rows) {
    if (row.status !== 1) {
      continue;
    }

    const user = {
      id: row.id,
      username: row.username ?? "null",
      phoneNumber: row.phone ?? "null",
      email: row.email ?? `example${row.id}@mail.com`,
      password: row.password ?? "null",
      role: UserRole.visiter,
      googleId: row.google_id,
      refreshToken: null,
      profileId: null,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };

    const [insertedUser] = await db.insert(users).values(user).returning();

    const liveProfileImageUrl = `https://www.justsearch.net.in/assets/images/${row.photo}`;
    const uploaded = row.photo
      ? await uploadOnCloudinary(liveProfileImageUrl, "Profile")
      : null;
    const profilePhotoUrl = uploaded?.secure_url;

    // 5️⃣ Insert profile
    const profileData = {
      userId: insertedUser!.id,
      firstName: row.first_name ?? "null",
      lastName: row.last_name ?? "null",
      city: row.city ?? "null",
      photo: profilePhotoUrl,
      address: row.address ?? "null",
      dob: row.dob ?? null,
      maritalStatus: row.marital_status ?? null,
      occupation: row.occupation ?? null,
      state: row.state ?? null,
      website: row.website ?? null,
      area: row.area ?? null,
      zipcode: row.zip ?? "000000",
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };

    await db.insert(profiles).values(profileData);
  }

  console.log("users and Profiles seeding complete");
};

const seedfranchises = async () => {
  const [rows]: any[] = await sql.execute("SELECT * FROM franchises");

  for (const row of rows) {
    const str = row.refer_code;
    const refer_prifixed = str.slice(0, -4); // "RBMHORJ00"
    const refer_suffix = str.slice(-4); // "0000"

    const [user] = await db
      .insert(users)
      .values({
        username: row.name,
        role: UserRole.franchises,
        email: row.email,
        phoneNumber: row.phone,
        password: row.password,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      })
      .returning();

    await db.insert(franchises).values({
      id: row.id,
      userId: user!.id,
      referPrifixed: refer_prifixed,
      status: Boolean(row.status),
      employeeLimit: row.employee_limit,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    });
  }
  console.log("successfully seed of franchises");
};

export const seedOfSalesman = async () => {
  const [sales]: any[] = await sql.execute("SELECT * FROM staff");
  for (const row of sales) {
    const [Franchises] = await db
      .select()
      .from(franchises)
      .where(eq(franchises.id, row.franchise_id));

    if (!Franchises) {
      console.log("franchises id not found", row.id);
      continue;
    }

    const [user] = await db
      .insert(users)
      .values({
        username: row.name,
        role: UserRole.salesman,
        email: row.email,
        phoneNumber: row.mobile_no,
        password: row.password,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      })
      .returning();

    const [franchises1]: any[] = await sql.execute("SELECT * FROM franchises");
    const str = franchises1.refer_code;
    console.info("========================>",str)
    const refer_prifixed = str ?  str.slice(0, -4) : "RBMHORJ00"; // "RBMHORJ00"
    const refer_suffix =str ?  str.slice(-4) : "0000" ; // "0000"
    const refer_code = refer_prifixed + refer_suffix + row.id;

    await db.insert(salesmen).values({
      userId: user!.id,
      franchiseId: Franchises.id,
      referCode: refer_code,
      status: Boolean(row.status),
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    });
  }
  console.log("successfully seed of salesman");
};
