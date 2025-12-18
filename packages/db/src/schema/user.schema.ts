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
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";
import z from "zod";
import {
  MaritalStatus,
  maritalStatusEnum,
  UserRole,
  userRoleEnum,
} from "../enum/allEnum.enum";
import { users } from "./auth.schema";
import {
  categories,
  cities,
  states,
  subcategories,
} from "./not-related.schema";

export const profiles = pgTable("profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  profileImage: varchar("profileImage", { length: 255 }),
  salutation: varchar("salutation", { length: 100 }),
  firstName: varchar("first_name", { length: 100 }),
  lastName: varchar("last_name", { length: 100 }),
  dob: date("dob"),
  occupation: integer("occupation"),
  maritalStatus: maritalStatusEnum("marital_status"),
  address: varchar("address", { length: 255 }),
  pincode: varchar("pincode", { length: 10 }),
  state: integer("state").notNull(),
  city: integer("city")
    .notNull()
    .references(() => cities.id),
  // website: varchar("website", { length: 255 }), TODO: Ask About this Akki sir
  createdAt: timestamp("created_at").default(sql`NOW()`),
  updatedAt: timestamp("updated_at").default(sql`NOW()`),
});

export const profileInsertSchema = createInsertSchema(profiles).extend({
  maritalStatus: z.enum(MaritalStatus),
});

export const profileUpdateSchema = createUpdateSchema(profiles).extend({
  maritalStatus: z.enum(MaritalStatus),
});

// 2. request_delete_accounts
export const account_delete_request = pgTable("account_delete_request", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  reason: varchar("reason", { length: 500 }).notNull(),
  createdAt: timestamp("created_at").default(sql`NOW()`),
  updatedAt: timestamp("updated_at").default(sql`NOW()`),
});

export const requestAccountsInsertSchema = createInsertSchema(
  account_delete_request,
  {
    reason: z
      .string()
      .min(10, "Message For Reason To Delete Account Must Be 10"),
  },
).omit({ userId: true });
//  3.feedback
export const feedbacks = pgTable("feedbacks", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  feedbackType: varchar("feedback_type", { length: 200 }).array().notNull(),
  additionalFeedback: text("additional_feedback"),
  createdAt: timestamp("created_at").default(sql`NOW()`),
  updatedAt: timestamp("updated_at").default(sql`NOW()`),
});

export const feedbackInsertSchema = createInsertSchema(feedbacks, {
  feedbackType: z.array(z.string()).min(1, "Please select at least one option"),
}).omit({ userId: true });

// 4. franchises
export const franchises = pgTable("franchises", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  referPrifixed: varchar("refer_prifixed", { length: 255 }).notNull(),
  gstNo: varchar("gst_no", { length: 50 }).unique(),
  employeeLimit: integer("employee_limit").notNull().default(0),
  lastAssignCode: integer("last_assign_code").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
export const franchiseInsertSchema = createInsertSchema(franchises);
export const franchiseUpdateSchema = createUpdateSchema(franchises);

// 5. salesmen
export const salesmen = pgTable("salesmen", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  franchiseId: integer("franchise_id")
    .notNull()
    .references(() => franchises.id, { onDelete: "cascade" }),
  referCode: varchar("refer_code", { length: 255 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const salesmenInsertSchema = createInsertSchema(salesmen);

export const notification = pgTable("notification", {
  id: serial("id").primaryKey(),
  notificationId: integer("notification_id").notNull().default(0),
  role: userRoleEnum("notification_role").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  state: integer("state").references(() => states.id, {
    onDelete: "cascade",
  }),
  city: integer("city").references(() => cities.id, {
    onDelete: "cascade",
  }),
  categoryId: integer("category_id").references(() => categories.id, {
    onDelete: "cascade",
  }),
  subCategoryId: integer("sub_category_id").references(() => subcategories.id, {
    onDelete: "cascade",
  }),
  status: boolean("status").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const notificationInsertSchema = createInsertSchema(notification, {
  role: () => z.array(z.enum(UserRole)),
  categoryId: () => z.array(z.number()),
  subCategoryId: () => z.array(z.number()),
  city: () => z.array(z.number()),
  state: () => z.array(z.number()),
});
export const notificationUpdateSchema = createUpdateSchema(notification);
export const notificationSelectSchema = createSelectSchema(notification);
