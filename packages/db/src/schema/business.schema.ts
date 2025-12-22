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
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import z from "zod";
import { statusEnum } from "../enum/allEnum.enum";
import {
  categories,
  cities,
  subcategories,
} from "../schema/not-related.schema";
import { users } from "./auth.schema";
import { salesmen } from "./user.schema";

// 1. Business Listing Interface
export const businessListings = pgTable("business_listings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  salesmanId: integer("salesman_id")
    .notNull()
    .references(() => salesmen.id),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }),
  photo: text("photo"),
  specialities: text("specialities"),
  description: text("description"),
  homeDelivery: varchar("home_delivery", { length: 255 }),
  latitude: varchar("latitude", { length: 50 }),
  longitude: varchar("longitude", { length: 50 }),
  buildingName: varchar("building_name", { length: 255 }),
  streetName: varchar("street_name", { length: 255 }),
  area: varchar("area", { length: 255 }),
  landmark: varchar("landmark", { length: 255 }),
  pincode: varchar("pincode"),
  state: integer("state").notNull(),
  city: integer("city")
    .notNull()
    .references(() => cities.id, { onDelete: "cascade" }),
  days: varchar("days", { length: 255 }).array(),
  fromHour: varchar("from_hour", { length: 255 }),
  toHour: varchar("to_hour", { length: 255 }),
  contactPerson: varchar("contact_person", { length: 255 }),
  status: statusEnum("status").default("Pending"),
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

export const businessInsertSchema = createInsertSchema(businessListings, {
  photo: () => z.string().min(1, "Photo is required"),
  salesmanId: () => z.number().min(1, "Refer code is required"),
  name: () => z.string().min(3, "Name should be minimum 3 characters long"),
  buildingName: () =>
    z.string().min(3, "Building name should be minimum 3 characters long"),
  streetName: () =>
    z.string().min(3, "Street name should be minimum 3 characters long"),
  area: () => z.string().min(3, "Area should be minimum 3 characters long"),
  latitude: () =>
    z.string().refine(
      (val) => {
        const num = parseFloat(val);
        return !Number.isNaN(num) && num >= -90 && num <= 90;
      },
      { message: "Latitude must be a number between -90 and 90" },
    ),
  longitude: () =>
    z.string().refine(
      (val) => {
        const num = parseFloat(val);
        return !Number.isNaN(num) && num >= -180 && num <= 180;
      },
      { message: "Longitude must be a number between -180 and 180" },
    ),
  pincode: () =>
    z.string().min(6, "Pincode should be minimum 6 characters long"),
  city: () => z.number().min(1, "City is required"),
  state: () => z.number().min(1, "State is required"),
  contactPerson: () =>
    z.string().min(3, "Contact person should be minimum 3 characters long"),
  phoneNumber: () =>
    z.string().min(10, "Phone number should be minimum 10 characters long"),
  ownerNumber: () =>
    z.string().min(10, "Owner number should be minimum 10 characters long"),
}).extend({
  categoryId: z.number().min(1, "Category is required"),
  subcategoryId: z.array(z.number()).min(1, "Select at least one subcategory"),
  image1: z.string().min(1, "Image 1 is required"),
  image2: z.string().optional(),
  image3: z.string().optional(),
  image4: z.string().optional(),
  image5: z.string().optional(),
});

export const businessUpdateSchema = createUpdateSchema(businessListings).extend(
  {
    categoryId: z.number(),
    subcategoryId: z.array(z.number()),
    image1: z.string(),
    image2: z.string().optional(),
    image3: z.string().optional(),
    image4: z.string().optional(),
    image5: z.string().optional(),
  },
);
export const businessDetailSchema = businessInsertSchema.pick({
  photo: true,
  name: true,
  categoryId: true,
  subcategoryId: true,
  specialities: true,
  description: true,
  homeDelivery: true,
  image1: true,
  image2: true,
  image3: true,
  image4: true,
  image5: true,
});

export const addressDetailSchema = businessInsertSchema.pick({
  buildingName: true,
  streetName: true,
  area: true,
  landmark: true,
  latitude: true,
  longitude: true,
  pincode: true,
  state: true,
  city: true,
});

export const businessTimingSchema = businessInsertSchema.pick({
  days: true,
  fromHour: true,
  toHour: true,
});

export const contactDetailSchema = businessInsertSchema.pick({
  contactPerson: true,
  phoneNumber: true,
  ownerNumber: true,
  whatsappNo: true,
  email: true,
  salesmanId: true,
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
export const insertBusinessReviewSchema = createInsertSchema(businessReviews, {
  businessId: () => z.number().positive("Business ID is required"),
  message: () =>
    z
      .string()
      .min(10, "Review must be at least 10 characters")
      .max(500, "Review must not exceed 500 characters")
      .optional(),
  rate: () =>
    z.number().min(1).max(5, "Rating must be between 1 and 5").optional(),
}).omit({
  userId: true,
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

export const businessListingsRelations = relations(
  businessListings,
  ({ many }) => ({
    businessPhotos: many(businessPhotos),
  }),
);

export const businessPhotosRelations = relations(businessPhotos, ({ one }) => ({
  business: one(businessListings, {
    fields: [businessPhotos.businessId],
    references: [businessListings.id],
  }),
}));

// export const productSubCategoriesRelations = relations(
//   productSubCategories,
//   ({ one }) => ({
//     product: one(products, {
//       fields: [productSubCategories.productId],
//       references: [products.id],
//     }),
//   }),
// );
