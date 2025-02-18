import { getUserByNickname } from "@/actions/get-user";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ nickname: string }> }
) {
  const { nickname } = await params;
  const user = await getUserByNickname(nickname);
  console.log(nickname);
  return NextResponse.json(user);
}
