import { getUserByNickname } from "@/actions/get-user";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ nickname: string }> }
) {
  const { nickname } = await params;
  try {
    const user = await getUserByNickname(nickname);
    return NextResponse.json(user);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Something went wrong with getting the user" },
      { status: 500 }
    );
  }
}
