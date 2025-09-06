import { z } from "zod";

export const deleteReqSchema = z.object({
  reason: z
    .string()
    .min(12, "Message For Reason To Delete Account Must Be 12")
    .max(500, "!Ooops... Message Is Too Long"),
});

export type DeleteReqData = z.infer<typeof deleteReqSchema>;
