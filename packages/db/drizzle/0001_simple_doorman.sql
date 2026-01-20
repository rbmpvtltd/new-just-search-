CREATE TABLE "hire_reviews" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"hire_id" integer NOT NULL,
	"message" varchar NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "hire_reviews" ADD CONSTRAINT "hire_reviews_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hire_reviews" ADD CONSTRAINT "hire_reviews_hire_id_hire_listing_id_fk" FOREIGN KEY ("hire_id") REFERENCES "public"."hire_listing"("id") ON DELETE no action ON UPDATE no action;