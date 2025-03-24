import { createClient } from "@/utils/supabase/server";
import { getUserById } from "./users";
import { getDeltaTime } from "@/utils/getDeltaTime";

export async function addComment(content: string, postId: string) {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();
  const userId = user.data.user?.id;
  if (userId == null) return;

  if (content.length < 1) throw new Error("Please type in the comment.");

  const newPost = { author_id: userId, content, main_post_id: postId };
  const { error: newPostError } = await supabase.from("posts").insert(newPost);
  if (newPostError) {
    throw new Error(newPostError.message);
  }

  return newPost;
}

export async function getComments(postId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("posts")
    .select("id,author_id,content,created_at")
    .eq("main_post_id", postId)
    .is("deleted_at", null)
    .order("created_at", { ascending: false });
  if (data == null) return;

  const comments = [];
  for (const item of data) {
    const author = await getUserById(item.author_id);
    const timestamp = getDeltaTime(item.created_at);

    comments.push({
      id: item.id,
      author,
      content: item.content,
      created_at: item.created_at,
      timestamp,
    });
  }
  return comments;
}
