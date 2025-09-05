import {
  boolean,
  integer,
  numeric,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { users } from "./auth.schema.js";
import { businessListings } from "./business.schema.js";
import { categories } from "./category.schema.js";
import { subcategories } from "./subcategory.schema.js";

//1.offers
export const offers = pgTable("offers", {
  id: serial("id").primaryKey(),
  businessId: integer("business_id")
    .notNull()
    .references(() => businessListings.id),
  categoryId: integer("category_id")
    .notNull()
    .references(() => categories.id),
  productName: varchar("product_name", { length: 255 }).notNull(),
  productSlug: varchar("product_slug", { length: 255 }).notNull(),
  rate: numeric("rate", { precision: 10, scale: 2 }).notNull(),
  discountPercent: numeric("discount_percent").notNull(),
  finalPrice: numeric("final_price").notNull(),
  productDescription: text("product_description").notNull(),
  offerStartDate: timestamp("offer_start_date").notNull(),
  offerEndDate: timestamp("offer_end_date").notNull(),
  reuploadCount: integer("reupload_count").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// 2 OfferPhoto
export const offerPhotos = pgTable("offer_photos", {
  id: serial("id").primaryKey(),
  offerId: integer("offer_id")
    .notNull()
    .references(() => offers.id),
  photo: varchar("photo", { length: 500 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// 3. offer_reviews
export const offerReviews = pgTable("offer_reviews", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  offerId: integer("offer_id")
    .notNull()
    .references(() => offers.id),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }),
  message: varchar("message", { length: 1000 }),
  rate: integer("rate"),
  view: boolean("view").notNull().default(false),
  status: boolean("status").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// 4. OfferSubcategory
export const offerSubcategory = pgTable("offer_subcagtegorys", {
  id: serial("id").primaryKey(),
  offer_id: integer("offer_id")
    .references(() => offers.id)
    .notNull(),
  subcategory_id: integer("subcategory_id")
    .references(() => subcategories.id)
    .notNull(),
});

// 4.RecentViewsOffer
export const recentViewsOffers = pgTable("recent_views_offers", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  device: text("device"),
  browser: text("browser"),
  operatingSystem: text("operating_system"),
  offerId: integer("offer_id")
    .references(() => offers.id)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
