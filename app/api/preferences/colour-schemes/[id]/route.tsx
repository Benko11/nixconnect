import {
  getColourSchemeById,
  setColourSchemeForAuthUser,
} from "@/actions/colour-schemes";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (isNaN(+id)) {
    return NextResponse.json(
      { message: "Invalid colour scheme ID" },
      { status: 400 }
    );
  }

  try {
    const colourScheme = await getColourSchemeById(+id);
    return NextResponse.json(colourScheme);
  } catch (err) {
    console.error(err);
    return NextResponse.json(err, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (isNaN(+id)) {
    return NextResponse.json(
      { message: "Invalid colour scheme ID" },
      { status: 400 }
    );
  }

  try {
    await setColourSchemeForAuthUser(+id);

    return NextResponse.json({ message: "Applied theme" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: err }, { status: 500 });
  }
}
