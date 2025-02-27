import { confirmInformation } from "@/actions/auth";
import { ConfirmDataClient } from "@/types/ConfirmDataClient";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const data: ConfirmDataClient = await request.json();

  try {
    const error = await confirmInformation(data);

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
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: error, success: false },
      { status: 500 }
    );
  }
}
