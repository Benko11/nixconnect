import { getDeltaTime } from "@/utils/getDeltaTime";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { getUserById } from "./users";

export async function pingExists(userId: string, postId: string) {
  const supabase = await createClient();

  const { data: ping, error: pingError } = await supabase
    .from("post_pings")
    .select()
    .eq("user_id", userId)
    .eq("post_id", postId)
    .maybeSingle();
  if (pingError)
    return NextResponse.json({ message: pingError.message }, { status: 500 });
  return ping != null;
}

export async function getPingsForPost(postId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("post_pings")
    .select()
    .eq("post_id", postId);
  if (data == null) return;

  const pings = await Promise.all(
    data.map(async (item) => {
      const author = await getUserById(item.user_id);
      const timestamp = getDeltaTime(item.created_at);
      if (author == null || author.nickname == null)
        throw new Error("Error retrieving authors");

      return {
        id: item.id,
        author,
        createdAt: item.created_at,
        timestamp,
      };
    })
  );
  return pings;
}
