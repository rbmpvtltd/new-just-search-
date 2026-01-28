import { users } from "@repo/db/dist/schema/auth.schema";
import { businessListings } from "@repo/db/dist/schema/business.schema";
import {
  categories,
  cities,
  subcategories,
} from "@repo/db/dist/schema/not-related.schema";
import { offers } from "@repo/db/dist/schema/offer.schema";

export const offerColumns = {
  id: offers.id,
  phone: users.phoneNumber,
  city: cities.city,
  category: categories.title,
  subcategories: subcategories.name,
  created_at: offers.createdAt,
};

export const offerGlobalFilterColumns = [
  businessListings.name,
  offers.offerName,
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
