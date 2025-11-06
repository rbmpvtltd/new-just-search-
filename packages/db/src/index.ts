import dotenv from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

if (process.env.NODE_ENV !== "production") {
  dotenv.config({
    // path: "../../.env",
  });
}

const pool = new Pool({
  host: process.env.PGHOST ?? "localhost",
  user: process.env.PGUSER ?? "root",
  password: process.env.PGPASSWORD ?? "12345678",
  database: process.env.PGDATABASE ?? "justsearch",
  port: Number(process.env.PGPORT) ?? 5432,
});

import { migrate } from "drizzle-orm/node-postgres/migrator";
import * as auth from "./schema/auth.schema";
import * as business from "./schema/business.schema";
import * as hire from "./schema/hire.schema";
import * as not_related from "./schema/not-related.schema";
import * as offer from "./schema/offer.schema";
import * as plan from "./schema/plan.schema";
import * as product from "./schema/product.schema";
import * as user from "./schema/user.schema";

export type UserRole = (typeof auth.UserRole)[keyof typeof auth.UserRole];

export const MARITAL_STATUS = hire.MaritalStatus;
export const GENDER = hire.Gender;
export const JOB_TYPE = hire.JobType;
export const WORK_SHIFT = hire.WorkShift;
export const JOB_DURATION = hire.JobDuration;
// export const LANGUAGES = hire.Languages;

export const schemas = {
  not_related,
  auth,
  business,
  hire,
  offer,
  plan,
  product,
  user,
};

export const db = drizzle({
  client: pool,
  schema: {
    ...not_related,
    ...auth,
    ...business,
    ...hire,
    ...offer,
    ...plan,
    ...product,
    ...user,
  },
});

export const dbmigration = async () => {
  await migrate(db, {
    migrationsFolder: "../drizzle",
  });
};
