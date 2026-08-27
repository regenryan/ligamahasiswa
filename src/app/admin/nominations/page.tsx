import { Shell } from "@/components/shells";
import { PageHead } from "@/components/sections";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { nomination } from "@/lib/schema";
import Link from "next/link";
import AdminNominationsClient from "./client";

export default async function AdminNominationsPage() {
  const user = await getCurrentUser();
  if (!user || (user.role !== "admin" && user.role !== "committee")) {
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

  const rows = await db.select().from(nomination);
  const nominations = rows.map((r) => ({
    id: r.nominationId,
    name: r.name ?? "",
    chapter: r.chapterId ?? "",
    status: r.status ?? "pending",
    position: r.nominationId,
    created_at: r.createdAt ? String(r.createdAt) : "",
    justification: r.justification ?? "",
  }));
  return <AdminNominationsClient nominations={nominations} />;
}
