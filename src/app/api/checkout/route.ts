import { NextResponse } from "next/server";
import { config } from "@/lib/config";

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

    // TODO: ToyyibPay integration in Phase 6
    return NextResponse.json(
      { ok: false, error: "Payment integration coming soon" },
      { status: 503 },
    );
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
