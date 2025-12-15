import {
  boolean,
  integer,
  jsonb,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import z from "zod";
import {
  PlanPeriod,
  planPeriodEnum,
  UserRole,
  userRoleEnum,
} from "../enum/allEnum.enum";
import { users } from "./auth.schema";

export type PlanFeatures = {
  productLimit: number;
  offerLimit: number;
  offerDuration: number;
  maxOfferPerDay: number;
  verifyBag: boolean;
};
// 1. Plans
export const plans = pgTable("plans", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  identifier: varchar("identifier", { length: 255 }).notNull(),
  period: planPeriodEnum("period").notNull(),
  interval: integer("interval").notNull(),
  role: userRoleEnum("role").default(UserRole.guest).notNull(),
  amount: integer("amount"),
  currency: varchar("currency", { length: 50 }).default("INR"),
  planColor: varchar("plan_color", { length: 50 }).notNull(),
  features: jsonb("features").$type<PlanFeatures>().notNull(),
  status: boolean("status").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const dbPlansInsertSchema = createInsertSchema(plans).extend({
  period: z.enum(PlanPeriod),
  role: z.enum(UserRole),
});
export const plansInsertSchema = dbPlansInsertSchema
  .omit({
    identifier: true,
    features: true,
  })
  .extend({
    productLimit: z.number(),
    offerLimit: z.number(),
    offerDuration: z.number(),
    maxOfferPerDay: z.number(),
    verifyBag: z.boolean(),
  });

// 2. plane_attribute
export const planAttributes = pgTable("plan_attributes", {
  id: serial("id").primaryKey(),
  planId: integer("plan_id")
    .notNull()
    .references(() => plans.id, { onDelete: "cascade" }),
  name: varchar("name").notNull(),
  isAvailable: boolean("is_available").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const planAttributesInsertSchema = createInsertSchema(planAttributes);

// 3. transactions
export const userCurrentPlan = pgTable("user_current_plan", {
  id: serial("id").primaryKey(),
  planId: integer("plan_id")
    .notNull()
    .references(() => plans.id, { onDelete: "cascade" }),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  features: jsonb("features").$type<PlanFeatures>().notNull(),
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
  features: jsonb("features").$type<PlanFeatures>().notNull(),
  status: boolean("status").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
