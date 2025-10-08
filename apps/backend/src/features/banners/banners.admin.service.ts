import { schemas } from "@repo/db"; // assuming this is a PgTable

const banners = schemas.not_related.banners;

export const bannerColumns = {
  id: banners.id,
  route: banners.route,
  photo: banners.photo,
  is_active: banners.isActive, // JS key maps to DB column
  type: banners.type,
};

export const bannerGlobalFilterColumns = [banners.photo, banners.route];
export const bannerAllowedSortColumns = [
  "id",
  "route",
  "photo",
  "is_active",
  "type",
];
