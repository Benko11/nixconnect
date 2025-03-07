import { Post } from "@/types/Post";
import { getDeltaTime } from "@/utils/getDeltaTime";
import { createClient } from "@/utils/supabase/server";
import { getRangeIndexes } from "@/utils/utils";
import { NextResponse } from "next/server";

export async function createPost(content: string) {
  if (content.trim().length < 1) {
    return NextResponse.json(
      { message: "Post cannot be empty" },
      { status: 400 }
    );
  }

  const supabase = await createClient();
  const userId = (await supabase.auth.getUser()).data.user?.id;
  if (userId == null) return;

  const inserted = await supabase.from("posts").insert({
    author_id: userId,
    content,
  });

  return inserted;
}

export default async function deletePostById(id: string) {
  const supabase = await createClient();

  const { error: pingError } = await supabase
    .from("post_pings")
    .delete()
    .eq("post_id", id);
  if (pingError) {
    throw new Error(pingError.message);
  }

  const { error: postsError } = await supabase
    .from("posts")
    .delete()
    .eq("id", id);
  if (postsError) {
    throw new Error(postsError.message);
  }

  return `Post ${id} deleted`;
}

const LIMIT = 15;

export async function getRawPosts(page: number | null, desc = true) {
  const supabase = await createClient();
  const pageNumber = page == null ? 1 : page;
  const [start, end] = getRangeIndexes(pageNumber, LIMIT);

  const query = supabase
    .from("posts")
    .select("*")
    .is("deleted_at", null)
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
    .is("deleted_at", null)
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
