import { getValueForUser } from "@/actions/preferences";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string; identifier: string }> }
) {
  const { identifier, userId } = await params;
  try {
    const value = await getValueForUser(identifier, userId);
    return NextResponse.json({ [identifier]: value });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: err }, { status: 500 });
  }
}
