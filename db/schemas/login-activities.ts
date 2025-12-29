import { defineRelations } from "drizzle-orm";
import { creatable } from "../helpers";
import { authSchema, usersTable } from "./users";
import * as t from "drizzle-orm/pg-core";

export const loginActivitiesTable = authSchema.table("login_activities", {
  id: t.uuid().primaryKey().defaultRandom(),
  userId: t
    .uuid()
    .notNull()
    .references(() => usersTable.id),
  didSucceed: t.boolean().notNull(),
  ip: t.varchar().notNull(),
  userAgent: t.varchar().notNull(),
  ...creatable,
});

export const relations = defineRelations(
  { loginActivitiesTable, usersTable },
  (r) => ({
    usersTable: {
      loginActivities: r.many.loginActivitiesTable({
        from: r.usersTable.id,
        to: r.loginActivitiesTable.userId,
      }),
    },

    loginActivitiesTable: {
      user: r.one.usersTable({
        from: r.loginActivitiesTable.userId,
        to: r.usersTable.id,
      }),
    },
  })
);
