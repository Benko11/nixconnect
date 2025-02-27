import { signOut } from "@/actions/auth";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    await signOut();
    return NextResponse.json({ message: "Signed out successfully" });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Could not sign out" },
      { status: 500 }
    );
  }
}
