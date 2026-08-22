import { NextResponse } from "next/server";
import { config } from "@/lib/config";
import { writeSheet } from "@/lib/sheets-db";

const HITPAY_API = "https://api.hit-pay.com/v1";

export async function POST(req: Request) {
  try {
    const { items, paymentMethod, buyerName, buyerEmail } = (await req.json()) as {
      items: { name: string; price: string; tag: string }[];
      paymentMethod?: string;
      buyerName?: string;
      buyerEmail?: string;
    };

    if (!items || items.length === 0) {
      return NextResponse.json({ ok: false, error: "No items" }, { status: 400 });
    }

    if (!config.hitpayApiKey) {
      return NextResponse.json(
        { ok: false, error: "HitPay not configured" },
        { status: 503 },
      );
    }

    const total = items.reduce(
      (sum, p) => sum + Number(p.price.replace("RM", "")),
      0,
    );
    const ref = `LM-${Date.now()}`;
    const method = paymentMethod || "fpx";

    await writeSheet("Orders", {
      id: ref,
      hitpay_id: "",
      amount: total.toFixed(2),
      currency: "MYR",
      payment_method: method,
      payment_status: "pending",
      items: items.map((p) => p.name).join(", "),
      buyer_email: buyerEmail ?? "",
      buyer_name: buyerName ?? "",
      created_at: new Date().toISOString(),
    });

    const params = new URLSearchParams({
      amount: String(total.toFixed(2)),
      currency: "myr",
      purpose: `Liga Mahasiswa - ${items.map((p) => p.name).join(", ")}`,
      reference_number: ref,
      redirect_url: `${config.siteUrl}/shop/checkout/success?ref=${ref}`,
      webhook_url: `${config.siteUrl}/api/payment/webhook`,
      "payment_methods[]": method,
    });

    if (buyerName) params.set("buyer_name", buyerName);
    if (buyerEmail) params.set("buyer_email", buyerEmail);

    const res = await fetch(`${HITPAY_API}/payment-requests`, {
      method: "POST",
      headers: {
        "X-BUSINESS-API-KEY": config.hitpayApiKey,
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Requested-With": "XMLHttpRequest",
      },
      body: params.toString(),
    });

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json(
        { ok: false, error: `HitPay ${res.status}: ${err}` },
        { status: 502 },
      );
    }

    const data = await res.json();
    return NextResponse.json({
      ok: true,
      url: data.url,
      reference: data.reference_number,
    });
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        error: err instanceof Error ? err.message : "Checkout failed",
      },
      { status: 500 },
    );
  }
}
