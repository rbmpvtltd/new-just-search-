ALTER TABLE "hire_listing" RENAME COLUMN "preferred_working_hours" TO "from_hour";--> statement-breakpoint
ALTER TABLE "hire_listing" ADD COLUMN "to_hour" varchar(100);--> statement-breakpoint
ALTER TABLE "offers" ADD COLUMN "main_image" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "offers" ADD COLUMN "status" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "status" boolean DEFAULT true NOT NULL;