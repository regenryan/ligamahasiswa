import { Shell } from "@/components/shells";
import { PageHead } from "@/components/sections";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { user } from "@/lib/schema";
import Link from "next/link";
import AdminUsersClient from "./client";

export default async function AdminUsersPage() {
  const currentUser = await getCurrentUser();
  if (!currentUser || currentUser.role !== "admin") {
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

  const rows = await db.select().from(user);
  const users = rows.map((r) => ({
    id: r.userId,
    username: r.username,
    name: r.name ?? "",
    email: r.email,
    phone: r.phone ?? "",
    chapter: "",
    role: "user",
    status: "active",
    member_id: "",
    created_at: r.createdAt ? String(r.createdAt) : "",
  }));
  return <AdminUsersClient users={users} />;
}
