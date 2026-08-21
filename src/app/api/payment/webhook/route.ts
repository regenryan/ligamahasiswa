import { NextRequest, NextResponse } from "next/server";
import { config } from "@/lib/config";

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

    const { reference_no, status, payment_id } = body;

    console.log(`[HitPay] Payment ${payment_id}: ${status} (${reference_no})`);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[HitPay] Webhook error:", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ ok: true });
}
