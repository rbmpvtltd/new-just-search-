ALTER TABLE "plan_attributes" ALTER COLUMN "name" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "plans" ADD COLUMN "features" jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "user_current_plan" ADD COLUMN "features" jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "user_subscriptions" ADD COLUMN "features" jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "plans" DROP COLUMN "product_limit";--> statement-breakpoint
ALTER TABLE "plans" DROP COLUMN "offer_limit";--> statement-breakpoint
ALTER TABLE "plans" DROP COLUMN "offer_duration";--> statement-breakpoint
ALTER TABLE "plans" DROP COLUMN "max_offer_per_day";