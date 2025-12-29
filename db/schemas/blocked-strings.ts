import { pgTable } from "drizzle-orm/pg-core";
import * as t from "drizzle-orm/pg-core";
import { hasTimestamps } from "../helpers";

export const blockedStringsTable = pgTable("blocked_strings", {
  id: t.uuid().primaryKey().defaultRandom(),
  modelName: t.varchar().notNull(),
  columnName: t.varchar().notNull(),
  phrase: t.varchar().notNull(),
  ...hasTimestamps,
});
