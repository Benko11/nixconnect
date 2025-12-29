import { pgTable } from "drizzle-orm/pg-core";
import * as t from "drizzle-orm/pg-core";
import { usersTable } from "./users";
import { softDeletes } from "../helpers";
import { defineRelations } from "drizzle-orm";

export const usersBansTable = pgTable("users_bans", {
  id: t.serial().primaryKey(),
  userId: t
    .uuid()
    .notNull()
    .references(() => usersTable.id),
  bannedFrom: t.timestamp().notNull(),
  bannedTo: t.timestamp(),
  ...softDeletes,
});

export const relations = defineRelations(
  { usersBansTable, usersTable },
  (r) => ({
    usersBansTable: {
      user: r.one.usersTable({
        from: r.usersBansTable.userId,
        to: r.usersTable.id,
      }),
    },
    usersTable: {
      bans: r.many.usersBansTable({
        from: r.usersTable.id,
        to: r.usersBansTable.userId,
      }),
    },
  })
);
