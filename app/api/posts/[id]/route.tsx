import { getPostById } from "@/actions/get-posts";
import deletePostById from "@/actions/posts";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (typeof id === "string") {
    try {
      const post = await getPostById(id);
      if (!post)
        return NextResponse.json({ error: "Post not found" }, { status: 404 });
      return NextResponse.json(post);
    } catch {
      throw new Error("Something happened");
    }
  }
  return NextResponse.json({ error: "Invalid post ID" }, { status: 400 });
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const supabase = await createClient();
    const auth = await supabase.auth.getUser();

    const { data: post } = await supabase
      .from("posts")
      .select("author_id")
      .eq("id", id)
      .maybeSingle();

    if (auth.data.user?.id !== post?.author_id)
      return NextResponse.json(
        { message: "Cannot delete post" },
        { status: 403 }
      );

    await deletePostById(id);
    return NextResponse.json({ message: "Post deleted" });
  } catch (err) {
    if (err instanceof Error) {
      return NextResponse.json({ message: err.message }, { status: 500 });
    }
  }

  return NextResponse.json({ id });
}
