import { integer, pgTable, serial, varchar } from "drizzle-orm/pg-core";

export const chatTokenSessions = pgTable("chat_token_sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  tokenNumber: varchar("token_number").notNull(),
  subject: varchar("subject").notNull(),
});
