import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const res: NextResponse = NextResponse.json({ message: "Hello World" });
  return res;
}
