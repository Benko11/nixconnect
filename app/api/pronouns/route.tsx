import { getAllPronouns } from "@/app/actions";
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(await getAllPronouns());
}
