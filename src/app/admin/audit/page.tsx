import { Shell } from "@/components/shells";
import { PageHead } from "@/components/sections";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { auditLog } from "@/lib/schema";
import { desc } from "drizzle-orm";
import Link from "next/link";
import { AdminAuditClient } from "./client";

export default async function AdminAuditPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return (
      <Shell dir={27}>
        <PageHead kicker="Admin" title="Access denied" />
        <section className="border-b border-line">
          <div className="mx-auto w-full max-w-2xl px-4 py-16 text-center sm:px-6">
            <Link href="/dashboard" className="press mt-6 inline-block border border-2 border-ink bg-brand px-5 py-3 text-[13px] font-extrabold uppercase tracking-[0.14em] text-paper">Back to dashboard</Link>
          </div>
        </section>
      </Shell>
    );
  }

  const logsRaw = await db.select().from(auditLog).orderBy(desc(auditLog.createdAt)).limit(100);
  
  const logs = logsRaw.map(l => ({
    id: l.logId,
    userId: l.userId ?? "",
    action: l.action,
    targetType: l.targetType ?? "",
    targetId: l.targetId ?? "",
    details: l.details ?? "",
    ip: l.ip ?? "",
    createdAt: l.createdAt ? String(l.createdAt) : "",
  }));

  return <AdminAuditClient logs={logs} />;
}