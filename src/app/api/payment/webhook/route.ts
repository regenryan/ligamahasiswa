import { NextRequest, NextResponse } from "next/server";
import { config } from "@/lib/config";
import { readSheet, updateSheet, writeSheet } from "@/lib/sheets-db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!config.hitpaySalt) {
      return NextResponse.json({ ok: false, error: "Webhook not configured" }, { status: 503 });
    }

    const signature = req.headers.get("x-hitpay-signature") ?? "";
    const payload = JSON.stringify(body);
    const crypto = await import("crypto");
    const expected = crypto
      .createHmac("sha256", config.hitpaySalt)
      .update(payload)
      .digest("hex");

    if (signature !== expected) {
      return NextResponse.json({ ok: false, error: "Invalid signature" }, { status: 401 });
    }

    const { reference_no, status, payment_id, amount, currency, buyer_name, buyer_email, payment_method } = body;

    console.log(`[HitPay] Payment ${payment_id}: ${status} (${reference_no})`);

    const existing = await readSheet("Orders", { id: reference_no }).catch(() => []);

    if (existing.length > 0) {
      await updateSheet("Orders", "id", reference_no, {
        hitpay_id: payment_id ?? "",
        payment_status: status ?? "unknown",
        amount: amount ?? existing[0].amount ?? "0",
        currency: currency ?? "MYR",
        payment_method: payment_method ?? "hitpay",
        buyer_name: buyer_name ?? existing[0].buyer_name ?? "",
        buyer_email: buyer_email ?? existing[0].buyer_email ?? "",
        updated_at: new Date().toISOString(),
      });
    } else {
      await writeSheet("Orders", {
        id: reference_no ?? `order_${Date.now()}`,
        hitpay_id: payment_id ?? "",
        amount: amount ?? "0",
        currency: currency ?? "MYR",
        payment_method: payment_method ?? "hitpay",
        payment_status: status ?? "unknown",
        items: body.purpose ?? "",
        buyer_email: buyer_email ?? "",
        buyer_name: buyer_name ?? "",
        created_at: new Date().toISOString(),
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[HitPay] Webhook error:", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ ok: true });
}
