"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginAction } from "@/app/actions/auth";

export default function LoginPage() {
  const [state, action, pending] = useActionState(loginAction, undefined);

  return (
    <section className="border-b border-line bg-paper">
      <div className="mx-auto w-full max-w-md px-4 py-16 sm:px-6">
        <Link
          href="/"
          className="mono text-[11px] uppercase tracking-[0.14em] text-ink/50 hover:text-brand"
        >
          {"\u2190"} Back to home
        </Link>
        <h1 className="display mt-6 text-4xl leading-[0.9]">Log in</h1>
        <p className="mt-3 text-[14px] text-ink/60">
          Access your Liga Mahasiswa account.
        </p>

        {state?.error ? (
          <div className="mt-6 border border-brand/40 bg-brand/10 px-4 py-3 text-[13px] text-brand-text">
            {state.error}
          </div>
        ) : null}

        <form action={action} className="mt-8 space-y-4" noValidate>
          <div>
            <label htmlFor="login-email" className="mb-1.5 block text-[13px] font-bold">
              Email
            </label>
            <input
              id="login-email"
              name="email"
              type="email"
              required
              placeholder="you@campus.edu.my"
              className="w-full border border-line bg-midnight px-4 py-3 text-[14px] placeholder:text-ink/35 focus:outline-none focus:ring-2 focus:ring-brand/50"
            />
          </div>

          <div>
            <label htmlFor="login-password" className="mb-1.5 block text-[13px] font-bold">
              Password
            </label>
            <input
              id="login-password"
              name="password"
              type="password"
              required
              placeholder="Your password"
              className="w-full border border-line bg-midnight px-4 py-3 text-[14px] placeholder:text-ink/35 focus:outline-none focus:ring-2 focus:ring-brand/50"
            />
          </div>

          <button
            type="submit"
            disabled={pending}
            className="press mt-2 w-full border border-2 border-ink bg-brand px-5 py-3.5 text-[13px] font-extrabold uppercase tracking-[0.16em] text-white disabled:opacity-50"
          >
            {pending ? "Logging in..." : "Log in"}
          </button>
        </form>

        <p className="mt-6 text-center text-[13px] text-ink/50">
          No account yet?{" "}
          <Link href="/register" className="font-bold text-brand hover:underline">
            Register
          </Link>
        </p>
      </div>
    </section>
  );
}
