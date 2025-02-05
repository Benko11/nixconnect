import { getDeltaTime } from "@/app/(protected)/feed/getDeltaTime";
import { handleNewLines } from "@/app/(protected)/feed/handleNewLines";
import { Post } from "@/types/Post";
import { createClient } from "@/utils/supabase/server";
import { convertMarkdown } from "@/utils/utils";

export async function getRawPosts(desc = true) {
  const supabase = await createClient();
  const { data: posts } = await supabase
    .from("posts")
    .select("*")
    .order("updated_at", { ascending: !desc });

  return posts;
}

export async function getPosts(desc = true) {
  const supabase = await createClient();
  const raw = await getRawPosts();
  if (raw == null) return;

  const data: Post[] = [];
  for (const row of raw) {
    const { data: authorData } = await supabase
      .from("users")
      .select("nickname")
      .eq("id", row.author_id)
      .single();

    const author = authorData?.nickname ?? null;

    data.push({
      id: row.id,
      author,
      content: convertMarkdown(handleNewLines(row.content)),
      timestamp: getDeltaTime(row.created_at) + " ago",
      createdAt: row.created_at,
    });
  }

  return data;
}
