DROP TYPE "public"."notification_enum";--> statement-breakpoint
CREATE TYPE "public"."notification_enum" AS ENUM('guest', 'visitor', 'hire', 'business', 'salesman', 'franchises', 'admin', 'all');--> statement-breakpoint
DROP TYPE "public"."user_role";--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('guest', 'visitor', 'hire', 'business', 'salesman', 'franchises', 'admin', 'all');