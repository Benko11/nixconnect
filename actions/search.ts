import errorLogger from "@/loggers/errorLogger";
import { getDeltaTime } from "@/utils/getDeltaTime";
import { createClient } from "@/utils/supabase/server";
import { getUserById } from "@/utils/utils";

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

export async function searchPosts(query: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select("id,author_id,content,created_at")
    .is("deleted_at", null)
    .ilike("content", `%${query.toLowerCase()}%`)
    .order("created_at", { ascending: false });

  const processed: any[] = [];
  if (data == null) return;

  for (let item of data) {
    const user = await getUserById(item.author_id);
    const timestamp = getDeltaTime(item.created_at);
    processed.push({
      id: item.id,
      author: user.nickname,
      createdAt: item.created_at,
      timestamp,
      content: item.content,
    });
  }
  data?.forEach(async (item) => {});

  if (error) {
    // errorLogger.error("Could not search for posts:", error);
    return;
  }

  return processed;
}
