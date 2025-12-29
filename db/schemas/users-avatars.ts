import * as t from "drizzle-orm/pg-core";
import { authSchema, usersTable } from "./users";
import { creatable } from "../helpers";
import { defineRelations, sql } from "drizzle-orm";

export const typeEnum = authSchema.enum("type", ["url", "raw"]);
export const userAvatarsTable = authSchema.table(
  "users_avatars",
  {
    id: t.serial().primaryKey(),
    userId: t
      .uuid()
      .notNull()
      .references(() => usersTable.id),
    type: typeEnum(),
    isActive: t.boolean().notNull().default(false),
    url: t.varchar(),
    ...creatable,
  },
  (table) => ({
    uniqueActiveIdx: t
      .uniqueIndex("unique_active_avatar")
      .on(table.userId)
      .where(sql`${table.isActive} = true`),

    urlTypeCheck: t.check(
      "url_type_check",
      sql`(${table.type} = 'raw' AND ${table.url} IS NULL) OR (${table.type} = 'url' AND ${table.url} IS NOT NULL)  `
    ),
  })
);

export const relations = defineRelations(
  { usersTable, userAvatarsTable },
  (r) => ({
    usersTable: {
      avatars: r.many.userAvatarsTable(),
    },
    userAvatarsTable: {
      user: r.one.usersTable({
        from: r.userAvatarsTable.userId,
        to: r.usersTable.id,
      }),
    },
  })
);
