// import { db } from "@repo/db";
import { db } from "@repo/db";
import { feedbacks } from "../db/src/schema/user.schema";
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

    if (!user) {
      console.log(`User not found for feedback ${row.id}`);
      continue;
    }

    try {
      await db.insert(feedbacks).values({
        id: row.id,
        userId: row.user_id,
        feedbackType: row.feedback_type ?? "No type",
        additionalFeedback: row.additional_feedback ?? null,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      });
    } catch (e: any) {
      console.log(`Error seeding feedback ${row.id}`);
    }
  }
  console.log("Feedback seeding complete");
};
