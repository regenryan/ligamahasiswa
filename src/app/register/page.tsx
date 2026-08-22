"use client";

import { useActionState } from "react";
import Link from "next/link";
import { registerAction, type AuthState } from "@/app/actions/auth";

const CHAPTERS: { slug: string; label: string }[] = [
  { slug: "malaysia", label: "Malaysia (national)" },
  { slug: "um", label: "UM" },
  { slug: "utm", label: "UTM" },
  { slug: "usm", label: "USM" },
  { slug: "unisza", label: "UniSZA" },
  { slug: "utem", label: "SPARC UTeM" },
];

function FieldError({ name, state }: { name: string; state: AuthState }) {
  const msg = state?.fieldErrors?.[name];
  if (!msg) return null;
  return (
    <p role="alert" className="mt-1.5 text-[12px] text-brand-text">
      {msg}
    </p>
  );
}

export default function RegisterPage() {
  const [state, action, pending] = useActionState(registerAction, undefined);

  return (
    <section className="border-b border-line bg-paper">
      <div className="mx-auto w-full max-w-md px-4 py-16 sm:px-6">
        <Link
          href="/"
          className="mono text-[11px] uppercase tracking-[0.14em] text-ink/50 hover:text-brand"
        >
          {"\u2190"} Back to home
        </Link>
        <h1 className="display mt-6 text-4xl leading-[0.9]">Register</h1>
        <p className="mt-3 text-[14px] text-ink/60">
          Create your Liga Mahasiswa account. Membership is free.
        </p>

        {state?.error ? (
          <div className="mt-6 border border-brand/40 bg-brand/10 px-4 py-3 text-[13px] text-brand-text">
            {state.error}
          </div>
        ) : null}

        <form action={action} className="mt-8 space-y-4" noValidate>
          <div>
            <label htmlFor="reg-name" className="mb-1.5 block text-[13px] font-bold">
              Full name
            </label>
            <input
              id="reg-name"
              name="name"
              type="text"
              required
              minLength={3}
              placeholder="Nur Aisyah Binti Ahmad"
              className="w-full border border-line bg-midnight px-4 py-3 text-[14px] placeholder:text-ink/35 focus:outline-none focus:ring-2 focus:ring-brand/50"
            />
            <FieldError name="name" state={state} />
          </div>

          <div>
            <label htmlFor="reg-email" className="mb-1.5 block text-[13px] font-bold">
              Email
            </label>
            <input
              id="reg-email"
              name="email"
              type="email"
              required
              placeholder="you@campus.edu.my"
              className="w-full border border-line bg-midnight px-4 py-3 text-[14px] placeholder:text-ink/35 focus:outline-none focus:ring-2 focus:ring-brand/50"
            />
            <FieldError name="email" state={state} />
          </div>

          <div>
            <label htmlFor="reg-password" className="mb-1.5 block text-[13px] font-bold">
              Password
            </label>
            <input
              id="reg-password"
              name="password"
              type="password"
              required
              minLength={8}
              placeholder="At least 8 characters"
              className="w-full border border-line bg-midnight px-4 py-3 text-[14px] placeholder:text-ink/35 focus:outline-none focus:ring-2 focus:ring-brand/50"
            />
            <FieldError name="password" state={state} />
          </div>

          <div>
            <label htmlFor="reg-phone" className="mb-1.5 block text-[13px] font-bold">
              Phone (optional)
            </label>
            <input
              id="reg-phone"
              name="phone"
              type="tel"
              placeholder="012-345 6789"
              className="w-full border border-line bg-midnight px-4 py-3 text-[14px] placeholder:text-ink/35 focus:outline-none focus:ring-2 focus:ring-brand/50"
            />
          </div>

          <div>
            <label htmlFor="reg-chapter" className="mb-1.5 block text-[13px] font-bold">
              Chapter
            </label>
            <select
              id="reg-chapter"
              name="chapter"
              required
              className="w-full border border-line bg-midnight px-4 py-3 text-[14px] focus:outline-none focus:ring-2 focus:ring-brand/50"
            >
              <option value="">Pick your chapter...</option>
              {CHAPTERS.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.label}
                </option>
              ))}
            </select>
            <FieldError name="chapter" state={state} />
          </div>

          <button
            type="submit"
            disabled={pending}
            className="press mt-2 w-full border border-2 border-ink bg-brand px-5 py-3.5 text-[13px] font-extrabold uppercase tracking-[0.16em] text-white disabled:opacity-50"
          >
            {pending ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-center text-[13px] text-ink/50">
          Already have an account?{" "}
          <Link href="/login" className="font-bold text-brand hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </section>
  );
}
