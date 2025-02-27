import { getAuthUser } from "@/actions/users";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await getAuthUser();
    return NextResponse.json(user);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Could not retrieve authed user" },
      { status: 403 }
    );
  }
}
