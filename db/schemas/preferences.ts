import { pgTable } from "drizzle-orm/pg-core";
import * as t from "drizzle-orm/pg-core";

export const preferencesTable = pgTable("preferences", {
  name: t.varchar({ length: 36 }).primaryKey().unique(),
  description: t.text().notNull(),
  defaultValue: t.varchar(),
});
