import { sql } from "drizzle-orm";
import { db } from ".";
import { notification } from "./schema/user.schema";

const where = undefined;
const data = await db
  .select({
    // id: sql`min(${notification.id})`.as("id"),
    notificationId: notification.notificationId,
    title: notification.title,
    description: notification.description,
    status: notification.status,
    // created_at: notification.createdAt,
    role: sql<string>`string_agg(DISTINCT ${notification.role}::text, ', ' ORDER BY ${notification.role}::text)`.as(
      "role",
    ),
  })
  .from(notification)
  .where(where)
  // .orderBy(orderBy)
  .groupBy(
    notification.notificationId,
    notification.title,
    notification.description,
    notification.status,
    // notification.createdAt,
  )
  .limit(10)
  .offset(0);
console.log(data);
