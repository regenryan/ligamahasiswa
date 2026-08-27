import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { db } from "@/lib/db";
import { user, order } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ ok: false, error: "Login required" }, { status: 401 });
    }

    const u = await db.select().from(user).where(eq(user.userId, session.userId));
    const email = u[0]?.email ?? "";

    if (!email) {
      return NextResponse.json({ ok: true, orders: [] });
    }

    const rows = await db.select().from(order).where(eq(order.email, email));
    const sorted = rows.sort((a, b) => (String(b.createdAt) ?? "").localeCompare(String(a.createdAt) ?? ""));

    return NextResponse.json({ ok: true, orders: sorted });
  } catch {
    return NextResponse.json({ ok: true, orders: [] });
  }
}
