CREATE TABLE "pronoun_user" (
	"user_id" uuid NOT NULL,
	"pronoun_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "pronoun_user_pronoun_id_user_id_pk" PRIMARY KEY("pronoun_id","user_id")
);
--> statement-breakpoint
ALTER TABLE "pronoun_user" ADD CONSTRAINT "pronoun_user_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pronoun_user" ADD CONSTRAINT "pronoun_user_pronoun_id_pronouns_id_fk" FOREIGN KEY ("pronoun_id") REFERENCES "public"."pronouns"("id") ON DELETE no action ON UPDATE no action;