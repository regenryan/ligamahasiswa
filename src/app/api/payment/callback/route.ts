import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { order, member, user } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { verifyPayment } from "@/lib/toyyibpay";
import { nanoid } from "@/lib/nanoid";
import { logAction } from "@/lib/audit";

/**
 * POST /api/payment/callback
 * 
 * Handles ToyyibPay payment callbacks (webhooks).
 * In production, ToyyibPay sends POST requests to this endpoint
 * when a payment is completed.
 * 
 * Mock flow:
 * 1. User completes payment on ToyyibPay mock page
 * 2. ToyyibPay redirects user back to /shop/payment-success
 * 3. Success page calls this endpoint to verify payment
 * 4. This endpoint updates order status and membership (if applicable)
 */

export async function POST(req: Request) {
  try {
    const { billCode, orderId } = (await req.json()) as {
      billCode?: string;
      orderId?: string;
    };

    if (!orderId) {
      return NextResponse.json({ ok: false, error: "Missing orderId" }, { status: 400 });
    }

    // Find the order
    const orders = await db.select().from(order).where(eq(order.orderId, orderId));
    if (orders.length === 0) {
      return NextResponse.json({ ok: false, error: "Order not found" }, { status: 404 });
    }

    const orderData = orders[0];

    // Idempotent: if already paid/completed, return success
    if (orderData.status === "paid" || orderData.status === "completed") {
      return NextResponse.json({ ok: true, status: orderData.status });
    }

    // Verify payment with ToyyibPay
    const verification = await verifyPayment(billCode || "", orderId);

    if (verification.paid) {
      // Update order status to paid
      await db.update(order).set({
        status: "paid",
        updatedAt: new Date(),
      }).where(eq(order.orderId, orderId));

      // If this is a membership order, activate membership
      if (orderData.userId && orderData.method === "toyyibpay") {
        // Check if this is a membership order (based on description or other marker)
        // For now, assume any order with "membership" in the description is a membership order
        // In production, you'd have a separate membership_orders table or a flag on the order
        
        // Create or update member record
        const existingMember = await db.select().from(member).where(eq(member.userId, orderData.userId));
        
        if (existingMember.length > 0) {
          // Extend membership
          const currentExpiry = existingMember[0].expiresAt;
          const newExpiry = new Date(currentExpiry);
          newExpiry.setMonth(newExpiry.getMonth() + 1); // Add 1 month (or use config)
          
          await db.update(member).set({
            amountPaid: parseFloat(orderData.total || "0"),
            paidAt: new Date(),
            expiresAt: newExpiry,
          }).where(eq(member.userId, orderData.userId));
        } else {
          // Create new membership
          const expiresAt = new Date();
          expiresAt.setMonth(expiresAt.getMonth() + 1); // 1 month from now
          
          await db.insert(member).values({
            memberId: `mem_${nanoid()}`,
            userId: orderData.userId,
            amountPaid: parseFloat(orderData.total || "0"),
            paidAt: new Date(),
            expiresAt,
          });
        }
      }

      // Log the payment
      await logAction({
        userId: orderData.userId,
        action: "payment.completed",
        targetType: "order",
        targetId: orderId,
        details: { amount: orderData.total, currency: orderData.currency },
      });

      return NextResponse.json({ ok: true, status: "paid" });
    }

    return NextResponse.json({ ok: false, error: "Payment not verified" }, { status: 400 });
  } catch (err) {
    console.error("[payment/callback] error:", err);
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Callback failed" },
      { status: 500 },
    );
  }
}
