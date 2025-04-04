import { setShowPublicMailForAuthUser } from "@/actions/preferences/show-mail";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(request: NextRequest) {
  try {
    const { activate } = await request.json();
    await setShowPublicMailForAuthUser(activate);
    return NextResponse.json({ message: "Successfully changed" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: err }, { status: 500 });
  }
}
