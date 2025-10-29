import {
  categories,
  subcategories,
} from "@repo/db/src/schema/not-related.schema";

export const categoryColumns = {
  id: subcategories.id,
  category: categories.title,
  subcategory_name: subcategories.name,
  slug: subcategories.slug,
  status: subcategories.status,
};

export const subcategoryGlobalFilterColumns = [
  categories.title,
  subcategories.name,
];
export const subcategoryAllowedSortColumns = ["id", "title", "slug", "status"];
