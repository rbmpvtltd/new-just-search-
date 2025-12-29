// auth.schema.ts
import { sql } from "drizzle-orm";
import {
  boolean,
  pgTable,
  serial,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";
import z from "zod";
import { UserRole, userRoleEnum } from "../enum/allEnum.enum";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  displayName: varchar("display_name", { length: 100 }),
  email: varchar("email", { length: 255 }),
  phoneNumber: varchar("phone_number", { length: 20 }),
  password: text("password"),
  role: userRoleEnum("role").default(UserRole.guest).notNull(),
  googleId: varchar("google_id", { length: 255 }),
  appleId: varchar("apple_id", { length: 255 }),
  revanueCatId: uuid("revanue_cat_id").default(sql`gen_random_uuid()`),
  status: boolean("status").notNull().default(true),
  createdAt: timestamp("created_at").default(sql`NOW()`),
  updatedAt: timestamp("updated_at").default(sql`NOW()`),
});

export const usersInsertSchema = createInsertSchema(users, {
  email: () => z.email().min(8, "Email Must Be Contain 8 Characters").max(500),
  password: () =>
    z.string().min(8, "Password Must Be Contain 8 Characters").max(500),
  displayName: () =>
    z.string().min(3, "Display Name Must Be Contain 3 Characters").max(20),
  phoneNumber: () =>
    z.string().min(10, "Phone Number Must Be Contain 3 Characters").max(20),
}).extend({
  role: z.enum(UserRole),
});

export const usersUpdateSchema = createUpdateSchema(users, {
  email: () => z.email().min(8, "Email Must Be Contain 8 Characters").max(500),
  password: () =>
    z.string().min(8, "Password Must Be Contain 8 Characters").max(500),
  displayName: () =>
    z.string().min(3, "Display Name Must Be Contain 3 Characters").max(20),
  phoneNumber: () =>
    z.string().min(10, "Phone Number Must Be Contain 3 Characters").max(20),
}).extend({
  role: z.enum(UserRole),
});
export const usersSelectSchema = createSelectSchema(users);
