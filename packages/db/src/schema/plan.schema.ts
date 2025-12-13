import {
  boolean,
  integer,
  json,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { planPeriodEnum, UserRole, userRoleEnum } from "@/enum/allEnum.enum";
import { users } from "./auth.schema";

// 1. Plans
export const plans = pgTable("plans", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  identifier: varchar("identifier", { length: 255 }).notNull(),
  period: planPeriodEnum("period").notNull(),
  interval: integer("interval").notNull(),
  role: userRoleEnum("role").default(UserRole.guest).notNull(),
  amount: integer("amount"),
  planColor: varchar("plan_color", { length: 50 }).notNull(),
  productLimit: integer("product_limit"),
  offerLimit: integer("offer_limit"),
  offerDuration: integer("offer_duration"),
  maxOfferPerDay: integer("max_offer_per_day"),
  status: boolean("status").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const plansInsertSchema = createInsertSchema(plans);

// 2. plane_attribute
export const planAttributes = pgTable("plan_attributes", {
  id: serial("id").primaryKey(),
  planId: integer("plan_id")
    .notNull()
    .references(() => plans.id, { onDelete: "cascade" }),
  name: json("name").$type<string[]>().notNull(),
  isAvailable: boolean("is_available").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// 3. transactions
export const userCurrentPlan = pgTable("user_current_plan", {
  id: serial("id").primaryKey(),
  planId: integer("plan_id")
    .notNull()
    .references(() => plans.id, { onDelete: "cascade" }),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// // 4. user_subscriptions
export const userSubscriptions = pgTable("user_subscriptions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  plansId: integer("plans_id")
    .notNull()
    .references(() => plans.id),
  planIdentifier: varchar("plan_identifier", { length: 255 }),
  subscriptionNumber: varchar("subscription_number", { length: 255 })
    .notNull()
    .unique(),
  transactionNumber: varchar("transaction_number", { length: 255 }).notNull(),
  amount: integer("amount").notNull(),
  currency: varchar("currency"),
  expiryDate: integer("expiry_date").notNull(),
  status: boolean("status").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
