import { NextResponse } from "next/server";
import { readSheet } from "@/lib/sheets-db";
import { getSession } from "@/lib/session";
import { findRow } from "@/lib/sheets-db";

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ ok: false, error: "Login required" }, { status: 401 });
    }

    const user = await findRow("Users", "id", session.userId);
    const email = user?.email ?? "";

    if (!email) {
      return NextResponse.json({ ok: true, orders: [] });
    }

    const rows = await readSheet("Orders");
    const filtered = rows.filter((r) => r.buyer_email === email);
    const sorted = filtered.sort((a, b) => (b.created_at ?? "").localeCompare(a.created_at ?? ""));

    return NextResponse.json({ ok: true, orders: sorted });
  } catch {
    return NextResponse.json({ ok: true, orders: [] });
  }
}
