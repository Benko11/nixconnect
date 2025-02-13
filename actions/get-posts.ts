import { getDeltaTime } from "@/app/(protected)/feed/getDeltaTime";
import { Post } from "@/types/Post";
import { createClient } from "@/utils/supabase/server";

const LIMIT = 15;

export async function getRawPosts(cursor: string | null = null, desc = true) {
  const supabase = await createClient();
  let query = supabase
    .from("posts")
    .select("*")
    .order("updated_at", { ascending: !desc })
    .limit(LIMIT);
  if (cursor != null) {
    query = query.gt("updated_at", cursor);
  }

  const { data: posts, error } = await query;
  if (error) {
    console.error("Error fetching posts:", error);
    return { posts: [], nextCursor: null };
  }

  const nextCursor =
    posts.length > 0 ? posts[posts.length - 1].updated_at : null;
  return { posts, nextCursor };
}

export async function getPosts(
  cursor: string | null = null,
  desc = true,
  authorId?: string
) {
  const supabase = await createClient();
  const raw =
    authorId == null
      ? await getRawPosts(cursor, desc)
      : await getRawPostsByUser(cursor, authorId, desc);
  if (raw == null) return;

  const rawPosts = raw.posts;
  const data: Post[] = [];
  for (const row of rawPosts) {
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

  return { data, nextCursor: raw.nextCursor };
}

export async function getRawPostsByUser(
  cursor: string | null,
  authorId: string,
  desc = true
) {
  const supabase = await createClient();
  let query = supabase
    .from("posts")
    .select("*")
    .eq("author_id", authorId)
    .order("updated_at", { ascending: !desc })
    .limit(LIMIT);

  if (cursor != null) {
    query = query.gt("updated_at", cursor);
  }
  const { data: posts, error } = await query;
  if (error) {
    console.error("Error fetching posts:", error);
    return { posts: [], nextCursor: null };
  }

  const nextCursor =
    posts.length > 0 ? posts[posts.length - 1].updated_at : null;

  if (posts == null) return;

  return { posts, nextCursor };
}

export async function getPostById(id: string) {
  const supabase = await createClient();
  const { data: post, error: postError } = await supabase
    .from("posts")
    .select()
    .eq("id", id)
    .maybeSingle();
  if (postError) throw new Error(postError.message);

  const { data: user, error: nicknameError } = await supabase
    .from("users")
    .select("nickname")
    .eq("id", post.author_id)
    .maybeSingle();
  if (nicknameError) throw new Error(nicknameError.message);
  if (user == null) throw new Error("User error");

  const timestamp = getDeltaTime(post.created_at) + " ago";
  return {
    id,
    author: user.nickname,
    content: post.content,
    createdAt: post.created_at,
    timestamp,
  };
}
