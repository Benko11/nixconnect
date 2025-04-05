import { Post } from "@/types/Post";
import { getDeltaTime } from "@/utils/getDeltaTime";
import { createClient } from "@/utils/supabase/server";
import { getRangeIndexes } from "@/utils/utils";
import { NextResponse } from "next/server";
import { getPingsForPost } from "./ping";
import { getComments } from "./comments";
import { getUserById } from "./users";

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

  const inserted = await supabase
    .from("posts")
    .insert({
      author_id: userId,
      content,
    })
    .select("id");

  return inserted;
}

export default async function deletePostById(id: string) {
  const supabase = await createClient();

  const { error: postsError } = await supabase
    .from("posts")
    .update({ deleted_at: "now()" })
    .eq("id", id);
  if (postsError) {
    throw new Error(postsError.message);
  }

  return `Post ${id} deleted`;
}

export async function deleteHashtagsForPost(id: string) {
  const supabase = await createClient();
  const { error: postsError } = await supabase
    .from("searches")
    .delete()
    .eq("post_id", id);
  if (postsError) {
    throw new Error(postsError.message);
  }

  return `Hashtags for post ${id} deleted`;
}

const LIMIT = 15;

export async function getRawPosts(
  page: number | null,
  desc = true,
  searchQuery: string = ""
) {
  const supabase = await createClient();
  const pageNumber = page == null ? 1 : page;
  const [start, end] = getRangeIndexes(pageNumber, LIMIT);

  const query = supabase
    .from("posts")
    .select("*")
    .is("deleted_at", null)
    .is("main_post_id", null)
    .ilike("content", `%${searchQuery.toLowerCase()}%`)
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
  searchQuery = "",
  authorId?: string,
  desc = true
) {
  const pageNumber = page == null ? 1 : page;
  const raw =
    authorId == null
      ? await getRawPosts(pageNumber, desc, searchQuery)
      : await getRawPostsByUser(pageNumber, authorId, desc);
  if (raw == null) return;

  const rawPosts = raw.posts;
  const data = await Promise.all(
    rawPosts.map(async (item) => {
      const author = await getUserById(item.author_id);
      const timestamp = getDeltaTime(item.created_at);
      const pings = await getPingsForPost(item.id);
      const comments = await getComments(item.id);

      return {
        id: item.id,
        author,
        content: item.content,
        timestamp,
        createdAt: item.created_at,
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
  desc = true
) {
  const supabase = await createClient();

  const pageNumber = page == null ? 1 : page;
  const [start, end] = getRangeIndexes(pageNumber, LIMIT);

  const query = supabase
    .from("posts")
    .select("*")
    .is("deleted_at", null)
    .is("main_post_id", null)
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

  const author = await getUserById(post.author_id);
  const timestamp = getDeltaTime(post.created_at);

  const pings = await getPingsForPost(id);
  const comments = await getComments(id);

  return {
    id,
    author,
    content: post.content,
    createdAt: post.created_at,
    deletedAt: post.deleted_at,
    timestamp,
    pings,
    comments,
  };
}
