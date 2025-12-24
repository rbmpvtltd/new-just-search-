import { logger } from "@repo/logger";
import type { Request, Response } from "express";
import env from "@/utils/envaild";
export const revenueCatRouter = (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (token !== env.REVENUECAT_TOKEN)
    return res.status(401).json({ error: "Unauthorized" });
  logger.info("revenueCatRouter", { body: req.body });
  return res.send("revenueCatRouter");
};
