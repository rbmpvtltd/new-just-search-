import { categories } from "@repo/db/src/schema/not-related.schema";

export const categoryColumns = {
  id: categories.id,
  isPopular: categories.isPopular,
  photo: categories.photo,
  title: categories.title,
  slug: categories.slug,
  status: categories.status,
  type: categories.type,
};

export const categoryGlobalFilterColumns = [categories.title, categories.slug];
export const categoryAllowedSortColumns = [
  "id",
  "is_popular",
  "type",
  "title",
  "slug",
  "status",
];
