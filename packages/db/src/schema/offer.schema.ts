import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import z from "zod";
import { businessListings } from "../schema/business.schema";
import { categories, subcategories } from "../schema/not-related.schema";
import { users } from "./auth.schema";

//1.offers
export const offers = pgTable("offers", {
  id: serial("id").primaryKey(),
  businessId: integer("business_id")
    .notNull()
    .references(() => businessListings.id),
  categoryId: integer("category_id")
    .notNull()
    .references(() => categories.id),
  offerName: varchar("offer_name", { length: 255 }).notNull(),
  offerSlug: varchar("offer_slug", { length: 255 }),
  rate: integer("rate").notNull(),
  discountPercent: integer("discount_percent"),
  mainImage: varchar("main_image", { length: 255 }).notNull(),
  finalPrice: integer("final_price").notNull(),
  offerDescription: text("offer_description").notNull(),
  offerStartDate: timestamp("offer_start_date").notNull(),
  offerEndDate: timestamp("offer_end_date").notNull(),
  reuploadCount: integer("reupload_count").default(0).notNull(),
  status: boolean("status").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const offersInsertSchema = createInsertSchema(offers, {
  mainImage: z.string().min(1, "Image 1 is required"),
  categoryId: () => z.number().min(1, "Category is required"),
  offerName: () =>
    z.string().min(3, "Offer name should be minimum 3 characters long"),
  rate: () => z.number().min(1, "Rate is required"),
  finalPrice: () => z.number().min(1, "Final price is required"),
  offerDescription: () =>
    z.string().min(3, "Offer description should be minimum 3 characters long"),
})
  .omit({
    offerStartDate: true,
    offerEndDate: true,
    businessId: true,
  })
  .extend({
    subcategoryId: z
      .array(z.number())
      .min(1, "Select at least one subcategory"),
    image2: z.string().optional(),
    image3: z.string().optional(),
    image4: z.string().optional(),
    image5: z.string().optional(),
  });
export const offersUpdateSchema = offersInsertSchema.extend({
  offerSlug: z.string().optional(),
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
export const insertOfferReviewSchema = createInsertSchema(offerReviews, {
  offerId: () => z.number().positive("Business ID is required"),
  name: () =>
    z
      .string()
      .min(3, "Name Must Be Constain 3 Characters")
      .max(255, "Too Long Name"),
  message: () =>
    z
      .string()
      .min(10, "Review must be at least 10 characters")
      .max(500, "Review must not exceed 500 characters"),
  rate: () => z.number().min(1).max(5, "Rating must be between 1 and 5"),
  email: () => z.email().min(8, "Email Must Be Contain 8 Characters").max(500),
  view: () => z.boolean(),
  status: () => z.boolean(),
}).omit({
  userId: true,
});
// 4. OfferSubcategory
export const offerSubcategory = pgTable("offer_subcagtegorys", {
  id: serial("id").primaryKey(),
  offerId: integer("offer_id")
    .references(() => offers.id)
    .notNull(),
  subcategoryId: integer("subcategory_id")
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

export const offersRelations = relations(offers, ({ many }) => ({
  offerPhotos: many(offerPhotos),
  offerSubcategory: many(offerSubcategory),
}));

export const offerPhotosRelations = relations(offerPhotos, ({ one }) => ({
  offer: one(offers, {
    fields: [offerPhotos.offerId],
    references: [offers.id],
  }),
}));

export const offerSubcategoryRelations = relations(
  offerSubcategory,
  ({ one }) => ({
    offer: one(offers, {
      fields: [offerSubcategory.offerId],
      references: [offers.id],
    }),
  }),
);
