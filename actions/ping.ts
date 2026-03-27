import { db } from "@/db/db";
import { postsPingsTable } from "@/db/schemas/posts-pings";
import { eq, and } from "drizzle-orm";
import { getDeltaTime } from "@/utils/getDeltaTime";
import { getUserById } from "./users";

export async function pingExists(userId: string, postId: string) {
  const ping = await db.query.postsPingsTable.findFirst({
    where: and(
      eq(postsPingsTable.userId, userId),
      eq(postsPingsTable.postId, postId)
    ),
  });

  return ping != null;
}

export async function getPingsForPost(postId: string) {
  const data = await db.query.postsPingsTable.findMany({
    where: eq(postsPingsTable.postId, postId),
  });

  if (!data) return [];

  const pings = await Promise.all(
    data.map(async (item) => {
      const author = await getUserById(item.userId);
      const timestamp = getDeltaTime(item.createdAt);
      if (author == null || author.nickname == null) {
        // Log error but don't crash the whole list fetch if one author is missing
        console.error(`Error retrieving author for user_id: ${item.userId}`);
        return null;
      }

      return {
        id: item.id,
        author,
        createdAt: item.createdAt,
        timestamp,
      };
    })
  );

  return pings.filter((p): p is NonNullable<typeof p> => p !== null);
}
