import { sql } from "drizzle-orm";
import { db } from ".";
import { notification } from "./schema/user.schema";

const data = await db
  .select({
    notificationId: notification.notificationId,
    role: sql<string>`STRING_AGG(DISTINCT ${notification.role}::text, ', ')`.as(
      "notification_role",
    ),
  })
  .from(notification)
  .groupBy(notification.notificationId)
  .limit(10);
console.log(data);
