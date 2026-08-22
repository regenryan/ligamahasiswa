import { Shell } from "@/components/shells";
import { PageHead } from "@/components/sections";
import { getCurrentUser } from "@/lib/auth";
import { readSheet } from "@/lib/sheets-db";
import Link from "next/link";

export default async function AdminOrdersPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return (
      <Shell dir={27}>
        <PageHead kicker="Admin" title="Access denied" />
        <section className="border-b border-line">
          <div className="mx-auto w-full max-w-2xl px-4 py-16 text-center sm:px-6">
            <Link href="/dashboard" className="press mt-6 inline-block border border-2 border-ink bg-brand px-5 py-3 text-[13px] font-extrabold uppercase tracking-[0.14em] text-white">Back to dashboard</Link>
          </div>
        </section>
      </Shell>
    );
  }

  const orders = await readSheet("Orders").catch(() => []);
  const sorted = orders.sort((a, b) => (b.created_at ?? "").localeCompare(a.created_at ?? ""));

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
        <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6">
          <Link href="/admin" className="mono mb-6 inline-block text-[11px] uppercase tracking-[0.14em] text-ink/50 hover:text-brand transition-colors">
            {"\u2190"} Back to admin
          </Link>
          {sorted.length === 0 ? (
            <p className="border border-dashed border-line p-8 text-center text-[14px] text-ink/50">No orders yet.</p>
          ) : (
            <div className="space-y-3">
              {sorted.map((o) => (
                <div key={o.id} className="border border-line bg-cream p-4 sm:flex sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="mono text-[12px] text-ink/50">{o.id}</p>
                    <p className="mt-1 text-[14px] font-bold">{o.buyer_name || "Unknown"} / {o.buyer_email || "No email"}</p>
                    <p className="mono text-[12px] text-ink/40">{o.items || "Shop order"} / {o.payment_method || "N/A"}</p>
                  </div>
                  <div className="mt-3 flex items-center gap-4 sm:mt-0">
                    <span className={`mono text-[11px] uppercase tracking-[0.12em] px-2 py-1 ${statusColors[o.payment_status ?? "pending"] ?? statusColors.pending}`}>
                      {o.payment_status ?? "pending"}
                    </span>
                    <span className="display text-lg">{o.amount} {o.currency}</span>
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
