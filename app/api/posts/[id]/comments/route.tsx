import { addComment, getComments } from "@/actions/comments";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: postId } = await params;
  const comments = await getComments(postId);
  return NextResponse.json(comments);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { content } = await request.json();
  const { id: postId } = await params;
  try {
    const newComment = await addComment(content, postId);
    return NextResponse.json({
      newComment,
      message: "Comment added successfully",
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Something went wrong with sending your comment" },
      { status: 500 }
    );
  }
}
