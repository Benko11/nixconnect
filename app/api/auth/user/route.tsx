import { updateAuthUserInfo } from "@/actions/settings";
import { getAuthUser } from "@/actions/users";
import { NextRequest, NextResponse } from "next/server";

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

export async function PATCH(request: NextRequest) {
  try {
    const data = await request.json();

    const error = await updateAuthUserInfo(data);
    if (error?.errors != null) {
      return NextResponse.json({
        message: "Could not change the information, please review errors below",
        success: false,
        errors: error.errors,
      });
    }

    return NextResponse.json({ message: "Personal data changed successfully" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: err }, { status: 500 });
  }
}
