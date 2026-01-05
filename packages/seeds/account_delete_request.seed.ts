import { db } from "@repo/db";
import { users } from "@repo/db/dist/schema/auth.schema.js";
import { account_delete_request } from "@repo/db/dist/schema/user.schema.js";
import { eq } from "drizzle-orm";
import { sql } from "./mysqldb.seed.js";

export const seedRequestAccounts = async () => {
  await db.execute(
    `TRUNCATE TABLE account_delete_request RESTART IDENTITY CASCADE;`,
  );
  await seedrequestAccounts();
};

// RequestAccounts
const seedrequestAccounts = async () => {
  const [rows]: any[] = await sql.execute("SELECT * FROM request_accounts");

  for (const row of rows) {
    const user_id = row.user_id;
    try {
      const [findUser] = await db
        .select()
        .from(users)
        .where(eq(users.id, row.user_id));
      if (!findUser) {
        continue;
      }
    } catch (error) {
      continue;
    }

    await db.insert(account_delete_request).values({
      userId: user_id,
      reason: row.reason ?? "No reason",
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    });
  }

  console.log("RequestAccounts seeding complete");
};
