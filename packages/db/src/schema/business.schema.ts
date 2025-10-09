import {
  boolean,
  integer,
  json,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import {
  categories,
  cities,
  states,
  subcategories,
} from "../schema/not-related.schema";
import { users } from "./auth.schema";

// 1. Business Listing Interface
export const businessListings = pgTable("business_listings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  photo: text("photo"),
  specialities: text("specialities"),
  description: text("description"),
  homeDelivery: boolean("home_delivery").default(false),
  latitude: varchar("latitude", { length: 50 }),
  longitude: varchar("longitude", { length: 50 }),
  buildingName: varchar("building_name", { length: 255 }),
  streetName: varchar("street_name", { length: 255 }),
  area: varchar("area", { length: 255 }),
  landmark: varchar("landmark", { length: 255 }),
  pincode: integer("pincode"),
  cityId: integer("city")
    .notNull()
    .references(() => cities.id, { onDelete: "cascade" }),
  schedules: json("schedules"),
  contactPerson: varchar("contact_person", { length: 255 }),
  status: boolean("status").default(true),
  ownerNumber: varchar("owner_number"),
  phoneNumber: varchar("phone_number"),
  whatsappNo: varchar("whatsapp_no"),
  email: varchar("email", { length: 255 }),
  alternativeMobileNumber: varchar("alternative_mobile_number"),
  facebook: varchar("facebook", { length: 255 }),
  twitter: varchar("twitter", { length: 255 }),
  linkedin: varchar("linkedin", { length: 255 }),
  listingVideo: text("listing_video"),
  isFeature: boolean("is_feature").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// 2. Business Photo Interface
export const businessPhotos = pgTable("business_photos", {
  id: serial("id").primaryKey(),
  businessId: integer("business_id")
    .notNull()
    .references(() => businessListings.id, { onDelete: "cascade" }),
  photo: varchar("photo", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// // 3. favourite
export const favourites = pgTable("favourites", {
  id: serial("id").primaryKey(),
  businessId: integer("business_id")
    .notNull()
    .references(() => businessListings.id, { onDelete: "cascade" }),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 4. businesses_subcategories
export const businessSubcategories = pgTable("business_subcategories", {
  id: serial("id").primaryKey(),
  businessId: integer("business_id")
    .notNull()
    .references(() => businessListings.id, { onDelete: "cascade" }),
  subcategoryId: integer("subcategory_id")
    .notNull()
    .references(() => subcategories.id, { onDelete: "cascade" }),
});

// 5. business-categories
export const businessCategories = pgTable("business_categories", {
  id: serial("id").primaryKey(), // auto increment PK
  businessId: integer("business_id")
    .notNull()
    .references(() => businessListings.id, { onDelete: "cascade" }),
  categoryId: integer("category_id")
    .notNull()
    .references(() => categories.id, { onDelete: "cascade" }),
});

// 6. business_reviews
export const businessReviews = pgTable("business_reviews", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  businessId: integer("business_id")
    .notNull()
    .references(() => businessListings.id),
  rate: integer("rate").notNull(), //.check("rate >= 1 AND rate <= 5")
  message: varchar("message").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

// // 7. comment_business
// export const commentsBusiness = pgTable("comments_business", {
//   id: serial("id").primaryKey(), // Auto increment PK

//   comments_id: integer("comments_id")
//     .notNull()
//     .references(() => comments.id),

//   businesses_id: integer("businesses_id")
//     .notNull()
//     .references(() => businessListings.id),
// });

// 8. recent_views_business
export const recentViewBusiness = pgTable("recent_view_business", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),

  businessId: integer("business_id")
    .notNull()
    .references(() => businessListings.id),

  device: varchar("device", { length: 255 }),
  browser: varchar("browser", { length: 255 }),
  operatingSystem: varchar("operating_system", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// // 9  business_refer
// export const businessRefer = pgTable("business_refer", {
//   id: serial("id").primaryKey(),
//   businessId: integer("business_id")
//     .notNull()
//     .references(() => businessListings.id, { onDelete: "cascade" }),

//   salesmanId: integer("salesman_id")
//     .notNull()
//     .references(() => salesman.id, { onDelete: "cascade" }),

//   createdAt: timestamp("created_at").defaultNow().notNull(),
//   updatedAt: timestamp("updated_at").defaultNow().notNull(),
// });
