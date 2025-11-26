import {
  categories,
  // categories,
  subcategories,
} from "@repo/db/dist/schema/not-related.schema";

export const subCategoryColumns = {
  status: subcategories.status,
  // id: subcategories.id,
  // category: categories.title,
  // subcategory_name: subcategories.name,
  // slug: subcategories.slug,
  // status: subcategories.status,
};

export const subcategoryGlobalFilterColumns = [
  subcategories.name,
  categories.title,
];
export const subcategoryAllowedSortColumns = [
  "title",
  "name",
  "id",
  "status",
  "created_at",
];
