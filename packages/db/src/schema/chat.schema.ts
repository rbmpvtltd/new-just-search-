import {
  boolean,
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const chatSessions = pgTable("chat_sessions", {
  id: serial("id").primaryKey(),
  participantOneId: integer("participant_one_id").notNull(),
  participantTwoId: integer("participant_two_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  chatSessionId: serial("chat_session_id")
    .notNull()
    .references(() => chatSessions.id),
  senderId: integer("sender_id").notNull(),
  message: varchar("message", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  isRead: boolean("is_read").notNull().default(false),
  replyToMessageId: integer("reply_to_message_id"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const chatImages = pgTable("chat_images", {
  id: serial("id").primaryKey(),
  route: varchar("route", { length: 255 }).notNull(),
  image: varchar("image", { length: 255 }),
  chatMessageId: serial("message_id")
    .notNull()
    .references(() => chatMessages.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
