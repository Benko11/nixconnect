import { getValueForAuthUser } from "@/actions/preferences";
import kebabCaseToCamelCase from "@/utils/kebabCaseToCamelCase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ identifier: string }> }
) {
  const { identifier } = await params;

  try {
    const defaultValue = await getValueForAuthUser(identifier);
    return NextResponse.json({
      [kebabCaseToCamelCase(identifier)]: defaultValue,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: err }, { status: 500 });
  }
}
