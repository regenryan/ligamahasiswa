"use client";

import Link from "next/link";
import { useAuth } from "@/components/auth-provider";

export function NavAuth() {
  const { user, loading, logout } = useAuth();

  if (loading) {
    return (
      <span className="h-10 w-20 animate-pulse border border-line bg-cream" />
    );
  }

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard"
          className="press inline-flex items-center gap-2 border border-line px-4 py-2.5 text-[13px] font-extrabold uppercase tracking-[0.12em] text-ink hover:border-ink hover:text-brand transition-colors"
        >
          Dashboard
        </Link>
        <button
          type="button"
          onClick={() => logout()}
          className="press inline-flex items-center gap-2 px-3 py-2.5 text-[12px] font-bold uppercase tracking-[0.12em] text-ink/50 hover:text-brand transition-colors"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        href="/login"
        className="press inline-flex items-center gap-2 border border-line px-4 py-2.5 text-[13px] font-extrabold uppercase tracking-[0.12em] text-ink hover:border-ink hover:text-brand transition-colors"
      >
        Log in
      </Link>
      <Link
        href="/membership"
        className="press inline-flex items-center gap-2 bg-brand px-4 py-2.5 text-[13px] font-extrabold uppercase tracking-[0.12em] text-white hover:opacity-90 transition-opacity duration-150"
      >
        Sertai
      </Link>
    </div>
  );
}
