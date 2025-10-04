import { db, schemas } from "@repo/db";
import { eq } from "drizzle-orm";

const banners = schemas.not_related.banners;

async function getBannerData(type: number) {
  const banner = await db
    .select({ photo: banners.photo, id: banners.id })
    .from(banners)
    .where(eq(banners.type, type));
  return banner;
}

export { getBannerData };
