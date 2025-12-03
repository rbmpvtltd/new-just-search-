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
import { statusEnum } from "../enum/allEnum.enum";
import { users } from "./auth.schema";
import { businessListings } from "./business.schema";
import { categories, subcategories } from "./not-related.schema";

// 1.products
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  businessId: integer("business_id").references(() => businessListings.id, {
    onDelete: "cascade",
  }),
  categoryId: integer("category_id")
    .notNull()
    .references(() => categories.id, { onDelete: "cascade" }),
  productName: varchar("product_name", { length: 255 }).notNull(),
  productSlug: varchar("product_slug", { length: 255 }),
  rate: integer("rate").notNull(),
  discountPercent: integer("discount_percent"),
  finalPrice: integer("final_price"),
  productDescription: text("product_description").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const productInsertSchema = createInsertSchema(products, {
  productName: () => z.string().min(3, "Product name is required"),
  categoryId: () => z.number().min(1, "Category is required"),
  rate: () => z.number().min(1, "Rate is required"),
  productDescription: () =>
    z
      .string()
      .min(3, "Product description should be minimum 3 characters long"),
})
  .omit({ businessId: true })
  .extend({
    subcategoryId: z
      .array(z.number())
      .min(1, "Select at least one subcategory"),
    photo: z.string().min(1, "Photo is required"),
    image2: z.string().optional(),
    image3: z.string().optional(),
    image4: z.string().optional(),
    image5: z.string().optional(),
  });

//  2.PRODUCT PHOTOS TABLE
export const productPhotos = pgTable("product_photos", {
  id: serial("id").primaryKey(),
  productId: integer("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  photo: varchar("photo", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// 3.products_reviews
export const productReviews = pgTable("product_reviews", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  businessId: integer("business_id")
    .notNull()
    .references(() => businessListings.id),
  productId: integer("product_id")
    .references(() => products.id)
    .notNull(),

  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  message: text("message").notNull(),

  rate: integer("rate"),
  view: boolean("view").default(false).notNull(),
  status: boolean("status").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
export const insertProductReviewSchema = createInsertSchema(productReviews, {
  productId : () => z.number().positive("product ID is required"),
  businessId : ()=> z.number().positive("business ID is required"),
  name: () =>
    z
      .string()
      .min(3, "Name Must Be Constain 3 Characters")
      .max(255, "Too Long Name"),
  message: () =>
    z
      .string()
      .min(10, "Review must be at least 10 characters")
      .max(500, "Review must not exceed 500 characters").optional(),
  rate: () => z.number().min(1).max(5, "Rating must be between 1 and 5").optional(),
  email: () => z.email().min(8, "Email Must Be Contain 8 Characters").max(500),
  view: () => z.boolean(),
  status: () => z.boolean(),
}).omit({
  userId: true,
});

// 4. recent_views_product
export const recentViewProducts = pgTable("recent_view_products", {
  id: serial("id").primaryKey(),

  productId: integer("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),

  device: varchar("device", { length: 255 }),
  browser: varchar("browser", { length: 255 }),
  operatingSystem: varchar("operating_system", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// // 5.ProductSubcCategroy
export const productSubCategories = pgTable("product_subcategories", {
  id: serial("id").primaryKey(),

  productId: integer("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),

  subcategoryId: integer("subcategory_id")
    .notNull()
    .references(() => subcategories.id, { onDelete: "cascade" }),
});

export const productsRelations = relations(products, ({ many }) => ({
  // Define a one-to-many relationship.
  // When querying 'products', this property will hold an array of all related photos.
  productPhotos: many(productPhotos),
  productSubCategories: many(productSubCategories),
}));

// 4. PRODUCT PHOTOS RELATIONS (For completeness, linking photos back to the product)
export const productPhotosRelations = relations(productPhotos, ({ one }) => ({
  // Define a many-to-one relationship.
  product: one(products, {
    fields: [productPhotos.productId],
    references: [products.id],
  }),
}));

export const productSubCategoriesRelations = relations(
  productSubCategories,
  ({ one }) => ({
    product: one(products, {
      fields: [productSubCategories.productId],
      references: [products.id],
    }),
  }),
);
