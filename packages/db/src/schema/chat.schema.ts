import {
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const conversations = pgTable("conversations", {
  id: serial("id").primaryKey(),
  participantOneId: integer("participant_one_id").notNull(),
  participantTwoId: integer("participant_two_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  conversationId: serial("conversation_id")
    .notNull()
    .references(() => conversations.id),
  senderId: integer("sender_id").notNull(),
  message: varchar("message", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
