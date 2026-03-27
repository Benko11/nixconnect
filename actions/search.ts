import { db } from "@/db/db";
import { usersTable } from "@/db/schemas/users";
import { searchesTable } from "@/db/schemas/searches";
import { ilike, sql, desc, eq } from "drizzle-orm";
import { getPosts } from "./posts";
import { auth } from "@/auth";

const LIMIT = 12;

export async function searchUsers(query: string) {
  const searchData = await db.query.usersTable.findMany({
    where: ilike(usersTable.nickname, `${query.toLowerCase()}%`),
    columns: {
      id: true,
      nickname: true,
    },
  });

  if (!searchData) return [];

  const data = searchData.map((item) => {
    return {
      id: item.id,
      nickname: item.nickname,
      avatarUrl: (item as any).avatar_url,
    };
  });

  return data;
}

export async function searchPosts(query: string, page: number | null) {
  try {
    const posts = await getPosts(page, query);
    if (posts == null) throw new Error("Posts not found");

    return posts;
  } catch (err) {
    return { data: [], nextPage: null };
  }
}

export async function addSearchQueries(queries: Set<string>, postId: string) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    throw new Error("Access denied");
  }

  const values = Array.from(queries).map((query) => ({
    userId,
    query: query as string,
    postId,
  }));

  if (values.length > 0) {
    await db.insert(searchesTable).values(values);
  }
}

export async function getRecentSearches(limit = 15) {
  // Replacing Supabase RPC 'get_recent_unique_queries'
  // Fetching recent unique queries.
  const data = await db
    .select({
      query: searchesTable.query,
    })
    .from(searchesTable)
    .groupBy(searchesTable.query)
    .orderBy(desc(sql`max(${searchesTable.createdAt})`))
    .limit(limit);

  return data;
}
