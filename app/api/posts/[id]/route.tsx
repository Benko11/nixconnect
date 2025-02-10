import { getPostById } from "@/actions/get-posts";
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
