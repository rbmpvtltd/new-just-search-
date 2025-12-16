ALTER TABLE "user_current_plan" RENAME TO "plan_user_active";--> statement-breakpoint
ALTER TABLE "user_subscriptions" RENAME TO "plan_user_subscriptions";--> statement-breakpoint
ALTER TABLE "plan_user_subscriptions" DROP CONSTRAINT "user_subscriptions_subscription_number_unique";--> statement-breakpoint
ALTER TABLE "plan_user_active" DROP CONSTRAINT "user_current_plan_plan_id_plans_id_fk";
--> statement-breakpoint
ALTER TABLE "plan_user_active" DROP CONSTRAINT "user_current_plan_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "plan_user_subscriptions" DROP CONSTRAINT "user_subscriptions_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "plan_user_subscriptions" DROP CONSTRAINT "user_subscriptions_plans_id_plans_id_fk";
--> statement-breakpoint
ALTER TABLE "plan_user_active" ADD CONSTRAINT "plan_user_active_plan_id_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."plans"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "plan_user_active" ADD CONSTRAINT "plan_user_active_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "plan_user_subscriptions" ADD CONSTRAINT "plan_user_subscriptions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "plan_user_subscriptions" ADD CONSTRAINT "plan_user_subscriptions_plans_id_plans_id_fk" FOREIGN KEY ("plans_id") REFERENCES "public"."plans"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "plan_user_subscriptions" ADD CONSTRAINT "plan_user_subscriptions_subscription_number_unique" UNIQUE("subscription_number");