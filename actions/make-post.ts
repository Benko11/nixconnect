import { createClient } from "@/utils/supabase/client";
import { redirect } from "next/navigation";

export interface State {
  post: string;
  message: string;
}
export async function makePost(prevState: State, formData: FormData) {
  const post = formData.get("post");
  if (post == null) {
    return {
      post,
      error: "Post cannot be empty",
    };
  }

  if (post.toString().trim().length < 1) {
    return {
      post,
      error: "Post cannot be empty",
    };
  }

  const supabase = createClient();
  const userId = (await supabase.auth.getUser()).data.user?.id;
  if (userId == null) return;

  await supabase.from("posts").insert({
    author_id: userId,
    content: post,
  });

  return redirect("/feed");
}
