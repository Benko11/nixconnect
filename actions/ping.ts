import { getDeltaTime } from "@/utils/getDeltaTime";
import { Ping } from "@/types/Ping";
import { createClient } from "@/utils/supabase/server";
import { getUserById } from "@/utils/utils";
import { NextResponse } from "next/server";

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

  const pings: Ping[] = [];
  for (const raw of data) {
    const author = await getUserById(raw.user_id);
    if (author == null || author.nickname == null)
      throw new Error("Error retrieving authors");

    pings.push({
      author: { name: author.nickname, avatarUrl: author.avatar_url },
      createdAt: raw.created_at,
      timestamp: getDeltaTime(raw.created_at),
    });
  }
  return pings;
}
