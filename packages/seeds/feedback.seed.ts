// import { db } from "@repo/db";
import { db } from "@repo/db";
import { users } from "@repo/db/dist/schema/auth.schema";
import { feedbacks } from "@repo/db/dist/schema/user.schema";
import { eq } from "drizzle-orm";
import { fakeUserSeed } from "./fake.seed";
import { sql } from "./mysqldb.seed";

export const feedbackseed = async () => {
  await db.execute(`TRUNCATE TABLE feedbacks RESTART IDENTITY CASCADE;`);
  await seedFeedbacks();
};

// feedback
const seedFeedbacks = async () => {
  const [rows]: any[] = await sql.execute("SELECT * FROM feedback");
  for (const row of rows) {
    const [user]: any[] = await sql.execute(
      "SELECT * FROM users WHERE id = ?",
      [row.user_id],
    );

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

    if (!user) {
      console.log(`User not found for feedback ${row.id}`);
      continue;
    }

    const feedbackType = row.feedback_type
      .split(",")
      .filter((item: string) => item.length > 0);
    try {
      await db.insert(feedbacks).values({
        userId: user_id,
        feedbackType,
        additionalFeedback: row.additional_feedback ?? null,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      });
    } catch (e: any) {
      console.log("message is", e.message);
      console.log(`Error seeding feedback ${row.id}`);
    }
  }
  console.log("Feedback seeding complete");
};
