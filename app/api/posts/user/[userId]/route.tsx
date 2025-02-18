import { getPosts } from "@/actions/get-posts";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get("page");
  const pageNumber = page == null ? 0 : +page;
  const { userId } = await params;

  const posts = await getPosts(pageNumber, userId);
  return NextResponse.json({ ...posts });
}
