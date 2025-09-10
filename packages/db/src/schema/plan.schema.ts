import {
  boolean,
  integer,
  json,
  numeric,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { users } from "./auth.schema";

// 1. Plans
export const plans1 = pgTable("plans", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  subtitle: varchar("subtitle", { length: 255 }),
  planType: integer("plan_type"),
  price: numeric("price"),
  prevPrice: numeric("prev_price"),
  priceColor: varchar("price_color", { length: 50 }).notNull(),
  postLimit: integer("post_limit"),
  productLimit: integer("product_limit"),
  offerLimit: integer("offer_limit"),
  postDuration: integer("post_duration"),
  offerDuration: integer("offer_duration"),
  maxOfferPerDay: integer("max_offer_per_day"),
  status: boolean("status").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// 2. plane_attribute
export const planAttributes = pgTable("plan_attributes", {
  id: serial("id").primaryKey(),
  planId: integer("plan_id")
    .notNull()
    .references(() => plans1.id, { onDelete: "cascade" }),
  name: json("name").$type<string[]>().notNull(),
  isAvailable: boolean("is_available").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// 3. transactions
export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  amount: numeric("amount").notNull(),
  transactionsNo: varchar("transactions_no", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// // 4. user_subscriptions
export const userSubscriptions = pgTable("user_subscriptions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  subscriptionNumber: varchar("subscription_number", { length: 255 })
    .notNull()
    .unique(),

  transactionId: integer("transaction_id")
    .notNull()
    .references(() => transactions.id),

  plansId: integer("plans_id")
    .notNull()
    .references(() => plans1.id),

  price: integer("price").notNull(),
  expiryDate: integer("expiry_date").notNull(),
  status: boolean("status").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
