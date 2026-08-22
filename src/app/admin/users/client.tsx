"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Shell } from "@/components/shells";
import { PageHead } from "@/components/sections";
import Link from "next/link";
import { approveUser, rejectUser, setUserRole } from "../actions";

type UserRow = {
  [key: string]: string;
};

function UserActions({ user }: { user: UserRow }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const handleApprove = async () => {
    startTransition(async () => {
      await approveUser(user.id);
      router.refresh();
    });
  };

  const handleReject = async () => {
    startTransition(async () => {
      await rejectUser(user.id);
      router.refresh();
    });
  };

  const handleRoleChange = (newRole: string) => {
    startTransition(async () => {
      await setUserRole(user.id, newRole);
      router.refresh();
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {user.status === "pending" && (
        <>
          <button onClick={handleApprove} disabled={pending} className="border border-term/40 bg-term/10 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.12em] text-term hover:bg-term/20 transition-colors disabled:opacity-50">
            Approve
          </button>
          <button onClick={handleReject} disabled={pending} className="border border-brand/40 bg-brand/10 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.12em] text-brand-text hover:bg-brand/20 transition-colors disabled:opacity-50">
            Reject
          </button>
        </>
      )}
      <select
        value={user.role}
        onChange={(e) => handleRoleChange(e.target.value)}
        disabled={pending}
        className="border border-line bg-midnight px-2 py-1.5 text-[11px] uppercase tracking-[0.1em] focus:outline-none focus:ring-1 focus:ring-brand/50"
      >
        <option value="user">User</option>
        <option value="committee">Committee</option>
        <option value="admin">Admin</option>
      </select>
    </div>
  );
}

export default function AdminUsersClient({ users }: { users: UserRow[] }) {
  const [search, setSearch] = useState("");

  const filtered = search
    ? users.filter((u) =>
        u.name?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase()) ||
        u.chapter_slug?.toLowerCase().includes(search.toLowerCase())
      )
    : users;

  return (
    <Shell dir={27}>
      <PageHead kicker="Admin" title="User management" sub="Approve members, change roles, manage accounts." />
      <section className="border-b border-line">
        <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6">
          <Link href="/admin" className="mono mb-6 inline-block text-[11px] uppercase tracking-[0.14em] text-ink/50 hover:text-brand transition-colors">
            {"\u2190"} Back to admin
          </Link>
          <div className="mb-6">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, or chapter..."
              className="w-full border border-line bg-midnight px-4 py-3 text-[14px] placeholder:text-ink/35 focus:outline-none focus:ring-2 focus:ring-brand/50 sm:max-w-md"
            />
          </div>
          <div className="space-y-3">
            {filtered.map((u) => (
              <div key={u.id} className="border border-line bg-cream p-4 sm:flex sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-[14px] font-bold truncate">{u.name}</p>
                    <span className={`inline-flex border px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-[0.12em] ${
                      u.status === "approved" ? "border-term/40 bg-term/10 text-term" :
                      u.status === "rejected" ? "border-brand/40 bg-brand/10 text-brand-text" :
                      "border-ink/20 bg-ink/5 text-ink/60"
                    }`}>{u.status}</span>
                  </div>
                  <p className="mono text-[12px] text-ink/50 truncate">{u.email} / {u.chapter_slug} / {u.role}</p>
                </div>
                <div className="mt-3 sm:mt-0">
                  <UserActions user={u} />
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <p className="border border-dashed border-line p-8 text-center text-[14px] text-ink/50">No users found.</p>
            )}
          </div>
        </div>
      </section>
    </Shell>
  );
}
