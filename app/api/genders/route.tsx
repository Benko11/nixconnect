import { getAllGenders } from "@/actions/genders";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const genders = await getAllGenders();
    return NextResponse.json(genders);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Gender error" }, { status: 500 });
  }
}
