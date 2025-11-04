ALTER TABLE "business_listings" ADD COLUMN "day" varchar(255)[];--> statement-breakpoint
ALTER TABLE "business_listings" ADD COLUMN "from_hour" varchar(255);--> statement-breakpoint
ALTER TABLE "business_listings" ADD COLUMN "to_hour" varchar(255);--> statement-breakpoint
ALTER TABLE "business_listings" DROP COLUMN "schedules";