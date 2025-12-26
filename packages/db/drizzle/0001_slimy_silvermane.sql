CREATE TABLE "push_tokens" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"token" varchar(512) NOT NULL,
	"device_id" varchar(255) NOT NULL,
	"platform" varchar(20) NOT NULL,
	"last_active_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "push_tokens_device_id_unique" UNIQUE("device_id")
);
--> statement-breakpoint
ALTER TABLE "push_tokens" ADD CONSTRAINT "push_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "uniq_device_token" ON "push_tokens" USING btree ("device_id","token");