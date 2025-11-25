import { users } from "@repo/db/dist/schema/auth.schema";
import { hireListing } from "@repo/db/dist/schema/hire.schema";
import {
  categories,
  cities,
  subcategories,
} from "@repo/db/dist/schema/not-related.schema";

export const hireColumns = {
  id: hireListing.id,
  photo: hireListing.photo,
  name: hireListing.name,
  phone: users.phoneNumber,
  city: cities.city,
  category: categories.title,
  subcategories: subcategories.name,
  status: hireListing.status,
  created_at: hireListing.createdAt,
};

export const hireGlobalFilterColumns = [
  hireListing.name,
  subcategories.name,
  categories.title,
  users.phoneNumber,
];
export const hireAllowedSortColumns = [
  "id",
  "photo",
  "name",
  "phone",
  "city",
  "category",
  "subcategories",
  "status",
  "created_at",
];
