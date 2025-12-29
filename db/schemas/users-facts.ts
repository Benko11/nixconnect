import { defineRelations } from "drizzle-orm";
import { softDeletes } from "../helpers";
import { authSchema, usersTable } from "./users";
import * as t from "drizzle-orm/pg-core";

export const usersFactsTable = authSchema.table("users_facts", {
  id: t.uuid().primaryKey().defaultRandom(),
  userId: t
    .uuid()
    .notNull()
    .references(() => usersTable.id),
  category: t.varchar().notNull(),
  value: t.varchar().notNull(),
  ...softDeletes,
});

export const relations = defineRelations(
  { usersFactsTable, usersTable },
  (r) => ({
    usersTable: {
      facts: r.many.usersFactsTable({
        from: r.usersTable.id,
        to: r.usersFactsTable.userId,
      }),
    },

    usersFactsTable: {
      user: r.one.usersTable({
        from: r.usersFactsTable.userId,
        to: r.usersTable.id,
      }),
    },
  })
);
