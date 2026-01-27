import { businessListings } from "@repo/db/dist/schema/business.schema";
import { offers } from "@repo/db/dist/schema/offer.schema";

export const offerColumns = {
  id: offers.id,
  created_at: offers.createdAt,
};

export const offerGlobalFilterColumns = [
  businessListings.name,
  offers.offerName,
];
export const offerAllowedSortColumns = ["id", "name", "status", "created_at"];
