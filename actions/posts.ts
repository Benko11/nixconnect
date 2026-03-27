import { db } from "@/db/db";
import { postsTable } from "@/db/schemas/posts";
import { usersTable } from "@/db/schemas/users";
import { eq, and, isNull, desc as d, ilike, sql } from "drizzle-orm";
import { getDeltaTime } from "@/utils/getDeltaTime";
import { getRangeIndexes } from "@/utils/utils";
import { getPingsForPost } from "./ping";
import { getComments } from "./comments";
import { getUserById } from "./users";
import { auth } from "@/auth";

const LIMIT = 15;

export async function createPost(content: string) {
  if (content.trim().length < 1) {
    throw new Error("Post cannot be empty");
  }

  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) throw new Error("Unauthorized access");

  const inserted = await db
    .insert(postsTable)
    .values({
      authorId: userId,
      content,
    })
    .returning({ id: postsTable.id });

  return inserted;
}

export async function deletePostById(id: string) {
  await db
    .update(postsTable)
    .set({ deletedAt: new Date() })
    .where(eq(postsTable.id, id));

  return `Post ${id} deleted`;
}

export async function getRawPosts(
  page: number | null,
  orderDesc = true,
  searchQuery: string = ""
) {
  const pageNumber = page == null ? 1 : page;
  const [start, _] = getRangeIndexes(pageNumber, LIMIT);

  const posts = await db.query.postsTable.findMany({
    where: and(
      isNull(postsTable.deletedAt),
      isNull(postsTable.mainPostId),
      ilike(postsTable.content, `%${searchQuery.toLowerCase()}%`)
    ),
    orderBy: orderDesc ? d(postsTable.createdAt) : postsTable.createdAt,
    limit: LIMIT,
    offset: start,
  });

  return { posts, nextPage: pageNumber + 1 };
}

export async function getPosts(
  page: number | null,
  searchQuery = "",
  authorId?: string,
  orderDesc = true
) {
  const pageNumber = page == null ? 1 : page;
  const raw =
    authorId == null
      ? await getRawPosts(pageNumber, orderDesc, searchQuery)
      : await getRawPostsByUser(pageNumber, authorId, orderDesc);

  if (!raw) return;

  const rawPosts = raw.posts;
  const data = await Promise.all(
    rawPosts.map(async (item) => {
      const author = await getUserById(item.authorId);
      const timestamp = getDeltaTime(item.createdAt);
      const pings = await getPingsForPost(item.id);
      const comments = await getComments(item.id);

      return {
        id: item.id,
        author,
        content: item.content,
        timestamp,
        createdAt: item.createdAt,
        pings,
        comments,
      };
    })
  );

  const nextPage = data.length < LIMIT ? null : raw.nextPage;

  return { data, nextPage };
}

export async function getRawPostsByUser(
  page: number | null,
  authorId: string,
  orderDesc = true
) {
  const pageNumber = page == null ? 1 : page;
  const [start, _] = getRangeIndexes(pageNumber, LIMIT);

  const posts = await db.query.postsTable.findMany({
    where: and(
      isNull(postsTable.deletedAt),
      isNull(postsTable.mainPostId),
      eq(postsTable.authorId, authorId)
    ),
    orderBy: orderDesc ? d(postsTable.createdAt) : postsTable.createdAt,
    limit: LIMIT,
    offset: start,
  });

  return { posts, nextPage: pageNumber + 1 };
}

export async function getPostById(id: string) {
  const post = await db.query.postsTable.findFirst({
    where: eq(postsTable.id, id),
  });

  if (!post) throw new Error("Post not found");

  const author = await getUserById(post.authorId);
  const timestamp = getDeltaTime(post.createdAt);
  const pings = await getPingsForPost(id);
  const comments = await getComments(id);

  return {
    id,
    author,
    content: post.content,
    createdAt: post.createdAt,
    deletedAt: post.deletedAt,
    timestamp,
    pings,
    comments,
  };
}
