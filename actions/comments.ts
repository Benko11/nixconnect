import { db } from "@/db/db";
import { postsTable } from "@/db/schemas/posts";
import { eq, and, isNull, sql } from "drizzle-orm";
import { getUserById } from "./users";
import { getDeltaTime } from "@/utils/getDeltaTime";
import { auth } from "@/auth";

export async function addComment(content: string, postId: string) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) throw new Error("Unauthorized access");

  if (content.length < 1) throw new Error("Please type in the comment.");

  const inserted = await db
    .insert(postsTable)
    .values({
      authorId: userId,
      content,
      mainPostId: postId,
    })
    .returning();

  return inserted[0];
}

export async function getComments(postId: string) {
  // Replacing Supabase RPC 'get_simple_comment_tree' with a Drizzle query.
  // This fetches immediate comments. For a full tree, recursive logic or a view might be better.
  const data = await db.query.postsTable.findMany({
    where: and(
      eq(postsTable.mainPostId, postId),
      isNull(postsTable.deletedAt)
    ),
    orderBy: (posts, { asc }) => [asc(posts.createdAt)],
  });

  if (!data) return [];

  return await Promise.all(
    data.map(async (item) => {
      const author = await getUserById(item.authorId);
      if (author == null || author.nickname == null)
        throw new Error("Error retrieving authors");

      const timestamp = getDeltaTime(item.createdAt);

      return {
        id: item.id,
        author,
        content: item.content,
        created_at: item.createdAt,
        timestamp,
        // RPC specific fields might need adjustment if and indices were used
        index: (item as any).comment_index, 
        replyToIndex: (item as any).reply_to_index,
      };
    }),
  );
}
