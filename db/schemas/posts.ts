import { pgSchema as schema } from "drizzle-orm/pg-core";
import * as t from "drizzle-orm/pg-core";
import { usersTable } from "./users";
import { softDeletes } from "../helpers";
import { defineRelations } from "drizzle-orm";

export const postSchema = schema("posts");
export const postsTable = postSchema.table("posts", {
  id: t.uuid().primaryKey(),
  authorId: t
    .uuid()
    .notNull()
    .references(() => usersTable.id),
  content: t.text(),
  mainPostId: t.uuid().references(() => postsTable.id),
  ...softDeletes,
});

export const relations = defineRelations({ usersTable, postsTable }, (r) => ({
  usersTable: {
    posts: (r.many as any).postsTable(),
  },
  postsTable: {
    author: r.one.usersTable({
      from: (r.postsTable as any).mainPostId,
      to: r.usersTable.id,
    }),
    parentPost: (r.one as any).postsTable({
      from: (r.postsTable as any).mainPostId,
      to: (r.postsTable as any).id,
    }),
  },
}));
