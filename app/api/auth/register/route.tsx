import { signUp } from "@/actions/auth";
import RegisterClient from "@/types/RegisterClient";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const data: RegisterClient = await request.json();
  try {
    const error = await signUp(data);
    if (error?.errors != null) {
      return NextResponse.json(
        {
          message: "Could not sign you up, please review errors below",
          success: false,
          errors: error.errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message:
        "Account successfully created, please check your inbox for a confirmation mail",
      success: true,
    });
  } catch (error) {
    return NextResponse.json(
      { message: error, success: false },
      { status: 500 }
    );
  }
}
