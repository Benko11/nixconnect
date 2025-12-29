import { pgTable } from "drizzle-orm/pg-core";
import * as t from "drizzle-orm/pg-core";

export const colourSchemeTable = pgTable("colour_schemes", {
  id: t.serial().primaryKey(),
  name: t.varchar().unique().notNull(),
  primary: t.varchar().notNull(),
  secondary: t.varchar().notNull(),
  accent: t.varchar().notNull(),
  neutral: t.varchar().notNull(),
  foreground: t.varchar().notNull(),
  error: t.varchar().notNull(),
});
