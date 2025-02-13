import { getPosts } from "@/actions/get-posts";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const cursor = searchParams.get("cursor");
  console.log(cursor);

  const posts = await getPosts(cursor);
  return NextResponse.json({ posts });
}
