import { NextRequest, NextResponse } from "next/server";
import { readSheet, writeSheet, updateSheet } from "@/lib/sheets-db";
import { getSession } from "@/lib/session";

function getClientIp(req: NextRequest): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
}

export async function POST(req: NextRequest) {
  try {
    const { eventSlug } = (await req.json()) as { eventSlug: string };

    if (!eventSlug) {
      return NextResponse.json({ ok: false, error: "Missing eventSlug" }, { status: 400 });
    }

    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ ok: false, error: "Login required" }, { status: 401 });
    }

    const existing = await readSheet("RSVPs", {
      user_id: session.userId,
      event_slug: eventSlug,
    });

    if (existing.length > 0) {
      return NextResponse.json({ ok: false, error: "Already RSVPed" }, { status: 409 });
    }

    const ip = getClientIp(req);

    await writeSheet("RSVPs", {
      id: `rsvp_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      user_id: session.userId,
      event_slug: eventSlug,
      status: "going",
      ip,
      created_at: new Date().toISOString(),
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await req.json();

    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ ok: false, error: "Login required" }, { status: 401 });
    }

    await updateSheet("RSVPs", "user_id", session.userId, { status: "cancelled" });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const eventSlug = searchParams.get("event") ?? "";

    if (!eventSlug) {
      return NextResponse.json({ ok: false, error: "Missing event param" }, { status: 400 });
    }

    const rsvps = await readSheet("RSVPs", { event_slug: eventSlug });
    const going = rsvps.filter((r) => r.status === "going");

    return NextResponse.json({ ok: true, count: going.length, rsvps: going });
  } catch {
    return NextResponse.json({ ok: false, count: 0 });
  }
}
