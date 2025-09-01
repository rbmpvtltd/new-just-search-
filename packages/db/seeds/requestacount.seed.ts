import { eq } from "drizzle-orm";
import { db } from "../index";
import { users } from "@/features/auth/auth.model";
import { request_accounts } from "@/features/user/user.model";
import { sql } from "./mysqldb";

export const seedRequestAccounts = async () => {
  await db.execute(`TRUNCATE TABLE request_accounts RESTART IDENTITY CASCADE;`);
  await seedrequestAccounts();
};

// RequestAccounts
const seedrequestAccounts = async () => {
  const [rows]: any[] = await sql.execute("SELECT * FROM request_accounts");

  for (const row of rows) {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, row.user_id));

    if (!user) {
      console.log(`User not found  for request_accounts ${row.id}`);
      continue;
    }
    await db.insert(request_accounts).values({
      userId: user.id,
      reason: row.reason ?? "No reason",
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    });
  }

  console.log("RequestAccounts seeding complete");
};
