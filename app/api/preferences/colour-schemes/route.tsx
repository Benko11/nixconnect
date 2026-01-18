import { getAll as getColourSchemes } from "@/services/colour-scheme-service";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const colourSchemes = await getColourSchemes();
    return NextResponse.json(colourSchemes);
  } catch (err) {
    console.error(err);
    return NextResponse.json("Something went wrong", { status: 500 });
  }
}
