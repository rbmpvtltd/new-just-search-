import { banners } from "@repo/db/dist/schema/not-related.schema";

export const bannerColumns = {
  id: banners.id,
  route: banners.route,
  photo: banners.photo,
  is_active: banners.isActive,
  type: banners.type,
};

export const bannerGlobalFilterColumns = [banners.route];
export const bannerAllowedSortColumns = ["id", "route", "is_active", "type"];
