import Link from "next/link";
import { Shell } from "@/components/shells";
import { PageHead } from "@/components/sections";
import { getCurrentUser } from "@/lib/auth";
import { readSheet } from "@/lib/sheets-db";

const DIR = 27;

export default async function AdminPage() {
  const user = await getCurrentUser();

  if (!user || user.role !== "admin") {
    return (
      <Shell dir={DIR}>
        <PageHead kicker="Admin" title="Access denied" />
        <section className="border-b border-line">
          <div className="mx-auto w-full max-w-2xl px-4 py-16 text-center sm:px-6">
            <p className="text-[15px] text-ink/60">You do not have admin access.</p>
            <Link href="/dashboard" className="press mt-6 inline-block border border-2 border-ink bg-brand px-5 py-3 text-[13px] font-extrabold uppercase tracking-[0.14em] text-white">
              Back to dashboard
            </Link>
          </div>
        </section>
      </Shell>
    );
  }

  const [allUsers, pendingZines, allOrders] = await Promise.all([
    readSheet("Users").catch(() => []),
    readSheet("Zines", { status: "pending" }).catch(() => []),
    readSheet("Orders").catch(() => []),
  ]);

  return (
    <Shell dir={DIR}>
      <PageHead
        kicker="Admin"
        title="Admin panel"
        sub="Manage users, orders, content, and settings across all chapters."
      />
      <section className="border-b border-line">
        <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6">
          <div className="grid gap-3">
            <Link href="/admin/users" className="group flex items-center justify-between border border-line bg-cream px-5 py-4 hover:border-brand hover:bg-brand/5 transition-colors">
              <div>
                <p className="text-[15px] font-bold">User management</p>
                <p className="mono text-[12px] text-ink/50">Change roles, manage status, search accounts</p>
              </div>
              <span className="mono text-[12px] text-ink/30 group-hover:text-brand transition-colors">{"\u2192"}</span>
            </Link>
            <Link href="/admin/orders" className="group flex items-center justify-between border border-line bg-cream px-5 py-4 hover:border-brand hover:bg-brand/5 transition-colors">
              <div>
                <p className="text-[15px] font-bold">Order management</p>
                <p className="mono text-[12px] text-ink/50">View all orders, update payment status</p>
              </div>
              <span className="mono text-[12px] text-ink/30 group-hover:text-brand transition-colors">{"\u2192"}</span>
            </Link>
            <Link href="/admin/zines" className="group flex items-center justify-between border border-line bg-cream px-5 py-4 hover:border-brand hover:bg-brand/5 transition-colors">
              <div>
                <p className="text-[15px] font-bold">Zine approval</p>
                <p className="mono text-[12px] text-ink/50">Review and approve zine submissions</p>
              </div>
              <span className="mono text-[12px] text-ink/30 group-hover:text-brand transition-colors">{"\u2192"}</span>
            </Link>
            <Link href="/admin/nominations" className="group flex items-center justify-between border border-line bg-cream px-5 py-4 hover:border-brand hover:bg-brand/5 transition-colors">
              <div>
                <p className="text-[15px] font-bold">PRK nominations</p>
                <p className="mono text-[12px] text-ink/50">Review and approve election nominations</p>
              </div>
              <span className="mono text-[12px] text-ink/30 group-hover:text-brand transition-colors">{"\u2192"}</span>
            </Link>
            <Link href="/admin/settings" className="group flex items-center justify-between border border-line bg-cream px-5 py-4 hover:border-brand hover:bg-brand/5 transition-colors">
              <div>
                <p className="text-[15px] font-bold">Settings</p>
                <p className="mono text-[12px] text-ink/50">Membership fee, duration, site config</p>
              </div>
              <span className="mono text-[12px] text-ink/30 group-hover:text-brand transition-colors">{"\u2192"}</span>
            </Link>
          </div>
        </div>
      </section>
      <section className="border-b border-line">
        <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6">
          <h2 className="display text-2xl">Quick stats</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="border border-line bg-cream p-5">
              <p className="mono text-[11px] uppercase tracking-[0.14em] text-ink/50">Total users</p>
              <p className="display mt-2 text-3xl">{allUsers.length}</p>
            </div>
            <div className="border border-line bg-cream p-5">
              <p className="mono text-[11px] uppercase tracking-[0.14em] text-ink/50">Pending zines</p>
              <p className="display mt-2 text-3xl">{pendingZines.length}</p>
            </div>
            <div className="border border-line bg-cream p-5">
              <p className="mono text-[11px] uppercase tracking-[0.14em] text-ink/50">Total orders</p>
              <p className="display mt-2 text-3xl">{allOrders.length}</p>
            </div>
          </div>
        </div>
      </section>
    </Shell>
  );
}
