import { logger } from "@repo/logger";
import type { Request, Response } from "express";
import env from "@/utils/envaild";
import type { RevenueCatWebhookEvent } from "./types";
export const revenueCatRouter = (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (token !== env.REVENUECAT_TOKEN)
    return res.status(401).json({ error: "Unauthorized" });
  const body = req.body as RevenueCatWebhookEvent;
  const { event } = body;

  switch (event.type) {
    case "INITIAL_PURCHASE":
      // Logic for new subscriber
      break;
    case "EXPIRATION":
      // Logic for removing access
      break;
    default:
      console.log("Unhandled event type:", event.type);
  }

  logger.info("revenueCatRouter", { body: body });
  return res.send("revenueCatRouter");
};
