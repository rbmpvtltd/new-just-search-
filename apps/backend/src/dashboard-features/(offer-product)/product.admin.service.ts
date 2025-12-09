import { users } from "@repo/db/dist/schema/auth.schema";
import {
  categories,
  cities,
  subcategories,
} from "@repo/db/dist/schema/not-related.schema";
import { products } from "@repo/db/dist/schema/product.schema";

export const productColumns = {
  id: products.id,
  // photo: offers.,
  // name: offers.name,
  phone: users.phoneNumber,
  city: cities.city,
  category: categories.title,
  subcategories: subcategories.name,
  // status: offers.status,
  created_at: products.createdAt,
};

export const productGlobalFilterColumns = [
  // offers.name,
  subcategories.name,
  categories.title,
  users.phoneNumber,
];
export const productAllowedSortColumns = [
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
