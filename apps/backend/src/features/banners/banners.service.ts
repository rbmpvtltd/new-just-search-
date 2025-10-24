import { db, schemas } from "@repo/db";
import { banners } from "@repo/db/src/schema/not-related.schema";
import { logger } from "@repo/helper";
import { eq, sql } from "drizzle-orm";


async function getBannerData(type: number) {
  logger.info("hire2")
  const banner = await db
  .select({ photo: banners.photo, id: banners.id })
  .from(banners)
  .where(eq(banners.type, type));
  
  logger.info("banner is",banner)
  return banner;
}

export { getBannerData };
