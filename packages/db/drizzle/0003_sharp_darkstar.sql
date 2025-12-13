CREATE TYPE "public"."plan_period" AS ENUM('daily', 'weekly', 'monthly', 'yearly');--> statement-breakpoint
ALTER TABLE "plans" ADD COLUMN "period" "plan_period" NOT NULL;--> statement-breakpoint
ALTER TABLE "plans" ADD COLUMN "interval" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "user_subscriptions" ADD COLUMN "plan_identifier" varchar(255);