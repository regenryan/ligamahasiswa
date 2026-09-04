import { NextResponse } from "next/server";

export async function POST() {
  // TODO: ToyyibPay callback in Phase 6
  return NextResponse.json({ ok: true });
}

export async function GET() {
  return NextResponse.json({ ok: true });
}
