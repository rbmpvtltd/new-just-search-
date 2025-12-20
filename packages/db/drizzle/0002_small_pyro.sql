ALTER TABLE "push_tokens" DROP CONSTRAINT "push_tokens_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "push_tokens" ALTER COLUMN "token" SET DATA TYPE varchar(512);--> statement-breakpoint
ALTER TABLE "push_tokens" ADD COLUMN "device_id" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "push_tokens" ADD COLUMN "platform" varchar(20) NOT NULL;--> statement-breakpoint
ALTER TABLE "push_tokens" ADD COLUMN "last_active_at" timestamp with time zone DEFAULT now();--> statement-breakpoint
ALTER TABLE "push_tokens" ADD CONSTRAINT "push_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "uniq_device_token" ON "push_tokens" USING btree ("device_id","token");