import { uploadOnCloudinary } from "@repo/cloudinary";
import { db, schemas } from "@repo/db";
import dotenv from "dotenv";
import { eq } from "drizzle-orm";
import { UserRole } from "../db/src/schema/auth.schema";
import { sql } from "./mysqldb.seed";
import { clouadinaryFake, dummyImageUrl } from "./seeds";

dotenv.config();
export const userSeed = async () => {
  await clearAllTablesUser();
  await seedUsers();
  // await seedfranchises();
  // await seedOfSalesman();
};

const users = schemas.auth.users;
const profiles = schemas.user.profiles;
const franchises = schemas.user.franchises;
const salesmen = schemas.user.salesmen;

export const clearAllTablesUser = async () => {
  // await db.execute(`TRUNCATE TABLE franchises RESTART IDENTITY CASCADE;`);
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
      displayName: row.display_name ?? "null",
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
    console.log("user", user);

    let [insertedUser] = await db
      .insert(users)
      .values(user)
      .onConflictDoNothing()
      .returning();

    if (!insertedUser) {
      // fallback: fetch existing user by unique key (email is usually safe)
      insertedUser = await db.query.users.findFirst({
        where: (u, { eq }) => eq(u.email, user.email),
      });
    }

    if (!insertedUser) {
      throw new Error(`User could not be inserted or found: ${user.email}`);
    }
    console.log("insertedUser", insertedUser);

    const liveProfileImageUrl = `https://www.justsearch.net.in/assets/images/${row.photo}`;

    const profilePhotoUrl =
      (await uploadOnCloudinary(
        liveProfileImageUrl,
        "Profile",
        clouadinaryFake,
      )) ?? dummyImageUrl;

    // resolve city id
    let cityId: number;
    if (row.city) {
      const cityRecord = await db.query.cities.findFirst({
        where: (c, { eq }) => eq(c.city, row.city),
      });
      cityId = cityRecord?.id ?? 1; // 👈 fallback to "Unknown" city id
    } else {
      cityId = 1; // 👈 fallback
    }

    if(row.marital_status ==="married"){
      row.marital_status = "Married"
    }
    if(row.marital_status ==="unmarried"){
      row.marital_status = "Unmarried"
    }
    if(row.marital_status ==="widowed"){
      row.marital_status = "Widowed"
    }
    if(row.marital_status ==="divorced"){
      row.marital_status = "Divorced"
    }
    if(row.marital_status ==="others"){
      row.marital_status = "Others"
    }
    // 5 Insert profile
    const profileData = {
      userId: insertedUser!.id,
      firstName: row.first_name ?? "null",
      lastName: row.last_name ?? "null",
      city: cityId,
      photo: profilePhotoUrl,
      address: row.address ?? "null",
      dob: row.dob ?? null,
      maritalStatus: row.marital_status ?? null,
      occupation: row.occupation ?? null,
      state: row.state ?? 19,
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
        displayName: row.display_name,
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
        displayName: row.display_name,
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
    console.info("========================>", str);
    const refer_prifixed = str ? str.slice(0, -4) : "RBMHORJ00"; // "RBMHORJ00"
    const refer_suffix = str ? str.slice(-4) : "0000"; // "0000"
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
