import { searchPosts, searchUsers } from "@/actions/search";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("query");
  const page = request.nextUrl.searchParams.get("page");
  const pageNumber = page == null ? 0 : +page;

  if (query == null || query === "")
    return NextResponse.json(
      { message: "Query cannot be empty" },
      { status: 400 }
    );

  const users = await searchUsers(query);
  const posts = await searchPosts(query, pageNumber);

  return NextResponse.json({ users, posts });
}
