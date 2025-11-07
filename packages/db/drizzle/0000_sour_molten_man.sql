CREATE TYPE "public"."user_role" AS ENUM('guest', 'visiter', 'hire', 'business', 'salesman', 'franchises', 'admin');--> statement-breakpoint
CREATE TYPE "public"."hire_gender" AS ENUM('Male', 'Female', 'Others');--> statement-breakpoint
CREATE TYPE "public"."hire_job_duration" AS ENUM('Day', 'Week', 'Month', 'Year');--> statement-breakpoint
CREATE TYPE "public"."hire_job_type" AS ENUM('FullTime', 'PartTime', 'Both');--> statement-breakpoint
CREATE TYPE "public"."hire_marital_status" AS ENUM('Married', 'Unmarried', 'Widowed', 'Divorced', 'Others');--> statement-breakpoint
CREATE TYPE "public"."hire_work_shift" AS ENUM('Morning', 'Evening', 'Night');--> statement-breakpoint
CREATE TYPE "public"."user_marital_status" AS ENUM('Married', 'Unmarried', 'Widowed', 'Divorced', 'Others');--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"display_name" varchar(100),
	"email" varchar(255),
	"phone_number" varchar(20),
	"password" text,
	"role" "user_role" DEFAULT 'guest' NOT NULL,
	"google_id" varchar(255),
	"created_at" timestamp DEFAULT NOW(),
	"updated_at" timestamp DEFAULT NOW()
);
--> statement-breakpoint
CREATE TABLE "business_categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"business_id" integer NOT NULL,
	"category_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "business_listings" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255),
	"photo" text,
	"specialities" text,
	"description" text,
	"home_delivery" varchar(255),
	"latitude" varchar(50),
	"longitude" varchar(50),
	"building_name" varchar(255),
	"street_name" varchar(255),
	"area" varchar(255),
	"landmark" varchar(255),
	"pincode" varchar,
	"state" integer NOT NULL,
	"city" integer NOT NULL,
	"days" varchar(255)[],
	"from_hour" varchar(255),
	"to_hour" varchar(255),
	"contact_person" varchar(255),
	"status" boolean DEFAULT true,
	"owner_number" varchar,
	"phone_number" varchar,
	"whatsapp_no" varchar,
	"email" varchar(255),
	"alternative_mobile_number" varchar,
	"facebook" varchar(255),
	"twitter" varchar(255),
	"linkedin" varchar(255),
	"listing_video" text,
	"is_feature" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "business_photos" (
	"id" serial PRIMARY KEY NOT NULL,
	"business_id" integer NOT NULL,
	"photo" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "business_reviews" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"business_id" integer NOT NULL,
	"rate" integer NOT NULL,
	"message" varchar NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "business_subcategories" (
	"id" serial PRIMARY KEY NOT NULL,
	"business_id" integer NOT NULL,
	"subcategory_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "favourites" (
	"id" serial PRIMARY KEY NOT NULL,
	"business_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "recent_view_business" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"business_id" integer NOT NULL,
	"device" varchar(255),
	"browser" varchar(255),
	"operating_system" varchar(255),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "hire_categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"hire_id" integer NOT NULL,
	"category_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "hire_listing" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	"father_name" varchar(255),
	"dob" date,
	"gender" "hire_gender" NOT NULL,
	"marital_status" "hire_marital_status" NOT NULL,
	"language" varchar(255)[] NOT NULL,
	"slug" varchar(255),
	"specialities" text,
	"description" text,
	"latitude" varchar(100),
	"longitude" varchar(100),
	"building_name" varchar(255),
	"street_name" varchar(255),
	"area" varchar(255),
	"landmark" varchar(255),
	"pincode" varchar,
	"state" integer NOT NULL,
	"city" integer NOT NULL,
	"schedules" text,
	"photo" varchar(500),
	"is_feature" boolean DEFAULT false NOT NULL,
	"status" boolean DEFAULT true NOT NULL,
	"website" varchar(255),
	"email" varchar(255),
	"mobile_number" varchar(20),
	"whatsapp_no" varchar(20),
	"alternative_mobile_number" varchar(20),
	"facebook" varchar(255),
	"twitter" varchar(255),
	"linkedin" varchar(255),
	"views" integer DEFAULT 0,
	"highest_qualification" varchar(255) NOT NULL,
	"employment_status" varchar(255),
	"work_experience_year" integer,
	"work_experience_month" integer,
	"job_role" varchar(255),
	"previous_job_role" varchar(255),
	"expertise" text,
	"skillset" text,
	"abilities" text,
	"job_type" "hire_job_type"[] NOT NULL,
	"job_duration" "hire_job_duration"[] NOT NULL,
	"location_preferred" varchar(255),
	"certificates" text,
	"work_shift" "hire_work_shift"[] NOT NULL,
	"expected_salary_from" varchar(100),
	"expected_salary_to" varchar(100),
	"preferred_working_hours" varchar(100),
	"relocate" varchar,
	"availability" varchar(255),
	"id_proof" varchar NOT NULL,
	"id_proof_photo" varchar(500),
	"resume" varchar(500),
	"resume_photo" varchar(500),
	"about_yourself" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "hire_subcategories" (
	"id" serial PRIMARY KEY NOT NULL,
	"hire_id" integer NOT NULL,
	"subcategory_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "recent_view_hire" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"hire_id" integer NOT NULL,
	"device" varchar(100),
	"browser" varchar(100),
	"operating_system" varchar(100),
	"created_at" timestamp,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "banners" (
	"id" serial PRIMARY KEY NOT NULL,
	"mysql_id" integer,
	"route" text,
	"photo" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"type" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"photo" varchar(255) NOT NULL,
	"is_popular" boolean DEFAULT false NOT NULL,
	"status" boolean DEFAULT true NOT NULL,
	"type" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cities" (
	"id" serial PRIMARY KEY NOT NULL,
	"city" varchar(255) NOT NULL,
	"state_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "states" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subcategories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"status" boolean DEFAULT true,
	"category_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "offer_photos" (
	"id" serial PRIMARY KEY NOT NULL,
	"offer_id" integer NOT NULL,
	"photo" varchar(500),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "offer_reviews" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"offer_id" integer NOT NULL,
	"name" varchar(255),
	"email" varchar(255),
	"message" varchar(1000),
	"rate" integer,
	"view" boolean DEFAULT false NOT NULL,
	"status" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "offer_subcagtegorys" (
	"id" serial PRIMARY KEY NOT NULL,
	"offer_id" integer NOT NULL,
	"subcategory_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "offers" (
	"id" serial PRIMARY KEY NOT NULL,
	"business_id" integer NOT NULL,
	"category_id" integer NOT NULL,
	"offer_name" varchar(255) NOT NULL,
	"offer_slug" varchar(255),
	"rate" integer NOT NULL,
	"discount_percent" integer,
	"final_price" integer NOT NULL,
	"offer_description" text NOT NULL,
	"offer_start_date" timestamp NOT NULL,
	"offer_end_date" timestamp NOT NULL,
	"reupload_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "recent_views_offers" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"device" text,
	"browser" text,
	"operating_system" text,
	"offer_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "plan_attributes" (
	"id" serial PRIMARY KEY NOT NULL,
	"plan_id" integer NOT NULL,
	"name" json NOT NULL,
	"is_available" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "plans" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"subtitle" varchar(255),
	"plan_type" integer,
	"price" numeric,
	"prev_price" numeric,
	"price_color" varchar(50) NOT NULL,
	"post_limit" integer,
	"product_limit" integer,
	"offer_limit" integer,
	"post_duration" integer,
	"offer_duration" integer,
	"max_offer_per_day" integer,
	"status" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "transactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"amount" numeric NOT NULL,
	"transactions_no" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_subscriptions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"subscription_number" varchar(255) NOT NULL,
	"transaction_id" integer NOT NULL,
	"plans_id" integer NOT NULL,
	"price" integer NOT NULL,
	"expiry_date" integer NOT NULL,
	"status" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "user_subscriptions_subscription_number_unique" UNIQUE("subscription_number")
);
--> statement-breakpoint
CREATE TABLE "product_photos" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer NOT NULL,
	"photo" varchar(255),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "product_reviews" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"business_id" integer NOT NULL,
	"product_id" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"message" text NOT NULL,
	"rate" integer,
	"view" boolean DEFAULT false NOT NULL,
	"status" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "product_subcategories" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer NOT NULL,
	"subcategory_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" serial PRIMARY KEY NOT NULL,
	"business_id" integer,
	"category_id" integer NOT NULL,
	"product_name" varchar(255) NOT NULL,
	"product_slug" varchar(255),
	"rate" integer NOT NULL,
	"discount_percent" integer,
	"final_price" integer,
	"product_description" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "recent_view_products" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer NOT NULL,
	"device" varchar(255),
	"browser" varchar(255),
	"operating_system" varchar(255),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "feedbacks" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"feedback_type" varchar(200)[] NOT NULL,
	"additional_feedback" text,
	"created_at" timestamp DEFAULT NOW(),
	"updated_at" timestamp DEFAULT NOW()
);
--> statement-breakpoint
CREATE TABLE "franchises" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"refer_prifixed" varchar(255) NOT NULL,
	"gst_no" varchar(50),
	"status" boolean DEFAULT true NOT NULL,
	"employee_limit" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "franchises_gst_no_unique" UNIQUE("gst_no")
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"mysql_user_id" integer,
	"profileImage" varchar(255),
	"salutation" varchar(100),
	"first_name" varchar(100),
	"last_name" varchar(100),
	"email" varchar(255),
	"dob" date,
	"occupation" varchar(100),
	"marital_status" "user_marital_status",
	"address" varchar(255),
	"pincode" varchar(10),
	"state" integer NOT NULL,
	"city" integer NOT NULL,
	"area" varchar(100),
	"created_at" timestamp DEFAULT NOW(),
	"updated_at" timestamp DEFAULT NOW()
);
--> statement-breakpoint
CREATE TABLE "request_accounts" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"reason" varchar(500) NOT NULL,
	"created_at" timestamp DEFAULT NOW(),
	"updated_at" timestamp DEFAULT NOW()
);
--> statement-breakpoint
CREATE TABLE "salesmen" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"franchise_id" integer NOT NULL,
	"refer_code" varchar(255) NOT NULL,
	"status" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "salesmen_refer_code_unique" UNIQUE("refer_code")
);
--> statement-breakpoint
ALTER TABLE "business_categories" ADD CONSTRAINT "business_categories_business_id_business_listings_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."business_listings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "business_categories" ADD CONSTRAINT "business_categories_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "business_listings" ADD CONSTRAINT "business_listings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "business_listings" ADD CONSTRAINT "business_listings_city_cities_id_fk" FOREIGN KEY ("city") REFERENCES "public"."cities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "business_photos" ADD CONSTRAINT "business_photos_business_id_business_listings_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."business_listings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "business_reviews" ADD CONSTRAINT "business_reviews_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "business_reviews" ADD CONSTRAINT "business_reviews_business_id_business_listings_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."business_listings"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "business_subcategories" ADD CONSTRAINT "business_subcategories_business_id_business_listings_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."business_listings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "business_subcategories" ADD CONSTRAINT "business_subcategories_subcategory_id_subcategories_id_fk" FOREIGN KEY ("subcategory_id") REFERENCES "public"."subcategories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "favourites" ADD CONSTRAINT "favourites_business_id_business_listings_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."business_listings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "favourites" ADD CONSTRAINT "favourites_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recent_view_business" ADD CONSTRAINT "recent_view_business_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recent_view_business" ADD CONSTRAINT "recent_view_business_business_id_business_listings_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."business_listings"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hire_categories" ADD CONSTRAINT "hire_categories_hire_id_hire_listing_id_fk" FOREIGN KEY ("hire_id") REFERENCES "public"."hire_listing"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hire_categories" ADD CONSTRAINT "hire_categories_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hire_listing" ADD CONSTRAINT "hire_listing_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hire_listing" ADD CONSTRAINT "hire_listing_city_cities_id_fk" FOREIGN KEY ("city") REFERENCES "public"."cities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hire_subcategories" ADD CONSTRAINT "hire_subcategories_hire_id_hire_listing_id_fk" FOREIGN KEY ("hire_id") REFERENCES "public"."hire_listing"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hire_subcategories" ADD CONSTRAINT "hire_subcategories_subcategory_id_subcategories_id_fk" FOREIGN KEY ("subcategory_id") REFERENCES "public"."subcategories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recent_view_hire" ADD CONSTRAINT "recent_view_hire_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recent_view_hire" ADD CONSTRAINT "recent_view_hire_hire_id_hire_listing_id_fk" FOREIGN KEY ("hire_id") REFERENCES "public"."hire_listing"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cities" ADD CONSTRAINT "cities_state_id_states_id_fk" FOREIGN KEY ("state_id") REFERENCES "public"."states"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subcategories" ADD CONSTRAINT "subcategories_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "offer_photos" ADD CONSTRAINT "offer_photos_offer_id_offers_id_fk" FOREIGN KEY ("offer_id") REFERENCES "public"."offers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "offer_reviews" ADD CONSTRAINT "offer_reviews_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "offer_reviews" ADD CONSTRAINT "offer_reviews_offer_id_offers_id_fk" FOREIGN KEY ("offer_id") REFERENCES "public"."offers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "offer_subcagtegorys" ADD CONSTRAINT "offer_subcagtegorys_offer_id_offers_id_fk" FOREIGN KEY ("offer_id") REFERENCES "public"."offers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "offer_subcagtegorys" ADD CONSTRAINT "offer_subcagtegorys_subcategory_id_subcategories_id_fk" FOREIGN KEY ("subcategory_id") REFERENCES "public"."subcategories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "offers" ADD CONSTRAINT "offers_business_id_business_listings_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."business_listings"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "offers" ADD CONSTRAINT "offers_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recent_views_offers" ADD CONSTRAINT "recent_views_offers_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recent_views_offers" ADD CONSTRAINT "recent_views_offers_offer_id_offers_id_fk" FOREIGN KEY ("offer_id") REFERENCES "public"."offers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "plan_attributes" ADD CONSTRAINT "plan_attributes_plan_id_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."plans"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_subscriptions" ADD CONSTRAINT "user_subscriptions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_subscriptions" ADD CONSTRAINT "user_subscriptions_transaction_id_transactions_id_fk" FOREIGN KEY ("transaction_id") REFERENCES "public"."transactions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_subscriptions" ADD CONSTRAINT "user_subscriptions_plans_id_plans_id_fk" FOREIGN KEY ("plans_id") REFERENCES "public"."plans"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_photos" ADD CONSTRAINT "product_photos_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_reviews" ADD CONSTRAINT "product_reviews_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_reviews" ADD CONSTRAINT "product_reviews_business_id_business_listings_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."business_listings"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_reviews" ADD CONSTRAINT "product_reviews_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_subcategories" ADD CONSTRAINT "product_subcategories_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_subcategories" ADD CONSTRAINT "product_subcategories_subcategory_id_subcategories_id_fk" FOREIGN KEY ("subcategory_id") REFERENCES "public"."subcategories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_business_id_business_listings_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."business_listings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recent_view_products" ADD CONSTRAINT "recent_view_products_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "feedbacks" ADD CONSTRAINT "feedbacks_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "franchises" ADD CONSTRAINT "franchises_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_city_cities_id_fk" FOREIGN KEY ("city") REFERENCES "public"."cities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "request_accounts" ADD CONSTRAINT "request_accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "salesmen" ADD CONSTRAINT "salesmen_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "salesmen" ADD CONSTRAINT "salesmen_franchise_id_franchises_id_fk" FOREIGN KEY ("franchise_id") REFERENCES "public"."franchises"("id") ON DELETE cascade ON UPDATE no action;