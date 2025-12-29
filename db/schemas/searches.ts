import { pgTable } from "drizzle-orm/pg-core";
import * as t from "drizzle-orm/pg-core";
import { usersTable } from "./users";
import { creatable } from "../helpers";
import { defineRelations } from "drizzle-orm";

export const searchesTable = pgTable("searches", {
  id: t.serial().primaryKey(),
  query: t.varchar(),
  authorId: t.uuid().references(() => usersTable.id),
  ...creatable,
});

export const relations = defineRelations(
  { searchesTable, usersTable },
  (r) => ({
    usersTable: {
      searches: r.many.searchesTable({
        from: r.usersTable.id,
        to: r.searchesTable.authorId,
      }),
    },

    searchesTable: {
      author: r.one.usersTable({
        from: r.searchesTable.authorId,
        to: r.usersTable.id,
      }),
    },
  })
);
