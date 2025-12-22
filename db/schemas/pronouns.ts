import { relations } from "drizzle-orm";
import { pgTable } from "drizzle-orm/pg-core";
import * as t from "drizzle-orm/pg-core";
import { usersTable } from "./users";

export const pronounsTable = pgTable("pronouns", {
  id: t.serial().primaryKey(),
  word: t.varchar({ length: 8 }),
  masterPronounId: t.integer().references(() => pronounsTable.id, {
    onUpdate: "cascade",
    onDelete: "set null",
  }),
});

export const pronounsRelations = relations(pronounsTable, ({ many }) => ({
  masterPronounId: many(pronounsTable),
}));

export const masterPronounsRelations = relations(pronounsTable, ({ one }) => ({
  masterPronoun: one(pronounsTable, {
    fields: [pronounsTable.masterPronounId],
    references: [pronounsTable.id],
  }),
}));
