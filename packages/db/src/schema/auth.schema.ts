import { sql } from "drizzle-orm";
import {
	pgEnum,
	pgTable,
	serial,
	text,
	timestamp,
	varchar,
} from "drizzle-orm/pg-core";

export enum UserRole {
	visiter = "visiter",
	admin = "admin",
	hire = "hire",
	business = "business",
	franchises = "franchises",
	salesman = "salesman",
}

export const userRoleEnum = pgEnum("user_role", UserRole);

export const users = pgTable("users", {
	id: serial("id").primaryKey(),
	username: varchar("username", { length: 100 }).notNull(),
	email: varchar("email", { length: 255 }),
	phoneNumber: varchar("phone_number", { length: 20 }).notNull(),
	password: text("password"),
	role: userRoleEnum("role"),
	googleId: varchar("google_id", { length: 255 }),
	refreshToken: text("refresh_token"),
	createdAt: timestamp("created_at").default(sql`NOW()`),
	updatedAt: timestamp("updated_at").default(sql`NOW()`),
});
