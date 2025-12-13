ALTER TABLE "transactions" RENAME TO "user_current_plan";--> statement-breakpoint
ALTER TABLE "plans" RENAME COLUMN "subtitle" TO "identifier";--> statement-breakpoint
ALTER TABLE "plans" RENAME COLUMN "plan_type" TO "role";--> statement-breakpoint
ALTER TABLE "user_subscriptions" RENAME COLUMN "transaction_id" TO "transaction_number";--> statement-breakpoint
ALTER TABLE "user_subscriptions" DROP CONSTRAINT "user_subscriptions_transaction_id_transactions_id_fk";
--> statement-breakpoint
ALTER TABLE "user_current_plan" ADD COLUMN "plan_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "user_current_plan" ADD COLUMN "user_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "user_subscriptions" ADD COLUMN "currency" varchar;--> statement-breakpoint
ALTER TABLE "user_current_plan" ADD CONSTRAINT "user_current_plan_plan_id_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."plans"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_current_plan" ADD CONSTRAINT "user_current_plan_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "plans" DROP COLUMN "prev_price";--> statement-breakpoint
ALTER TABLE "plans" DROP COLUMN "post_limit";--> statement-breakpoint
ALTER TABLE "plans" DROP COLUMN "post_duration";--> statement-breakpoint
ALTER TABLE "user_current_plan" DROP COLUMN "amount";--> statement-breakpoint
ALTER TABLE "user_current_plan" DROP COLUMN "transactions_no";