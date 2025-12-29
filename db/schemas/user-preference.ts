import * as t from "drizzle-orm/pg-core";
import { hasTimestamps } from "../helpers";
import { defineRelations } from "drizzle-orm";
import { authSchema, usersTable } from "./users";
import { preferencesTable } from "./preferences";

export const userPreferenceTable = authSchema.table(
  "user_preference",
  {
    preferenceName: t
      .varchar()
      .notNull()
      .references(() => preferencesTable.name),
    userId: t
      .uuid()
      .notNull()
      .references(() => usersTable.id),
    value: t.varchar(),
    ...hasTimestamps,
  },
  (table) => [t.primaryKey({ columns: [table.preferenceName, table.userId] })]
);

export const relations = defineRelations(
  { usersTable, preferencesTable, userPreferenceTable },
  (r) => ({
    usersTable: {
      preferences: r.many.preferencesTable({
        from: r.usersTable.id.through(r.userPreferenceTable.userId),
        to: r.preferencesTable.name.through(
          r.userPreferenceTable.preferenceName
        ),
      }),
    },
    preferencesTable: {
      users: r.many.usersTable({
        from: r.preferencesTable.name.through(
          r.userPreferenceTable.preferenceName
        ),
        to: r.usersTable.id.through(r.userPreferenceTable.userId),
      }),
    },
  })
);
