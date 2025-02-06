import { getDeltaTime } from "@/app/(protected)/feed/getDeltaTime";
import { Post } from "@/types/Post";
import { createClient } from "@/utils/supabase/server";

export async function getRawPosts(desc = true) {
  const supabase = await createClient();
  const { data: posts } = await supabase
    .from("posts")
    .select("*")
    .order("updated_at", { ascending: !desc });

  return posts;
}

export async function getPosts(desc = true, authorId?: string) {
  const supabase = await createClient();
  const raw = authorId
    ? await getRawPostsByUser(desc, authorId)
    : await getRawPosts(desc);
  if (raw == null) return;

  const data: Post[] = [];
  for (const row of raw) {
    const { data: authorData } = await supabase
      .from("users")
      .select("nickname,avatar_url")
      .eq("id", row.author_id)
      .single();

    const author = authorData?.nickname ?? null;

    data.push({
      id: row.id,
      author,
      avatarUrl: authorData?.avatar_url,
      content: row.content,
      timestamp: getDeltaTime(row.created_at) + " ago",
      createdAt: row.created_at,
    });
  }

  return data;
}

export async function getRawPostsByUser(desc = true, authorId: string) {
  const supabase = await createClient();
  const { data: posts } = await supabase
    .from("posts")
    .select("*")
    .eq("author_id", authorId)
    .order("updated_at", { ascending: !desc });
  if (posts == null) return;

  return posts;
}
