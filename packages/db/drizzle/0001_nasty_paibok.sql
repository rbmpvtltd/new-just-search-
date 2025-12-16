ALTER TABLE "users" ADD COLUMN "apple_id" varchar(255);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "revanue_cat_id" uuid DEFAULT gen_random_uuid();