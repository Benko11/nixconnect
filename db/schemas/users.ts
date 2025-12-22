import { pgSchema } from "drizzle-orm/pg-core";
import * as t from "drizzle-orm/pg-core";
import { gendersTable } from "./genders";
import { relations } from "drizzle-orm";

export const authSchema = pgSchema("auth");

export const usersTable = authSchema.table("users", {
  id: t.uuid().primaryKey().defaultRandom(),
  nickname: t.varchar().unique().notNull(),
  email: t.varchar().unique().notNull(),
  name: t.varchar(),
  lastName: t.varchar(),
  password: t.varchar().notNull(),
  genderId: t.integer().references(() => gendersTable.id, {
    onUpdate: "cascade",
    onDelete: "cascade",
  }),
});

export const usersRelations = relations(usersTable, ({ one }) => ({
  gender: one(gendersTable, {
    fields: [usersTable.genderId],
    references: [gendersTable.id],
  }),
}));
