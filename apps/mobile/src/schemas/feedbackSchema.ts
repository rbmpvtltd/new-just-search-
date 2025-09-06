import { z } from "zod";

export const feedbackSchema = z.object({
  feedback_type: z.string().min(1, "Please select at least one option"),
  additional_feedback: z.string().optional(),
});

export type FeedbackData = z.infer<typeof feedbackSchema>;
