import { NextResponse } from "next/server";
import { config } from "@/lib/config";

const HITPAY_API = "https://api.hit-pay.com/v1";

export async function POST(req: Request) {
  try {
    const { items } = (await req.json()) as {
      items: { name: string; price: string; tag: string }[];
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

    const params = new URLSearchParams({
      amount: String(total.toFixed(2)),
      currency: "myr",
      purpose: `Liga Mahasiswa - ${items.map((p) => p.name).join(", ")}`,
      reference_number: ref,
      redirect_url: `${config.siteUrl}/shop/checkout/success?ref=${ref}`,
      "payment_methods[]": "fpx",
    });

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
