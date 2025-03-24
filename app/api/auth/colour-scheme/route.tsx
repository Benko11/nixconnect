import { getAuthUserColourScheme } from "@/actions/colour-schemes";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const colourScheme = await getAuthUserColourScheme();
    if (colourScheme == null) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    return NextResponse.json(colourScheme);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: err }, { status: 500 });
  }
}
