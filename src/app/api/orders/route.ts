import { NextRequest, NextResponse } from "next/server";
import { readSheet } from "@/lib/sheets-db";
import { getSession } from "@/lib/session";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ ok: false, error: "Login required" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email") ?? "";

    if (!email) {
      return NextResponse.json({ ok: true, orders: [] });
    }

    const rows = await readSheet("Orders");
    const filtered = email
      ? rows.filter((r) => r.buyer_email === email)
      : [];
    const sorted = filtered.sort((a, b) => (b.created_at ?? "").localeCompare(a.created_at ?? ""));

    return NextResponse.json({ ok: true, orders: sorted });
  } catch {
    return NextResponse.json({ ok: true, orders: [] });
  }
}
