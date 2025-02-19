import { getPosts } from "@/actions/get-posts";
import { createPost } from "@/actions/posts";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get("page");
  const pageNumber = page == null ? 0 : +page;

  const posts = await getPosts(pageNumber);
  return NextResponse.json({ ...posts });
}

export async function POST(request: NextRequest) {
  const { content } = await request.json();
  try {
    const newPost = await createPost(content);
    return NextResponse.json({ newPost, message: "Post created successfully" });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      {
        message: "Something went wrong with sending your post",
      },
      { status: 500 }
    );
  }
}
