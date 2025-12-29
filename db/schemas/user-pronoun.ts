import { pgTable } from "drizzle-orm/pg-core";
import * as t from "drizzle-orm/pg-core";
import { usersTable } from "./users";
import { pronounsTable } from "./pronouns";
import { defineRelations } from "drizzle-orm";
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
  (table) => [t.primaryKey({ columns: [table.userId, table.pronounId] })]
);

export const relations = defineRelations(
  {
    usersTable,
    pronounsTable,
    pronounUserTable,
  },
  (r) => ({
    usersTable: {
      pronouns: r.many.pronounsTable({
        from: r.usersTable.id.through(r.pronounUserTable.userId),
        to: r.pronounsTable.id.through(r.pronounUserTable.pronounId),
      }),
    },
    pronounsTable: {
      participants: r.many.usersTable({
        from: r.pronounsTable.id.through(r.pronounUserTable.pronounId),
        to: r.usersTable.id.through(r.pronounUserTable.userId),
      }),
    },
  })
);
