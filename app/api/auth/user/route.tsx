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
    console.log(data);
    await updateAuthUserInfo(data);

    return NextResponse.json({ message: "I guess it worked...?" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: err }, { status: 500 });
  }
}
