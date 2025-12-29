import { defineRelations } from "drizzle-orm";
import { onlySoftDeletes } from "../helpers";
import { authSchema, usersTable } from "./users";
import * as t from "drizzle-orm/pg-core";

export const usersBlocksTable = authSchema.table("users_blocks", {
  id: t.uuid().primaryKey().defaultRandom(),
  blockerId: t
    .uuid()
    .notNull()
    .references(() => usersTable.id),
  blockedId: t
    .uuid()
    .notNull()
    .references(() => usersTable.id),
  ...onlySoftDeletes,
});

export const relations = defineRelations(
  { usersBlocksTable, usersTable },
  (r) => ({
    usersBlocksTable: {
      blocker: r.one.usersTable({
        from: r.usersBlocksTable.blockerId,
        to: r.usersTable.id,
      }),
      blocked: r.one.usersTable({
        from: r.usersBlocksTable.blockedId,
        to: r.usersTable.id,
      }),
    },

    usersTable: {
      blocking: r.many.usersBlocksTable({
        from: r.usersTable.id,
        to: r.usersBlocksTable.blockerId,
      }),
      blockedBy: r.many.usersBlocksTable({
        from: r.usersTable.id,
        to: r.usersBlocksTable.blockedId,
      }),
    },
  })
);
