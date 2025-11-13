import { feedbacks } from "@repo/db/src/schema/user.schema";

export const feedbackColumns = {
  id: feedbacks.id,
  feedback_type: feedbacks.feedbackType,
  additional_feedback: feedbacks.additionalFeedback,
  created_at: feedbacks.createdAt,
};

export const feedbackGlobalFilterColumns = [
  feedbacks.additionalFeedback,
  // feedbacks.feedbackType,
];
export const feedbackAllowedSortColumns = [
  "user_id",
  "feedback_type",
  "additional_feedback",
  "created_at",
  "id",
];
