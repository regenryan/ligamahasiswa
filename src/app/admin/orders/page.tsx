import { Shell } from "@/components/shells";
import { PageHead, Btn } from "@/components/sections";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { order } from "@/lib/schema";
import Link from "next/link";

export default async function AdminOrdersPage() {
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

  const rows = await db.select().from(order);
  const sorted = rows.sort((a, b) => (String(b.createdAt ?? "")).localeCompare(String(a.createdAt ?? "")));

  const statusColors: Record<string, string> = {
    completed: "bg-term/20 text-term",
    paid: "bg-term/20 text-term",
    pending: "bg-midnight text-ink/50",
    failed: "bg-brand/10 text-ink/40",
    cancelled: "bg-brand/10 text-ink/40",
  };

  return (
    <Shell dir={27}>
      <PageHead kicker="Admin" title="Order management" sub="View all orders and update payment status." />
      <section className="border-b border-line">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <Link href="/admin" className="mono mb-6 inline-block text-[11px] uppercase tracking-[0.14em] text-ink/50 hover:text-brand transition-colors">
            {"\u2190"} Back to admin
          </Link>
          {sorted.length === 0 ? (
            <p className="border border-dashed border-line p-8 text-center text-[14px] text-ink/50">No orders yet.</p>
          ) : (
            <div className="space-y-3">
              {sorted.map((o) => (
                <div key={o.orderId} className="border border-line bg-cream p-4 sm:flex sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="mono text-[12px] text-ink/50">{o.orderId}</p>
                    <p className="mt-1 text-[14px] font-bold">{o.email || "No email"}</p>
                    <p className="mono text-[12px] text-ink/40">{o.method || "N/A"}</p>
                  </div>
                  <div className="mt-3 flex items-center gap-4 sm:mt-0">
                    <span className={`mono text-[11px] uppercase tracking-[0.12em] px-2 py-1 ${statusColors[o.status ?? "pending"] ?? statusColors.pending}`}>
                      {o.status ?? "pending"}
                    </span>
                    <span className="display text-lg">{o.total} {o.currency}</span>
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
