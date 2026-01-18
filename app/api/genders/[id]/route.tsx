import { getById as getGenderById } from "@/services/gender-service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (isNaN(+id)) {
    return NextResponse.json({ message: "Invalid gender id" }, { status: 400 });
  }
  const gender = await getGenderById(+id);
  return NextResponse.json({ gender }, { status: gender == null ? 404 : 200 });
}
