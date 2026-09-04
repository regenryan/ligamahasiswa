import { Shell } from "@/components/shells";
import { PageHead, Btn } from "@/components/sections";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { order } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { ShipOrderClient } from "./client";

export default async function ShipOrderPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return (
      <Shell dir={27}>
        <PageHead kicker="Admin" title="Access denied" />
        <section className="border-b border-line">
          <div className="mx-auto w-full max-w-2xl px-4 py-16 text-center sm:px-6">
            <p className="text-[15px] text-ink/60">You do not have admin access.</p>
            <div className="mt-6">
              <Btn kind="join" href="/dashboard">Back to dashboard</Btn>
            </div>
          </div>
        </section>
      </Shell>
    );
  }

  // Get paid orders that need shipping
  const rows = await db.select().from(order).where(eq(order.status, "paid"));
  const sorted = rows.sort((a, b) => (String(b.createdAt ?? "")).localeCompare(String(a.createdAt ?? "")));

  const orders = sorted.map(o => ({
    orderId: o.orderId,
    email: o.email || "",
    status: o.status || "pending",
    total: o.total || "0",
    currency: o.currency || "MYR",
    trackingUrl: o.trackingUrl,
    trackingCode: o.trackingCode,
    createdAt: o.createdAt ? String(o.createdAt) : "",
  }));

  return <ShipOrderClient orders={orders} />;
}
