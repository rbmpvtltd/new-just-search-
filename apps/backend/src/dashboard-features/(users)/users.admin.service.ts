import { users } from "@repo/db/src/schema/auth.schema";

export const usersColumns = {
  // status: subcategories.status,
  id: users.id,
  // category: categories.title,
  // subcategory_name: subcategories.name,
  // slug: subcategories.slug,
  // status: subcategories.status,
};

export const usersGlobalFilterColumns = [
  // subcategories.name, categories.title
];
export const usersAllowedSortColumns = [
  // "title",
  // "name",
  "id",
  // "status",
  // "created_at",
];
