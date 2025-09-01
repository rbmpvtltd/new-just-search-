import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const banners = pgTable("banners", {
  id: serial("id").primaryKey(),
  mysqlId: integer("mysql_id"),
  route: text("route"),
  photo: text("photo"),
  isActive: boolean("is_active").default(true),
  type: integer("type").default(1),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
