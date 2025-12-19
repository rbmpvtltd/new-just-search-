ALTER TABLE "plans" RENAME COLUMN "identifier" TO "razor_pay_identifier";--> statement-breakpoint
ALTER TABLE "plans" ADD COLUMN "revenue_cat_identifier" varchar(255);--> statement-breakpoint
ALTER TABLE "banners" DROP COLUMN "mysql_id";--> statement-breakpoint
ALTER TABLE "profiles" DROP COLUMN "mysql_user_id";