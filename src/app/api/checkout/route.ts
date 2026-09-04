import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { order, orderItem, product } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { nanoid } from "@/lib/nanoid";
import { createBill } from "@/lib/toyyibpay";

export async function POST(req: Request) {
  try {
    const { items, paymentMethod, buyerName, buyerEmail, buyerPhone, buyerAddress } = (await req.json()) as {
      items: { slug: string; name: string; price: string; tag: string; quantity?: number }[];
      paymentMethod?: string;
      buyerName?: string;
      buyerEmail?: string;
      buyerPhone?: string;
      buyerAddress?: string;
    };

    if (!items || items.length === 0) {
      return NextResponse.json({ ok: false, error: "No items" }, { status: 400 });
    }

    if (!buyerEmail) {
      return NextResponse.json({ ok: false, error: "Email is required" }, { status: 400 });
    }

    // Calculate total
    let total = 0;
    for (const item of items) {
      const priceNum = parseFloat(item.price.replace("RM", "").trim());
      if (isNaN(priceNum)) continue;
      const qty = item.quantity || 1;
      total += priceNum * qty;
    }

    if (total <= 0) {
      return NextResponse.json({ ok: false, error: "Invalid total" }, { status: 400 });
    }

    // Create order
    const orderId = `ord_${nanoid()}`;
    
    await db.insert(order).values({
      orderId,
      email: buyerEmail,
      phone: buyerPhone || null,
      address: buyerAddress || null,
      total: String(total),
      currency: "MYR",
      method: paymentMethod || "toyyibpay",
      status: "pending",
    });

    // Create order items
    for (const item of items) {
      // Find product by slug
      const products = await db.select().from(product).where(eq(product.slug, item.slug));
      if (products.length > 0) {
        await db.insert(orderItem).values({
          orderItemId: `oi_${nanoid()}`,
          orderId,
          productId: products[0].productId,
          quantity: item.quantity || 1,
          unitPrice: item.price,
        });
      }
    }

    // Create ToyyibPay bill
    const bill = await createBill({
      orderId,
      amount: total,
      buyerName: buyerName || "Guest",
      buyerEmail: buyerEmail,
      description: `Liga Mahasiswa Shop Order - ${items.length} item(s)`,
    });

    if (bill.ok && bill.redirectUrl) {
      return NextResponse.json({ ok: true, url: bill.redirectUrl, orderId });
    }

    return NextResponse.json(
      { ok: false, error: bill.error || "Payment gateway error" },
      { status: 500 },
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
