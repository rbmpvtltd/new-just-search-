import { sql } from "drizzle-orm";
import {
  boolean,
  date,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { users } from "./auth.schema";
import { cities, states } from "./not-related.schema";

// 1. Profiles
export const MaritalStatus = {
  married: "married",
  unmarried: "unmarried",
  widowed: "widowed",
  divorced: "divorced",
} as const;

export const maritalStatusEnum = pgEnum("user_marital_status", MaritalStatus);

export const profiles = pgTable("profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  mysqlUserId: integer("mysql_user_id"),
  profileImage: varchar("profileImage", { length: 255 }),
  salutation: varchar("salutation", { length: 100 }),
  firstName: varchar("first_name", { length: 100 }).notNull(),
  lastName: varchar("last_name", { length: 100 }),
  email: varchar("email", { length: 255 }),
  dob: date("dob"),
  occupation: varchar("occupation", { length: 100 }),
  maritalStatus: maritalStatusEnum("marital_status"),
  address: varchar("address", { length: 255 }),
  pincode: varchar("pincode", { length: 10 }).default("000000"),
  city: integer("city")
    .notNull()
    .references(() => cities.id),
  // website: varchar("website", { length: 255 }), TODO: Ask About this Akki sir
  area: varchar("area", { length: 100 }),
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
  gstNo: varchar("gst_no", { length: 50 }).unique(),
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
