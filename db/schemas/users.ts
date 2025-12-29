import { pgSchema } from "drizzle-orm/pg-core";
import * as t from "drizzle-orm/pg-core";
import { gendersTable } from "./genders";
import { defineRelations } from "drizzle-orm";

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
    onDelete: "set null",
  }),
});

export const relations = defineRelations({ usersTable, gendersTable }, (r) => ({
  usersTable: {
    gender: r.one.gendersTable({
      from: r.usersTable.genderId,
      to: r.gendersTable.id,
    }),
  },
  gendersTable: {
    users: r.many.usersTable({
      from: r.gendersTable.id,
      to: r.usersTable.genderId,
    }),
  },
}));
