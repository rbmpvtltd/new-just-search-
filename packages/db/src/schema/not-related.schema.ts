import {
  boolean,
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

const states = pgTable("states", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
});

const cities = pgTable("cities", {
  id: serial("id").primaryKey(),
  city: varchar("city", { length: 255 }).notNull(),
  stateId: integer("state_id")
    .notNull()
    .references(() => states.id, { onDelete: "cascade" }),
});

const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull(),
  photo: varchar("photo", { length: 255 }).notNull(),
  isPopular: boolean("is_popular").default(false),
  status: boolean("status").default(true),
  type: integer("type"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

const subcategories = pgTable("subcategories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull(),
  status: boolean("status").default(true),
  categoryId: integer("category_id")
    .notNull()
    .references(() => categories.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

const banners = pgTable("banners", {
  id: serial("id").primaryKey(),
  mysqlId: integer("mysql_id"),
  route: text("route"),
  photo: text("photo").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  type: integer("type").default(1).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
const bannerInsertSchema = createInsertSchema(banners);
const bannerUpdateSchema = createUpdateSchema(banners);
const bannerSelectSchema = createSelectSchema(banners, {
  photo: (z) => z.max(10),
});

export {
  states,
  cities,
  categories,
  subcategories,
  banners,
  bannerInsertSchema,
  bannerSelectSchema,
  bannerUpdateSchema,
};
