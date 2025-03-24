import { getColourSchemeById } from "@/actions/colour-schemes";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (isNaN(+id)) {
    return NextResponse.json(
      { message: "Invalid colour scheme ID" },
      { status: 400 }
    );
  }

  const colourScheme = await getColourSchemeById(+id);

  if (colourScheme == null) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  return NextResponse.json(colourScheme);
}
