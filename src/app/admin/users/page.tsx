import { Shell } from "@/components/shells";
import { PageHead } from "@/components/sections";
import { getCurrentUser } from "@/lib/auth";
import { readSheet } from "@/lib/sheets-db";
import Link from "next/link";
import AdminUsersClient from "./client";

export default async function AdminUsersPage() {
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

  const users = await readSheet("Users").catch(() => []);

  return <AdminUsersClient users={users} />;
}
