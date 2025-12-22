CREATE TABLE "pronouns" (
	"id" serial PRIMARY KEY NOT NULL,
	"word" varchar(8),
	"master_pronoun_id" integer
);
--> statement-breakpoint
ALTER TABLE "pronouns" ADD CONSTRAINT "pronouns_master_pronoun_id_pronouns_id_fk" FOREIGN KEY ("master_pronoun_id") REFERENCES "public"."pronouns"("id") ON DELETE set null ON UPDATE cascade;