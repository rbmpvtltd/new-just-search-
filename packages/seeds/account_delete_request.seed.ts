import { db } from "@repo/db";
import { account_delete_request } from "@repo/db/dist/schema/user.schema.js";
import { users } from "@repo/db/src/schema/auth.schema.js";
import { eq } from "drizzle-orm";
import { fakeUserSeed } from "./fake.seed.js";
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
    let user_id = row.user_id;
    const fakeUser = await fakeUserSeed();
    try {
      const [findUser] = await db
        .select()
        .from(users)
        .where(eq(users.id, row.user_id));
      if (!findUser) {
        user_id = fakeUser?.id;
        console.log("failed to find user", row.user_id);
      }
    } catch (error) {
      user_id = fakeUser?.id;
      console.log("error is", error.message);
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
