import {
  pgTable,
  serial,
  integer,
  varchar,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { users } from "./auth.schema";
import { createInsertSchema } from "drizzle-zod";

export const pushTokens = pgTable(
  "push_tokens",
  {
    id: serial("id").primaryKey(),

    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    token: varchar("token", { length: 512 }).notNull(),

    deviceId: varchar("device_id", { length: 255 }).notNull().unique(),

    platform: varchar("platform", { length: 20 }).notNull(),

    lastActiveAt: timestamp("last_active_at", {
      withTimezone: true,
    }).defaultNow(),
  },
  (t) => [uniqueIndex("uniq_device_token").on(t.deviceId, t.token)],
);

export const pushTokenInsertSchema = createInsertSchema(pushTokens).omit({
  id: true,
  userId: true,
  lastActiveAt: true,
});
