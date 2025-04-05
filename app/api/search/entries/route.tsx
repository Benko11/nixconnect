import { addSearchQueries, getRecentSearches } from "@/actions/search";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const searches = await getRecentSearches();
    return NextResponse.json(searches);
  } catch (err) {
    return NextResponse.json({ message: err }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const form = await request.json();
  console.log(form);
  try {
    await addSearchQueries(
      new Set(form.queries.map((q: string) => q.toLowerCase())),
      form.postId
    );
    return NextResponse.json({ message: "Search entry added" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: err }, { status: 500 });
  }
}
