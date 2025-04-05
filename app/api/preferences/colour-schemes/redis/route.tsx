import { NextResponse } from "next/server";
import { createClient } from "redis";

export async function GET() {
  const redis = await createClient({ url: process.env.REDIS_URL }).connect();

  const value = await redis.get("colourSchemes");
  if (value == null)
    return NextResponse.json(
      { message: "No Redis data found" },
      { status: 404 }
    );

  return NextResponse.json(JSON.parse(value));
}

export async function POST() {
  // TODO: add authentication and roles
  //   const redis = await createClient({ url: process.env.REDIS_URL }).connect();
  //   const colourSchemes = await request.json();

  //   await redis.set("colourSchemes", JSON.stringify(colourSchemes));

  return NextResponse.json({
    // success: true,
    // message: "Data stored successfully",
    success: false,
  });
}
