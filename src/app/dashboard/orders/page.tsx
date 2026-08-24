import Link from "next/link";
import { Shell } from "@/components/shells";
import { PageHead, Btn } from "@/components/sections";
import { requireAuth } from "@/lib/auth";
import { readSheet } from "@/lib/sheets-db";

const DIR = 27;

export default async function OrderHistoryPage() {
  const user = await requireAuth();
  if (!user) {
    return (
      <Shell dir={DIR}>
        <PageHead kicker="Dashboard" title="Login required" />
        <section className="border-b border-line">
          <div className="mx-auto w-full max-w-2xl px-4 py-16 text-center sm:px-6">
            <p className="text-[15px] text-ink/60">Please log in to view your orders.</p>
            <div className="mt-6">
              <Btn kind="join" href="/login">Log in</Btn>
            </div>
          </div>
        </section>
      </Shell>
    );
  }

  const email = user.email ?? "";
  const orders = email
    ? (await readSheet("Orders", { buyer_email: email })).sort(
        (a, b) => (b.created_at ?? "").localeCompare(a.created_at ?? ""),
      )
    : [];

  const statusColors: Record<string, string> = {
    completed: "bg-term/20 text-term",
    paid: "bg-term/20 text-term",
    pending: "bg-midnight text-ink/50",
    failed: "bg-brand/10 text-ink/40",
    cancelled: "bg-brand/10 text-ink/40",
  };

  return (
    <Shell dir={DIR}>
      <PageHead kicker="Dashboard" title="Order history" sub="View all your purchases from the Liga shop." />
      <section className="border-b border-line">
        <div className="mx-auto w-full max-w-4xl px-4 py-16 sm:px-6">
          {orders.length === 0 ? (
            <div className="text-center">
              <p className="text-[15px] text-ink/50">No orders yet.</p>
              <div className="mt-6">
                <Btn kind="join" href="/shop">Visit shop</Btn>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="border border-line bg-cream p-4 sm:flex sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="mono text-[12px] text-ink/50">
                      {order.id}
                    </p>
                    <p className="mt-1 text-[14px] font-bold">
                      {order.items || "Shop order"}
                    </p>
                    <p className="mono text-[12px] text-ink/40">
                      {order.created_at
                        ? new Date(order.created_at).toLocaleDateString("en-MY", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : ""}
                    </p>
                  </div>
                  <div className="mt-3 flex items-center gap-4 sm:mt-0">
                    <span
                      className={`mono text-[11px] uppercase tracking-[0.12em] px-2 py-1 ${
                        statusColors[order.payment_status ?? "pending"] ?? statusColors.pending
                      }`}
                    >
                      {order.payment_status ?? "pending"}
                    </span>
                    <span className="display text-lg">{order.amount} {order.currency}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </Shell>
  );
}
