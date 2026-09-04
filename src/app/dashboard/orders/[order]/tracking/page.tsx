import { Shell } from "@/components/shells";
import { PageHead, Btn } from "@/components/sections";
import { requireAuth } from "@/lib/auth";
import { db } from "@/lib/db";
import { eq, and } from "drizzle-orm";
import { order, orderItem, product } from "@/lib/schema";
import Link from "next/link";

export default async function OrderTrackingPage({ params }: { params: Promise<{ order: string }> }) {
  const user = await requireAuth();
  if (!user) {
    return (
      <Shell dir={27}>
        <PageHead kicker="Dashboard" title="Login required" />
        <section className="border-b border-line">
          <div className="mx-auto w-full max-w-2xl px-4 py-16 text-center sm:px-6">
            <p className="text-[15px] text-ink/60">Please log in to view your order.</p>
            <div className="mt-6">
              <Btn kind="join" href="/login">Log in</Btn>
            </div>
          </div>
        </section>
      </Shell>
    );
  }

  const { order: orderId } = await params;

  // Find the order (must belong to this user)
  const orders = await db.select().from(order).where(
    and(eq(order.orderId, orderId), eq(order.email, user.email))
  );

  if (orders.length === 0) {
    return (
      <Shell dir={27}>
        <PageHead kicker="Dashboard" title="Order not found" />
        <section className="border-b border-line">
          <div className="mx-auto w-full max-w-2xl px-4 py-16 text-center sm:px-6">
            <p className="text-[15px] text-ink/60">This order does not exist or does not belong to you.</p>
            <div className="mt-6">
              <Btn kind="join" href="/dashboard/orders">Back to orders</Btn>
            </div>
          </div>
        </section>
      </Shell>
    );
  }

  const o = orders[0];

  // Get order items
  const items = await db.select({
    orderId: orderItem.orderId,
    productId: orderItem.productId,
    quantity: orderItem.quantity,
    unitPrice: orderItem.unitPrice,
    productName: product.name,
    productSlug: product.slug,
  }).from(orderItem).leftJoin(product, eq(orderItem.productId, product.productId)).where(eq(orderItem.orderId, orderId));

  const statusColors: Record<string, string> = {
    completed: "bg-term/20 text-term",
    paid: "bg-term/20 text-term",
    shipped: "bg-blue-500/10 text-blue-600",
    pending: "bg-midnight text-ink/50",
    cancelled: "bg-brand/10 text-ink/40",
  };

  const steps = ["pending", "paid", "shipped", "completed"];
  const currentStep = steps.indexOf(o.status || "pending");

  return (
    <Shell dir={27}>
      <PageHead kicker="Dashboard" title="Order tracking" sub={`Order ${orderId}`} />
      <section className="border-b border-line">
        <div className="mx-auto w-full max-w-4xl px-4 py-16 sm:px-6">
          <Link href="/dashboard/orders" className="mono mb-6 inline-block text-[11px] uppercase tracking-[0.14em] text-ink/50 hover:text-brand transition-colors">
            {"\u2190"} Back to orders
          </Link>

          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {steps.map((step, i) => (
                <div key={step} className="flex flex-col items-center">
                  <div className={`flex h-8 w-8 items-center justify-center border-2 text-[12px] font-bold ${
                    i <= currentStep
                      ? "border-brand bg-brand text-paper"
                      : "border-line bg-cream text-ink/30"
                  }`}>
                    {i < currentStep ? "\u2713" : i + 1}
                  </div>
                  <p className="mono mt-1 text-[10px] uppercase tracking-[0.1em] text-ink/50">{step}</p>
                </div>
              ))}
            </div>
            <div className="mt-2 h-0.5 bg-line" />
          </div>

          {/* Order details */}
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="border border-line bg-cream p-4">
              <h3 className="display text-lg mb-3">Order details</h3>
              <p className="mono text-[12px] text-ink/50">Order ID</p>
              <p className="mono text-[14px] font-bold">{o.orderId}</p>
              <p className="mono mt-2 text-[12px] text-ink/50">Date</p>
              <p className="text-[14px]">
                {o.createdAt ? new Date(o.createdAt).toLocaleDateString("en-MY", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }) : "-"}
              </p>
              <p className="mono mt-2 text-[12px] text-ink/50">Status</p>
              <span className={`mono text-[11px] uppercase tracking-[0.12em] px-2 py-1 ${statusColors[o.status ?? "pending"] ?? statusColors.pending}`}>
                {o.status ?? "pending"}
              </span>
            </div>

            <div className="border border-line bg-cream p-4">
              <h3 className="display text-lg mb-3">Shipping</h3>
              {o.trackingCode ? (
                <>
                  <p className="mono text-[12px] text-ink/50">Tracking code</p>
                  <p className="mono text-[14px] font-bold">{o.trackingCode}</p>
                  {o.trackingUrl && (
                    <>
                      <p className="mono mt-2 text-[12px] text-ink/50">Track your package</p>
                      <a href={o.trackingUrl} target="_blank" rel="noreferrer" className="text-[14px] text-brand hover:underline">
                        View tracking page {"\u2192"}
                      </a>
                    </>
                  )}
                </>
              ) : (
                <p className="text-[14px] text-ink/50">Tracking info will be added once the order is shipped.</p>
              )}
            </div>
          </div>

          {/* Order items */}
          <div className="mt-6 border border-line bg-cream p-4">
            <h3 className="display text-lg mb-3">Items</h3>
            {items.length === 0 ? (
              <p className="text-[14px] text-ink/50">No items found.</p>
            ) : (
              <ul className="space-y-2">
                {items.map((item, i) => (
                  <li key={i} className="flex items-center justify-between border-b border-line py-2 last:border-0">
                    <div>
                      <p className="text-[14px] font-bold">{item.productName || "Unknown product"}</p>
                      <p className="mono text-[12px] text-ink/50">Qty: {item.quantity || 1}</p>
                    </div>
                    <span className="mono text-[14px]">{item.unitPrice}</span>
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-3 flex items-center justify-between border-t border-line pt-3">
              <span className="mono text-[13px] uppercase tracking-[0.12em] text-ink/50">Total</span>
              <span className="display text-xl">{o.total} {o.currency}</span>
            </div>
          </div>
        </div>
      </section>
    </Shell>
  );
}
