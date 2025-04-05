import { getDeltaTime } from "@/utils/getDeltaTime";
import { createClient } from "@/utils/supabase/server";
import { getRangeIndexes } from "@/utils/utils";
import { getUserById } from "./users";
import { getPosts } from "./posts";

const LIMIT = 12;

export async function searchUsers(query: string) {
  const supabase = await createClient();

  const { data: searchData, error } = await supabase
    .from("users")
    .select("id,nickname,avatar_url")
    .ilike("nickname", `${query.toLowerCase()}%`);

  if (searchData == null) return;
  if (error) {
    // errorLogger.error("Could not search for users:", error);
    return;
  }

  const data = searchData.map((item) => {
    return {
      id: item.id,
      nickname: item.nickname,
      avatarUrl: item.avatar_url,
    };
  });

  return data;
}

export async function searchPosts(query: string, page: number | null) {
  const pageNumber = page == null ? 1 : page;

  const posts = await getPosts(page, query);
  if (posts == null) throw new Error("Posts not found");

  try {
    const posts = await getPosts(page, query);
    if (posts == null) throw new Error("Posts not found");

    return posts;
  } catch (err) {
    return { posts: [], nextPage: null };
  }
}

export async function addSearchQueries(queries: Set<String>, postId: string) {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();
  const id = user.data.user?.id;
  if (id == null) {
    throw new Error("Access denied");
  }

  queries.forEach(async (query) => {
    const { error } = await supabase
      .from("searches")
      .insert({ user_id: id, query, post_id: postId });
    if (error) {
      console.error(error);
      throw new Error("Could not create search query log");
    }
  });
}

export async function getRecentSearches(limit = 15) {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_recent_unique_queries");

  if (error) {
    console.error(error);
    throw new Error("Could not run query", error);
  }

  return data;
}
