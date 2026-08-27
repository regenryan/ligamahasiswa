"use client";

import { Shell } from "@/components/shells";
import { PageHead } from "@/components/sections";
import Link from "next/link";

type AuditRow = {
  id: string;
  userId: string;
  action: string;
  targetType: string;
  targetId: string;
  details: string;
  ip: string;
  createdAt: string;
};

export function AdminAuditClient({ logs }: { logs: AuditRow[] }) {
  return (
    <Shell dir={27}>
      <PageHead kicker="Admin" title="Audit Logs" sub="System-wide activity logging." />
      <section className="border-b border-line">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <Link href="/admin" className="mono mb-6 inline-block text-[11px] uppercase tracking-[0.14em] text-ink/50 hover:text-brand transition-colors">
            {"\u2190"} Back to admin
          </Link>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[14px]">
              <thead>
                <tr className="border-b border-line bg-cream">
                  <th className="px-4 py-3 font-bold">Time</th>
                  <th className="px-4 py-3 font-bold">User</th>
                  <th className="px-4 py-3 font-bold">Action</th>
                  <th className="px-4 py-3 font-bold">Target</th>
                  <th className="px-4 py-3 font-bold">Details</th>
                  <th className="px-4 py-3 font-bold">IP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-ink/50">
                      No audit logs found.
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.id} className="hover:bg-cream transition-colors">
                      <td className="px-4 py-3 mono text-[11px] text-ink/60 whitespace-nowrap">{new Date(log.createdAt).toLocaleString()}</td>
                      <td className="px-4 py-3 mono text-[12px]">{log.userId || "System"}</td>
                      <td className="px-4 py-3 text-brand-text font-bold">{log.action}</td>
                      <td className="px-4 py-3">
                        {log.targetType && log.targetId ? `${log.targetType} (${log.targetId})` : "-"}
                      </td>
                      <td className="px-4 py-3 mono text-[10px] text-ink/50 max-w-[200px] truncate" title={log.details}>
                        {log.details || "-"}
                      </td>
                      <td className="px-4 py-3 mono text-[11px] text-ink/50">{log.ip || "-"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </Shell>
  );
}