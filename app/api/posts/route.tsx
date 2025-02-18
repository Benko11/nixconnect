import { getPosts } from "@/actions/get-posts";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get("page");
  const pageNumber = page == null ? 0 : +page;

  const posts = await getPosts(pageNumber);
  return NextResponse.json({ ...posts });
}
