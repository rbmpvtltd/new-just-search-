import { and, eq, ilike } from "drizzle-orm";
import { db } from ".";
import { businessListings } from "./schema/business.schema";
import { offers } from "./schema/offer.schema";

const data = await db
  .select({
    id: offers.id,
    photo: offers.mainImage,
    offer_name: offers.offerName,
    name: businessListings.name,
    status: offers.status,
    expired_at: offers.offerEndDate,
    created_at: offers.createdAt,
  })
  .from(offers)
  .leftJoin(businessListings, eq(businessListings.id, offers.businessId))
  .where(and(ilike(businessListings.name, "%inder%")))
  .limit(4)
  .offset(0);

console.log(data);
