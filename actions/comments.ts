import { createClient } from "@/utils/supabase/server";
import { getUserById, getUserByNickname } from "./users";
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
  const { data } = await supabase.rpc("get_simple_comment_tree", {
    input_main_post_id: postId,
    max_depth: 10,
  });
  if (data == null) return;

  return await Promise.all(
    // @ts-expect-error go to hell
    data.map(async (item) => {
      console.log(item);
      const author = await getUserById(item.author_id);
      if (author == null || author.nickname == null)
        throw new Error("Error retrieving authors");

      const timestamp = getDeltaTime(item.created_at);

      return {
        id: item.id,
        author,
        content: item.content,
        created_at: item.created_at,
        timestamp,
        index: item.comment_index,
        replyToIndex: item.reply_to_index,
      };
    })
  );
}
