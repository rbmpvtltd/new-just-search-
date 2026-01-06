import { db, type UserRole } from "@repo/db";
import { users } from "@repo/db/dist/schema/auth.schema";
import { franchises, salesmen } from "@repo/db/dist/schema/user.schema";
import dotenv from "dotenv";
import { sql as dbsql } from "drizzle-orm";
import { sql } from "./mysqldb.seed";
import { insertUser } from "./utils";

dotenv.config();
export const userSeed = async () => {
  await clearAllTablesUser();
  await seedUsers();
  await seedfranchises();
  await seedOfSalesman();
};

export const clearAllTablesUser = async () => {
  // await db.execute(`TRUNCATE TABLE franchises RESTART IDENTITY CASCADE;`);
  await db.execute(`TRUNCATE TABLE profiles RESTART IDENTITY CASCADE;`);
  await db.execute(`TRUNCATE TABLE users RESTART IDENTITY CASCADE;`);
  await db.execute(`TRUNCATE TABLE franchises RESTART IDENTITY CASCADE;`);
  await db.execute(`TRUNCATE TABLE salesmen RESTART IDENTITY CASCADE;`);

  console.log(" All tables cleared successfully!");
};

export const seedUsers = async () => {
  const [rows]: any[] = await sql.execute(
    `SELECT u.* FROM mydb.users u left join listings l on u.id = l.user_id where l.user_id is null`,
  );

  for (const row of rows) {
    let role: UserRole = "guest";
    if (row.phone) {
      role = "visiter";
    }
    await insertUser(row.id, role);
  }
};

const seedfranchises = async () => {
  const [rbmUser] = await db
    .insert(users)
    .values({
      displayName: "ROTARY BALAJI MEDIA PRIVATE LIMITED",
      email: "rbm.jodhpur03@gmail.com",
      phoneNumber: "8875770555",
      password: "$2y$10$xUF/tvN6VQdzUh3g21PbCORcoNIunlHLiMVLgi6BrFdcxKwyAJaju",
      createdAt: new Date("2025-02-10 13:18:10"),
      updatedAt: new Date("2025-05-04 08:47:19"),
      role: "franchises",
      status: true,
    })
    .returning();

  if (!rbmUser) {
    throw new Error("rbmUser not found");
  }
  const [galaxyUser] = await db
    .insert(users)
    .values({
      displayName: "GALAXY - the economical axis",
      email: "upadhayaysanjay78@gmail.com",
      phoneNumber: "8240770083",
      password: "$2y$10$mq1e7/YjPJXRErZUpK4H5eHmLSfxsHkpoHUruoalREo1heB228huy",
      createdAt: new Date("2025-02-22 05:37:19"),
      updatedAt: new Date("2025-03-01 06:29:00"),
      role: "franchises",
      status: true,
    })
    .returning();

  if (!galaxyUser) {
    throw new Error("galaxyUser not found");
  }

  const [rbmFranchise] = await db
    .insert(franchises)
    .values({
      id: 1,
      userId: rbmUser?.id,
      referPrifixed: "RBMHORJ",
      employeeLimit: 50,
      gstNo: "08AANCR4677E1ZX",
      lastAssignCode: 0,
    })
    .returning();

  const [galaxyFranchise] = await db
    .insert(franchises)
    .values({
      id: 2,
      userId: galaxyUser?.id,
      referPrifixed: "GALAXY",
      employeeLimit: 50,
      gstNo: "",
      lastAssignCode: 0,
    })
    .returning();

  await db.execute(
    dbsql`SELECT setval(
        'franchises_id_seq',
        COALESCE((SELECT MAX(id) + 1 FROM franchises), 1),
        false
      );`,
  );
  if (!rbmFranchise) {
    throw new Error("rbmUser not found");
  }
  await db
    .insert(salesmen)
    .values({
      franchiseId: 1,
      referCode: "RBMHORJ00000",
      userId: rbmUser.id,
    })
    .returning();
  if (!galaxyFranchise) {
    throw new Error("rbmUser not found");
  }

  await db
    .insert(salesmen)
    .values({
      franchiseId: 2,
      referCode: "GALAXY000000",
      userId: galaxyUser.id,
    })
    .returning();

  console.log("Franchise complete");
};

export const seedOfSalesman = async () => {
  const [sales]: any[] = await sql.execute("SELECT * FROM staff");
  console.log("salesmen started");
  for (const row of sales) {
    const [user] = await db
      .insert(users)
      .values({
        displayName: row.name,
        role: "salesman",
        email: row.email,
        phoneNumber: row.mobile_no,
        password: row.password,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      })
      .returning();
    if (!user) {
      throw new Error("User not found");
    }
    try {
      await db.insert(salesmen).values({
        userId: user.id,
        franchiseId: row.franchise_id === 10 ? 2 : 1,
        referCode: row.refer_code,
        // status: Boolean(row.status),
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      });
    } catch (error) {
      console.log("error", row.id);
    }
  }
  console.log("successfully seed of salesman");
};
