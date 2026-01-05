ALTER TABLE "business_listings" RENAME COLUMN "area" TO "address";--> statement-breakpoint
ALTER TABLE "hire_listing" RENAME COLUMN "area" TO "address";--> statement-breakpoint
ALTER TABLE "hire_listing" DROP COLUMN "views";--> statement-breakpoint
ALTER TABLE "product_reviews" DROP COLUMN "view";