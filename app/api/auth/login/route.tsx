import { signIn } from "@/actions/auth";
import LoginClient from "@/types/LoginClient";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const form: LoginClient = await request.json();
    if (form.nickname.length < 1 || form.password.length < 1) {
      return NextResponse.json(
        {
          message: "This set of credentials does not match our records",
          success: false,
        },
        { status: 401 }
      );
    }

    try {
      await signIn(form);
      return NextResponse.json({
        message: "Log in successful",
        success: true,
      });
    } catch (error) {
      if (error instanceof Error) {
        return NextResponse.json(
          { message: error.message, success: false },
          { status: 401 }
        );
      }

      return NextResponse.json(
        { message: "Something bad happened, and we could not you sign in" },
        { status: 500 }
      );
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Could not sign you in" },
      { status: 500 }
    );
  }
}
