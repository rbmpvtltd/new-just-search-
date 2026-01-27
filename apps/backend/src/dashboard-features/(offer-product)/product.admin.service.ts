import { businessListings } from "@repo/db/dist/schema/business.schema";
import { products } from "@repo/db/dist/schema/product.schema";

export const productColumns = {
  id: products.id,
  created_at: products.createdAt,
};

export const productGlobalFilterColumns = [
  businessListings.name,
  products.productName,
];
export const productAllowedSortColumns = ["id", "name", "status", "created_at"];
