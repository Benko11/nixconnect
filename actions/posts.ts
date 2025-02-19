import { createClient } from "@/utils/supabase/server";
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
