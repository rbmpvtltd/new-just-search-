export const safeArray = (val: any) => {
  if (!val) return [];
  try {
    const parsed = Array.isArray(val) ? val : JSON.parse(val);
    return parsed.map((v: string) =>
      typeof v === "string"
        ? v.trim().charAt(0).toUpperCase() + v.trim().slice(1).toLowerCase()
        : v,
    );
  } catch {
    return [];
  }
};

import { uploadOnCloudinary } from "@repo/cloudinary";
import { type UserRole as DbUserRole, db } from "@repo/db";
import { users } from "@repo/db/dist/schema/auth.schema";
import { profiles } from "@repo/db/dist/schema/user.schema";
import { eq, type InferInsertModel } from "drizzle-orm";
import slugifylib from "slugify";
import { sql } from "./mysqldb.seed";
import { clouadinaryFake, dummyImageUrl } from "./seeds";

export const slugify = (name: string) =>
  slugifylib(name, {
    replacement: "-",
    remove: /[*+~.()'"!:@]/g,
    lower: true,
    strict: true,
    trim: true,
  });

// plan id
// ad_limit
// products_limit
// offers_limit
// plan_end_date
// payment_date
// area,

interface NameParts {
  salutation: string | null;
  firstName: string;
  lastName: string | null;
}
export function parseName(name: string | null): NameParts {
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
export const insertUser = async (userId: string, role: DbUserRole) => {
  if (Number(userId) < 168) console.error("user id less than 168", userId);
  // Implementation for inserting a user
  const isUserExist = await db.query.users.findFirst({
    where: eq(users.id, Number(userId)),
  });
  if (isUserExist) {
    return isUserExist.id;
  }
  const [rows]: any[] = await sql.execute("SELECT * FROM users where id = ?", [
    userId,
  ]);

  const row = rows[0];
  type DbUser = InferInsertModel<typeof users>;

  const user: DbUser = {
    id: row?.id,
    displayName: row?.name,
    phoneNumber: row?.phone,
    email: row?.email,
    status: true,
    password: row?.password ?? null,
    role: role,
    googleId: row?.google_id,
    appleId: row?.apple_id,
    revanueCatId: row?.revanue_id ?? undefined,
    createdAt: row?.created_at,
    updatedAt: row?.updated_at,
  };

  //TODO: add current user plan
  const [insertedUser] = await db.insert(users).values(user).returning();

  if (!insertedUser) {
    throw new Error(`User could not be inserted or found:`);
  }
  const invalidPhotos = [
    "1755250626_1106f170-2186-47ca-a852-e1d054891447.jpeg",
  ];

  let profilePhotoUrl = null;
  if (row?.photo && !invalidPhotos.includes(row.photo)) {
    const liveHireImageUrl = `https://www.justsearch.net.in/assets/images/${row.photo}`;
    if (row.photo) {
      try {
        profilePhotoUrl = await uploadOnCloudinary(
          liveHireImageUrl,
          "Hire",
          clouadinaryFake,
        );
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  }

  // resolve city id
  let cityId: number | null = null;
  if (row?.city) {
    const cityIdOrName = Number(row?.city);
    let cityRecord = null;
    if (Number.isNaN(cityIdOrName)) {
      cityRecord = await db.query.cities.findFirst({
        where: (c, { eq }) => eq(c.city, row?.city),
      });
    } else {
      cityRecord = await db.query.cities.findFirst({
        where: (c, { eq }) => eq(c.id, Number(row?.city)),
      });
    }
    cityId = cityRecord?.id ?? null; // 👈 fallback to "Unknown" city id
  }

  if (row?.marital_status === "married") {
    row.marital_status = "Married";
  }
  if (row?.marital_status === "unmarried") {
    row.marital_status = "Unmarried";
  }
  if (row?.marital_status === "widowed") {
    row.marital_status = "Widowed";
  }
  if (row?.marital_status === "divorced") {
    row.marital_status = "Divorced";
  }
  if (row?.marital_status === "others") {
    row.marital_status = "Others";
  }

  let occupationId = null;
  if (row?.occupation) {
    const occupationRow = row?.occupation as string;
    const occupationData = await db.query.occupation.findFirst({
      where: (occupation, { eq, or, ilike }) =>
        or(
          eq(occupation.name, occupationRow.toLowerCase()),
          ilike(occupation.name, `%${occupationRow.toLowerCase()}%`),
        ),
    });
    occupationId = occupationData?.id;
  }

  const { salutation, firstName, lastName } = parseName(row?.name);

  await db.insert(profiles).values({
    userId: Number(insertedUser.id),
    salutation: salutation === "Mr." ? 1 : salutation === "Ms." ? 2 : 3,
    firstName: firstName,
    lastName: lastName,
    city: cityId,
    profileImage: profilePhotoUrl,
    address: row?.area ?? row?.address,
    dob: row?.dob ?? null,
    maritalStatus: row?.marital_status ?? null,
    occupation: occupationId,
    state: row?.state ?? 19,
    pincode: row?.zip ?? "000000",
    createdAt: row?.created_at,
    updatedAt: row?.updated_at,
  });

  return insertedUser.id;
};
