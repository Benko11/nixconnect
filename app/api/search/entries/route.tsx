import { addSearchQuery, getRecentSearches } from "@/actions/search";
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
  try {
    await addSearchQuery(form.query);
    return NextResponse.json({ message: "Search entry added" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: err }, { status: 500 });
  }
}
