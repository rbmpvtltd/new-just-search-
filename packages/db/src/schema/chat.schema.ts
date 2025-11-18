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

export const productChat = pgTable("product_chat", {
  id: serial("id").primaryKey(),
  route: varchar("route", { length: 255 }).notNull(),
  imageLink: varchar("image_link", { length: 255 }),
  messageId: serial("message_id")
    .notNull()
    .references(() => messages.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
