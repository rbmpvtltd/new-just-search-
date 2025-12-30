import { uploadOnCloudinary } from "@repo/cloudinary";
import { db } from "@repo/db";
import { UserRole } from "@repo/db/dist/enum/allEnum.enum";
import { users } from "@repo/db/dist/schema/auth.schema";
import {
  franchises,
  profiles,
  salesmen,
} from "@repo/db/dist/schema/user.schema";
import dotenv from "dotenv";
import { sql as dbsql, type InferInsertModel } from "drizzle-orm";
import { sql } from "./mysqldb.seed";
import { clouadinaryFake, dummyImageUrl } from "./seeds";

interface NameParts {
  salutation: string | null;
  firstName: string;
  lastName: string | null;
}

function parseName(name: string | null): NameParts {
  if (!name) {
    return {
      salutation: "",
      firstName: "",
      lastName: "",
    };
  }
  const salutationRegex = /^(Mr\.|Mrs\.|Ms\.|Dr\.)\s+/; // regex to match common salutations
  const match = name.match(salutationRegex);

  // Extract salutation, if present
  const salutation = match ? match[0].trim() : null;

  // Remove the salutation from the name if it exists
  const nameWithoutSalutation = salutation
    ? name.replace(salutationRegex, "")
    : name;

  // Split the remaining name into parts
  const nameParts = nameWithoutSalutation.trim().split(" ");

  const firstName = nameParts[0] || "";
  const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : null;

  return {
    salutation: salutation,
    firstName: firstName,
    lastName: lastName,
  };
}

dotenv.config();
export const userSeed = async () => {
  await clearAllTablesUser();
  await seedUsers();
  // await seedfranchises();
  // await seedOfSalesman();
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
  const [rows]: any[] = await sql.execute("SELECT * FROM users");

  type DbUser = InferInsertModel<typeof users>;
  for (const row of rows) {
    if (row.status !== 1) {
      continue;
    }

    // plan id
    // ad_limit
    // products_limit
    // offers_limit
    // plan_end_date
    // payment_date
    // area,

    // await db.insert(profiles).values({
    //   userId: Number(insertedUser.id),
    //   salutation: salutation,
    //   firstName: firstName,
    //   lastName: lastName,
    //   city: cityId,
    //   profileImage: profilePhotoUrl,
    //   address: row.address ?? "null",
    //   dob: row.dob ?? null,
    //   maritalStatus: row.marital_status ?? null,
    //   occupation: occupationId,
    //   state: row.state ?? 19,
    //   pincode: row.zip ?? "000000",
    //   createdAt: row.created_at,
    //   updatedAt: row.updated_at,
    // });
    const user: DbUser = {
      id: row.id,
      displayName: row.name,
      phoneNumber: row.phone,
      email: row.email,
      status: true,
      password: row.password ?? null,
      role: row.phone ? UserRole.visiter : UserRole.guest,
      googleId: row.google_id,
      appleId: row.apple_id,
      revanueCatId: row.revanue_id ?? undefined,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
    const [insertedUser] = await db.insert(users).values(user).returning();

    if (!insertedUser) {
      throw new Error(`User could not be inserted or found:`);
    }

    const liveProfileImageUrl = `https://www.justsearch.net.in/assets/images/${row.photo}`;

    const profilePhotoUrl =
      (await uploadOnCloudinary(
        liveProfileImageUrl,
        "Profile",
        clouadinaryFake,
      )) ?? dummyImageUrl;

    // resolve city id
    let cityId: number | null = null;
    if (row.city) {
      const cityIdOrName = Number(row.city);
      let cityRecord = null;
      if (Number.isNaN(cityIdOrName)) {
        cityRecord = await db.query.cities.findFirst({
          where: (c, { eq }) => eq(c.city, row.city),
        });
      } else {
        cityRecord = await db.query.cities.findFirst({
          where: (c, { eq }) => eq(c.id, Number(row.city)),
        });
      }
      cityId = cityRecord?.id ?? null; // 👈 fallback to "Unknown" city id
    }

    if (row.marital_status === "married") {
      row.marital_status = "Married";
    }
    if (row.marital_status === "unmarried") {
      row.marital_status = "Unmarried";
    }
    if (row.marital_status === "widowed") {
      row.marital_status = "Widowed";
    }
    if (row.marital_status === "divorced") {
      row.marital_status = "Divorced";
    }
    if (row.marital_status === "others") {
      row.marital_status = "Others";
    }

    let occupationId = null;
    if (row.occupation) {
      const occupationRow = row.occupation as string;
      const occupationData = await db.query.occupation.findFirst({
        where: (occupation, { eq, or, ilike }) =>
          or(
            eq(occupation.name, occupationRow.toLowerCase()),
            ilike(occupation.name, `%${occupationRow.toLowerCase()}%`),
          ),
      });
      occupationId = occupationData?.id;
    }

    const { salutation, firstName, lastName } = parseName(row.name);

    await db.insert(profiles).values({
      userId: Number(insertedUser.id),
      salutation: salutation === "Mr." ? 1 : salutation === "Ms." ? 2 : 3,
      firstName: firstName,
      lastName: lastName,
      city: cityId,
      profileImage: profilePhotoUrl,
      address: row.area ?? row.address,
      dob: row.dob ?? null,
      maritalStatus: row.marital_status ?? null,
      occupation: occupationId,
      state: row.state ?? 19,
      pincode: row.zip ?? "000000",
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    });
  }

  console.log("users and Profiles seeding complete");
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
        displayName: row.display_name,
        role: UserRole.salesman,
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
