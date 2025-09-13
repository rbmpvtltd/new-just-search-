import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

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
  photo: text("photo"),
  isActive: boolean("is_active").default(true),
  type: integer("type").default(1),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export { states, cities, categories, subcategories, banners };
