import { pgTable } from "drizzle-orm/pg-core";
import * as t from "drizzle-orm/pg-core";
import { usersTable } from "./users";
import { pronounsTable } from "./pronouns";
import { relations } from "drizzle-orm";
import { creatable } from "../helpers";

export const pronounUserTable = pgTable(
  "pronoun_user",
  {
    userId: t
      .uuid()
      .notNull()
      .references(() => usersTable.id),
    pronounId: t
      .integer()
      .notNull()
      .references(() => pronounsTable.id),
    ...creatable,
  },
  (table) => ({
    pk: t.primaryKey({ columns: [table.pronounId, table.userId] }),
  })
);

export const pronounsRelations = relations(usersTable, ({ many }) => ({
  pronounsToUsers: many(pronounUserTable),
}));

export const usersRelations = relations(pronounsTable, ({ many }) => ({
  pronounsToUsers: many(pronounUserTable),
}));

export const pronounsToUsersRelations = relations(
  pronounUserTable,
  ({ one }) => ({
    pronoun: one(pronounsTable, {
      fields: [pronounUserTable.pronounId],
      references: [pronounsTable.id],
    }),
  })
);
