import { sql } from "drizzle-orm";
import {
  boolean,
  date,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { users } from "./auth.schema.js";

// 1. Profiles
export enum MaritalStatus {
  // SINGLE = "single",
  MARRIED = "married",
  UNMARRIED = "unmarried",
}

export const profiles = pgTable("profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  mysqlUserId: integer("mysql_user_id"),
  photo: varchar("photo", { length: 255 }),
  firstName: varchar("first_name", { length: 100 }).notNull(),
  lastName: varchar("last_name", { length: 100 }),
  city: varchar("city", { length: 100 }),
  address: varchar("address", { length: 255 }),
  dob: date("dob"),
  maritalStatus: varchar("marital_status", {
    length: 20,
  }).$type<MaritalStatus>(),
  occupation: varchar("occupation", { length: 100 }),
  state: varchar("state", { length: 100 }),
  website: varchar("website", { length: 255 }),
  area: varchar("area", { length: 100 }),
  gstNo: varchar("gst_no", { length: 50 }).unique(),
  zipcode: varchar("zipcode", { length: 10 }).default("000000"),
  createdAt: timestamp("created_at").default(sql`NOW()`),
  updatedAt: timestamp("updated_at").default(sql`NOW()`),
});

// 2. request_delete_accounts
export const request_accounts = pgTable("request_accounts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  reason: varchar("reason", { length: 500 }).notNull(),
  createdAt: timestamp("created_at").default(sql`NOW()`),
  updatedAt: timestamp("updated_at").default(sql`NOW()`),
});

//  3.feedback
export const feedbacks = pgTable("feedbacks", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  feedbackType: varchar("feedback_type", { length: 200 }).notNull(),
  additionalFeedback: text("additional_feedback"),
  createdAt: timestamp("created_at").default(sql`NOW()`),
  updatedAt: timestamp("updated_at").default(sql`NOW()`),
});

// 4. franchises
export const franchises = pgTable("franchises", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  referPrifixed: varchar("refer_prifixed", { length: 255 }).notNull(),
  status: boolean("status").notNull().default(true),
  employeeLimit: integer("employee_limit").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// 5. salesmen
export const salesmen = pgTable("salesmen", {
  id: serial("id").primaryKey(),

  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  franchiseId: integer("franchise_id")
    .notNull()
    .references(() => franchises.id, { onDelete: "cascade" }),
  referCode: varchar("refer_code", { length: 255 }).notNull().unique(),
  status: boolean("status").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
