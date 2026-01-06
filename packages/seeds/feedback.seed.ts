import { db } from "@repo/db";
import { feedbacks } from "@repo/db/dist/schema/user.schema";
import { sql } from "./mysqldb.seed";

export const feedbackseed = async () => {
  await db.execute(`TRUNCATE TABLE feedbacks RESTART IDENTITY CASCADE;`);
  await seedFeedbacks();
};

// Helper function to ensure array values for feedbackType
const ensureArray = (value: any): string[] => {
  if (value === null || value === undefined || value === "") {
    return ["No type"]; // Default value as array
  }
  if (Array.isArray(value)) {
    return value.map(String); // Ensure all elements are strings
  }
  if (typeof value === "string") {
    // Check if it's a JSON string
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed.map(String) : [value];
    } catch {
      // If parsing fails, check if it's comma-separated
      if (value.includes(",")) {
        return value.split(",").map((s) => s.trim());
      }
      // Otherwise wrap in array
      return [value];
    }
  }
  // For any other type, convert to string and wrap in array
  return [String(value)];
};

// feedback
const seedFeedbacks = async () => {
  const [rows]: any[] = await sql.execute(
    "SELECT * FROM feedback",
    // " where id = 10",
  );

  let successCount = 0;
  let errorCount = 0;

  for (const row of rows) {
    const [userResult]: any[] = await sql.execute(
      "SELECT * FROM users WHERE id = ?",
      [row.user_id],
    );

    if (!userResult || userResult.length === 0) {
      console.log(`User not found for feedback ${row.id}`);
      errorCount++;
      continue;
    }

    try {
      const feedbackData = {
        id: row.id,
        userId: row.user_id,
        // feedbackType MUST be an array (as per schema)
        feedbackType: ensureArray(row.feedback_type),
        // additionalFeedback is just text (not an array)
        additionalFeedback: row.additional_feedback ?? null,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      };
      console.log("feedbackData", feedbackData);
      await db.insert(feedbacks).values(feedbackData);
      successCount++;
      console.log(`✓ Seeded feedback ${row.id}`);
    } catch (e: any) {
      errorCount++;
      console.log(`✗ Error seeding feedback ${row.id}:`, e.message);
      console.log(`  feedbackType value:`, row.feedback_type);
      console.log(`  feedbackType type:`, typeof row.feedback_type);
      console.log(`  Converted to:`, ensureArray(row.feedback_type));
    }
  }

  console.log("\n=== Feedback Seeding Summary ===");
  console.log(`Total processed: ${rows.length}`);
  console.log(`Successful: ${successCount}`);
  console.log(`Failed: ${errorCount}`);
  console.log("================================\n");
};
