import { getDeltaTime } from "@/utils/getDeltaTime";
import { Post } from "@/types/Post";
import { createClient } from "@/utils/supabase/server";
import { getRangeIndexes } from "@/utils/utils";

const LIMIT = 15;

export async function getRawPosts(page: number | null, desc = true) {
  const supabase = await createClient();
  const pageNumber = page == null ? 1 : page;
  const [start, end] = getRangeIndexes(pageNumber, LIMIT);

  const query = supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: !desc })
    .limit(LIMIT)
    .range(start, end);

  const { data: posts, error } = await query;
  if (error) {
    console.error("Error fetching posts:", error);
    return { posts: [], nextPage: null };
  }

  return { posts, nextPage: pageNumber + 1 };
}

export async function getPosts(
  page: number | null,
  authorId?: string,
  desc = true
) {
  const pageNumber = page == null ? 1 : page;
  const supabase = await createClient();
  const raw =
    authorId == null
      ? await getRawPosts(pageNumber, desc)
      : await getRawPostsByUser(pageNumber, authorId, desc);
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
      timestamp: getDeltaTime(row.created_at),
      createdAt: row.created_at,
    });
  }

  const nextPage = data.length < LIMIT ? null : raw.nextPage;

  return { data, nextPage };
}

export async function getRawPostsByUser(
  page: number | null,
  authorId: string,
  desc = true
) {
  const supabase = await createClient();

  const pageNumber = page == null ? 1 : page;
  const [start, end] = getRangeIndexes(pageNumber, LIMIT);

  const query = supabase
    .from("posts")
    .select("*")
    .eq("author_id", authorId)
    .order("created_at", { ascending: !desc })
    .range(start, end);

  const { data: posts, error } = await query;
  if (error) {
    console.error("Error fetching posts:", error);
    return { posts: [], nextPage: null };
  }

  return { posts, nextPage: pageNumber + 1 };
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

  const timestamp = getDeltaTime(post.created_at);
  return {
    id,
    author: user.nickname,
    content: post.content,
    createdAt: post.created_at,
    timestamp,
  };
}
