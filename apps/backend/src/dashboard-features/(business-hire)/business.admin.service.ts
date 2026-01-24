import { users } from "@repo/db/dist/schema/auth.schema";
import { businessListings } from "@repo/db/dist/schema/business.schema";
import {
  categories,
  cities,
  subcategories,
} from "@repo/db/dist/schema/not-related.schema";

export const businessColumns = {
  id: businessListings.id,
  photo: businessListings.photo,
  name: businessListings.name,
  phone: users.phoneNumber,
  city: cities.city,
  category: categories.title,
  subcategories: subcategories.name,
  status: businessListings.status,
  created_at: businessListings.createdAt,
};

export const businessGlobalFilterColumns = [
  businessListings.name,
  subcategories.name,
  categories.title,
  // cities.city,
  users.phoneNumber,
  // businessListings.city,
];
export const businessAllowedSortColumns = [
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
