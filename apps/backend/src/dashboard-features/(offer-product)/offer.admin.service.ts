import { users } from "@repo/db/src/schema/auth.schema";
import {
  categories,
  cities,
  subcategories,
} from "@repo/db/src/schema/not-related.schema";
import { offers } from "@repo/db/src/schema/offer.schema";

export const offerColumns = {
  id: offers.id,
  photo: offers.,
  name: offers.name,
  phone: users.phoneNumber,
  city: cities.city,
  category: categories.title,
  subcategories: subcategories.name,
  status: offers.status,
  created_at: offers.createdAt,
};

export const offerGlobalFilterColumns = [
  offers.name,
  subcategories.name,
  categories.title,
  users.phoneNumber,
];
export const offerAllowedSortColumns = [
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
