import { pgSchema } from "drizzle-orm/pg-core";
import * as t from "drizzle-orm/pg-core";
import { postsTable } from "./posts";
import { softDeletes } from "../helpers";
import { defineRelations } from "drizzle-orm";

export const postSchema = pgSchema("posts");
export const postsFilesTable = postSchema.table("posts_files", {
  id: t.uuid().primaryKey().defaultRandom(),
  postId: t
    .uuid()
    .notNull()
    .references(() => postsTable.id),
  mimetype: t.varchar().notNull(),
  size: t.integer().notNull(),
  content: t.text(),
  ...softDeletes,
});

export const relations = defineRelations(
  { postsFilesTable, postsTable },
  (r) => ({
    postsFilesTable: {
      post: r.one.postsTable({
        from: r.postsFilesTable.postId,
        to: r.postsTable.id,
      }),
    },

    postsTable: {
      files: r.many.postsFilesTable({
        from: r.postsTable.id,
        to: r.postsFilesTable.postId,
      }),
    },
  })
);
