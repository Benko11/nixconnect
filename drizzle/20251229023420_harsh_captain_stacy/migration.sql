CREATE SCHEMA "posts";
--> statement-breakpoint
CREATE SCHEMA "auth";
--> statement-breakpoint
CREATE TYPE "auth"."type" AS ENUM('url', 'raw');--> statement-breakpoint
CREATE TABLE "auth"."login_activities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" uuid NOT NULL,
	"did_succeed" boolean NOT NULL,
	"ip" varchar NOT NULL,
	"user_agent" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "posts"."posts_files" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"post_id" uuid NOT NULL,
	"mimetype" varchar NOT NULL,
	"size" integer NOT NULL,
	"content" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "posts"."posts_pings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"post_id" uuid NOT NULL,
	"author_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "posts"."posts" (
	"id" uuid PRIMARY KEY,
	"author_id" uuid NOT NULL,
	"content" text,
	"main_post_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "pronoun_user" (
	"user_id" uuid,
	"pronoun_id" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "pronoun_user_pkey" PRIMARY KEY("user_id","pronoun_id")
);
--> statement-breakpoint
CREATE TABLE "searches" (
	"id" serial PRIMARY KEY,
	"query" varchar,
	"author_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "auth"."users_avatars" (
	"id" serial PRIMARY KEY,
	"user_id" uuid NOT NULL,
	"type" "auth"."type",
	"is_active" boolean DEFAULT false NOT NULL,
	"url" varchar,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "url_type_check" CHECK (("type" = 'raw' AND "url" IS NULL) OR ("type" = 'url' AND "url" IS NOT NULL)  )
);
--> statement-breakpoint
CREATE TABLE "auth"."user_preference" (
	"preference_name" varchar,
	"user_id" uuid,
	"value" varchar,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	CONSTRAINT "user_preference_pkey" PRIMARY KEY("preference_name","user_id")
);
--> statement-breakpoint
CREATE TABLE "users_bans" (
	"id" serial PRIMARY KEY,
	"user_id" uuid NOT NULL,
	"banned_from" timestamp NOT NULL,
	"banned_to" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "auth"."users_blocks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"blocker_id" uuid NOT NULL,
	"blocked_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "auth"."users_facts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" uuid NOT NULL,
	"category" varchar NOT NULL,
	"value" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "genders" (
	"id" serial PRIMARY KEY,
	"name" varchar NOT NULL UNIQUE,
	"description" varchar
);
--> statement-breakpoint
CREATE TABLE "auth"."users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"nickname" varchar NOT NULL UNIQUE,
	"email" varchar NOT NULL UNIQUE,
	"name" varchar,
	"last_name" varchar,
	"password" varchar NOT NULL,
	"gender_id" integer
);
--> statement-breakpoint
CREATE TABLE "pronouns" (
	"id" serial PRIMARY KEY,
	"word" varchar(8),
	"group" integer NOT NULL,
	"order" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "colour_schemes" (
	"id" serial PRIMARY KEY,
	"name" varchar NOT NULL UNIQUE,
	"primary" varchar NOT NULL,
	"secondary" varchar NOT NULL,
	"accent" varchar NOT NULL,
	"error" varchar NOT NULL,
	"neutral" varchar NOT NULL,
	"foreground" varchar NOT NULL,
	"description" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "preferences" (
	"name" varchar(36) PRIMARY KEY UNIQUE,
	"description" text NOT NULL,
	"default_value" varchar
);
--> statement-breakpoint
CREATE TABLE "blocked_strings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"model_name" varchar NOT NULL,
	"column_name" varchar NOT NULL,
	"phrase" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "auth"."banned_ips" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"ip_address" varchar(32),
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE UNIQUE INDEX "unique_active_avatar" ON "auth"."users_avatars" ("user_id") WHERE "is_active" = true;--> statement-breakpoint
CREATE UNIQUE INDEX "one_master_per_group" ON "pronouns" ("group") WHERE "order" = 0;--> statement-breakpoint
ALTER TABLE "auth"."login_activities" ADD CONSTRAINT "login_activities_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");--> statement-breakpoint
ALTER TABLE "posts"."posts_files" ADD CONSTRAINT "posts_files_post_id_posts_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"."posts"("id");--> statement-breakpoint
ALTER TABLE "posts"."posts_pings" ADD CONSTRAINT "posts_pings_post_id_posts_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"."posts"("id");--> statement-breakpoint
ALTER TABLE "posts"."posts_pings" ADD CONSTRAINT "posts_pings_author_id_users_id_fkey" FOREIGN KEY ("author_id") REFERENCES "auth"."users"("id");--> statement-breakpoint
ALTER TABLE "posts"."posts" ADD CONSTRAINT "posts_author_id_users_id_fkey" FOREIGN KEY ("author_id") REFERENCES "auth"."users"("id");--> statement-breakpoint
ALTER TABLE "posts"."posts" ADD CONSTRAINT "posts_main_post_id_posts_id_fkey" FOREIGN KEY ("main_post_id") REFERENCES "posts"."posts"("id");--> statement-breakpoint
ALTER TABLE "pronoun_user" ADD CONSTRAINT "pronoun_user_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");--> statement-breakpoint
ALTER TABLE "pronoun_user" ADD CONSTRAINT "pronoun_user_pronoun_id_pronouns_id_fkey" FOREIGN KEY ("pronoun_id") REFERENCES "pronouns"("id");--> statement-breakpoint
ALTER TABLE "searches" ADD CONSTRAINT "searches_author_id_users_id_fkey" FOREIGN KEY ("author_id") REFERENCES "auth"."users"("id");--> statement-breakpoint
ALTER TABLE "auth"."users_avatars" ADD CONSTRAINT "users_avatars_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");--> statement-breakpoint
ALTER TABLE "auth"."user_preference" ADD CONSTRAINT "user_preference_preference_name_preferences_name_fkey" FOREIGN KEY ("preference_name") REFERENCES "preferences"("name");--> statement-breakpoint
ALTER TABLE "auth"."user_preference" ADD CONSTRAINT "user_preference_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");--> statement-breakpoint
ALTER TABLE "users_bans" ADD CONSTRAINT "users_bans_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");--> statement-breakpoint
ALTER TABLE "auth"."users_blocks" ADD CONSTRAINT "users_blocks_blocker_id_users_id_fkey" FOREIGN KEY ("blocker_id") REFERENCES "auth"."users"("id");--> statement-breakpoint
ALTER TABLE "auth"."users_blocks" ADD CONSTRAINT "users_blocks_blocked_id_users_id_fkey" FOREIGN KEY ("blocked_id") REFERENCES "auth"."users"("id");--> statement-breakpoint
ALTER TABLE "auth"."users_facts" ADD CONSTRAINT "users_facts_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");--> statement-breakpoint
ALTER TABLE "auth"."users" ADD CONSTRAINT "users_gender_id_genders_id_fkey" FOREIGN KEY ("gender_id") REFERENCES "genders"("id") ON DELETE SET NULL ON UPDATE CASCADE;