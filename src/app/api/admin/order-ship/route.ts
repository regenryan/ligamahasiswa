import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { order } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const u = await getCurrentUser();
    if (!u || u.role !== "admin") {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const { orderId, trackingUrl, trackingCode } = (await req.json()) as {
      orderId?: string;
      trackingUrl?: string;
      trackingCode?: string;
    };

    if (!orderId) {
      return NextResponse.json({ ok: false, error: "Missing orderId" }, { status: 400 });
    }

    // Find the order
    const orders = await db.select().from(order).where(eq(order.orderId, orderId));
    if (orders.length === 0) {
      return NextResponse.json({ ok: false, error: "Order not found" }, { status: 404 });
    }

    // Update tracking info and set status to shipped
    await db.update(order).set({
      trackingUrl: trackingUrl || null,
      trackingCode: trackingCode || null,
      status: "shipped",
      updatedAt: new Date(),
    }).where(eq(order.orderId, orderId));

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[admin/order-ship] error:", err);
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Failed to update order" },
      { status: 500 },
    );
  }
}
