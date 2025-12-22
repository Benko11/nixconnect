import { pgTable as table } from "drizzle-orm/pg-core";
import * as t from "drizzle-orm/pg-core";

export const gendersTable = table("genders", {
  id: t.serial().primaryKey(),
  name: t.varchar().unique().notNull(),
  description: t.varchar(),
});
