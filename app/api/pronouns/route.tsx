import { getAllPronouns } from "@/actions/pronouns";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const pronouns = await getAllPronouns();
    return NextResponse.json(pronouns);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Something went wrong with getting the pronouns" },
      { status: 500 }
    );
  }
}
