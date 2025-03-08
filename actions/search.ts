import errorLogger from "@/loggers/errorLogger";
import { getDeltaTime } from "@/utils/getDeltaTime";
import { createClient } from "@/utils/supabase/server";
import { getRangeIndexes, getUserById } from "@/utils/utils";

const LIMIT = 12;

export async function searchUsers(query: string) {
  const supabase = await createClient();

  const { data: searchData, error } = await supabase
    .from("users")
    .select("id,nickname,avatar_url")
    .ilike("nickname", `${query.toLowerCase()}%`);
  if (searchData == null) return;
  const data = [];
  for (let item of searchData) {
    data.push({
      id: item.id,
      nickname: item.nickname,
      avatarUrl: item.avatar_url,
    });
  }

  if (error) {
    // errorLogger.error("Could not search for users:", error);
    return;
  }

  return data;
}

export async function searchPosts(query: string, page: number | null) {
  const supabase = await createClient();
  const pageNumber = page == null ? 1 : page;
  const [start, end] = getRangeIndexes(pageNumber, LIMIT);

  const { data: raw, error } = await supabase
    .from("posts")
    .select("id,author_id,content,created_at")
    .is("deleted_at", null)
    .ilike("content", `%${query.toLowerCase()}%`)
    .order("created_at", { ascending: false })
    .limit(LIMIT)
    .range(start, end);

  const data: any[] = [];
  if (raw == null) return;

  for (let item of raw) {
    const user = await getUserById(item.author_id);
    const timestamp = getDeltaTime(item.created_at);
    data.push({
      id: item.id,
      author: user.nickname,
      createdAt: item.created_at,
      timestamp,
      content: item.content,
    });
  }

  if (error) {
    // errorLogger.error("Could not search for posts:", error);
    return { posts: [], nextPage: null };
  }
  const nextPage = data.length < LIMIT ? null : pageNumber + 1;

  return { data, nextPage };
}
