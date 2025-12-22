CREATE TABLE "colour_schemes" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"primary" varchar NOT NULL,
	"secondary" varchar NOT NULL,
	"accent" varchar NOT NULL,
	"neutral" varchar NOT NULL,
	"foreground" varchar NOT NULL,
	"error" varchar NOT NULL,
	CONSTRAINT "colour_schemes_name_unique" UNIQUE("name")
);
