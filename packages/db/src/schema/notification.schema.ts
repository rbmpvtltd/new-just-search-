import { integer, pgTable, serial, varchar } from "drizzle-orm/pg-core";
import { users } from "./auth.schema";
import { createInsertSchema } from "drizzle-zod";

export const pushTokens = pgTable("push_tokens", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  token: varchar().notNull(),
});

export const pushTokenInsertSchema = createInsertSchema(pushTokens);
