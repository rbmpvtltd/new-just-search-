import { integer, pgTable, serial, varchar } from "drizzle-orm/pg-core";

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

export { states, cities };
