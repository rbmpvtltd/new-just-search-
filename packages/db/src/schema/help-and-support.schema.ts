import {
  boolean,
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import z from "zod";
import { sendByRoleEnum } from "../enum/allEnum.enum";

export const chatTokenSessions = pgTable("chat_token_sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  tokenNumber: varchar("token_number").notNull(),
  subject: varchar("subject").notNull(),
  status: integer("status").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const chatTokenMessages = pgTable("chat_token_messages", {
  id: serial("id").primaryKey(),
  chatTokenSessionsId: serial("chat_token_sessions_id")
    .notNull()
    .references(() => chatTokenSessions.id),
  sendByRole: sendByRoleEnum("send_by_role").notNull(),
  message: varchar("message").notNull(),
  isRead: boolean("is_read").notNull().default(false),
  image: varchar("image"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const chatTokenSessionInsertSchema = createInsertSchema(
  chatTokenSessions,
  {
    subject: () => z.string().min(1, "Subject is required"),
  },
)
  .omit({
    status: true,
    tokenNumber: true,
    userId: true,
  })
  .extend({
    message: z.string().min(1, "Subject is required"),
  });
