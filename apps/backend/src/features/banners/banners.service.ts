import { banners, db } from "@repo/db";
import { eq } from "drizzle-orm";

async function getFirstBannerData() {
  const banner1 = await db
    .select({ photo: banners.photo, id: banners.id })
    .from(banners)
    .where(eq(banners.type, 1));
  return banner1;
}

async function getSecondBannerData() {
  const banner2 = await db.select().from(banners).where(eq(banners.type, 2));
  return banner2;
}

async function getThirdBannerData() {
  const banner3 = await db.select().from(banners).where(eq(banners.type, 3));
  return banner3;
}

async function getFourthBannerData() {
  const banner4 = await db.select().from(banners).where(eq(banners.type, 4));
  return banner4;
}

export {
  getFirstBannerData,
  getSecondBannerData,
  getThirdBannerData,
  getFourthBannerData,
};
