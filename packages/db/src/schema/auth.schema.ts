// auth.schema.ts
import { sql } from "drizzle-orm";
import {
  boolean,
  pgTable,
  serial,
  text,
  timestamp,
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
  status: boolean("status").notNull().default(true),
  createdAt: timestamp("created_at").default(sql`NOW()`),
  updatedAt: timestamp("updated_at").default(sql`NOW()`),
});

export const usersInsertSchema = createInsertSchema(users).extend({
  role: z.enum(UserRole),
});
export const usersUpdateSchema = createUpdateSchema(users).extend({
  role: z.enum(UserRole),
});
export const usersSelectSchema = createSelectSchema(users);
