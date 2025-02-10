import { getPingsForPost, pingExists } from "@/actions/ping";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  const { postId } = await params;
  const pings = await getPingsForPost(postId);
  return NextResponse.json({ pings });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  const supabase = await createClient();
  const authUser = await supabase.auth.getUser();
  const userId = authUser.data.user?.id;
  if (userId == null)
    return NextResponse.json({ message: "" }, { status: 400 });

  const { postId } = await params;
  const { data: user, error: authorIdError } = await supabase
    .from("posts")
    .select("author_id")
    .eq("id", postId)
    .maybeSingle();
  if (authorIdError) throw new Error(authorIdError.message);
  if (user == null) throw new Error("Author does not exist");
  const { author_id } = user;

  if (author_id == userId)
    return NextResponse.json(
      { message: "Cannot ping own post" },
      { status: 401 }
    );

  if (await pingExists(userId, postId)) {
    const { error: deleteError } = await supabase
      .from("post_pings")
      .delete()
      .eq("post_id", postId);
    if (deleteError) {
      console.error(deleteError);
      throw new Error(deleteError.message);
    }
    return NextResponse.json({ message: "Post unpinged" });
  }

  const { error: pingError } = await supabase.from("post_pings").insert({
    user_id: userId,
    post_id: postId,
  });
  if (pingError) throw new Error(pingError.message);

  return NextResponse.json({ message: "Post pinged" });
}
