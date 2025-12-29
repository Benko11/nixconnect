import { pgSchema } from "drizzle-orm/pg-core";
import * as t from "drizzle-orm/pg-core";
import { postsTable } from "./posts";
import { usersTable } from "./users";
import { creatable } from "../helpers";
import { defineRelations } from "drizzle-orm";

export const postsSchema = pgSchema("posts");
export const postsPingsTable = postsSchema.table("posts_pings", {
  id: t.uuid().primaryKey().defaultRandom(),
  postId: t
    .uuid()
    .notNull()
    .references(() => postsTable.id),
  authorId: t
    .uuid()
    .notNull()
    .references(() => usersTable.id),
  ...creatable,
});

export const relations = defineRelations(
  {
    postsTable,
    postsPingsTable,
    usersTable,
  },
  (r) => ({
    postsPingsTable: {
      post: r.one.postsTable({
        from: r.postsPingsTable.postId,
        to: r.postsTable.id,
      }),
      author: r.one.usersTable({
        from: r.postsPingsTable.authorId,
        to: r.usersTable.id,
      }),
    },
    postsTable: {
      pings: r.many.postsPingsTable(),
    },
    usersTable: {
      pings: r.many.postsPingsTable(),
    },
  })
);
