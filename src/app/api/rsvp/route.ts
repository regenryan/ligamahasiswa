import { NextRequest, NextResponse } from "next/server";

export async function POST(_req: NextRequest) {
  return NextResponse.json({ ok: false, error: "RSVP feature coming soon" }, { status: 501 });
}

export async function DELETE(_req: NextRequest) {
  return NextResponse.json({ ok: true });
}

export async function GET(_req: NextRequest) {
  return NextResponse.json({ ok: true, count: 0, rsvps: [] });
}
