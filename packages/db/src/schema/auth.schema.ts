// auth.schema.ts
import { sql } from "drizzle-orm";
import { pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { UserRole, userRoleEnum } from "@/enum/allEnum.enum";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  displayName: varchar("display_name", { length: 100 }),
  email: varchar("email", { length: 255 }),
  phoneNumber: varchar("phone_number", { length: 20 }),
  password: text("password"),
  role: userRoleEnum("role").default(UserRole.guest).notNull(),
  googleId: varchar("google_id", { length: 255 }),
  createdAt: timestamp("created_at").default(sql`NOW()`),
  updatedAt: timestamp("updated_at").default(sql`NOW()`),
});
