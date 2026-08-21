"use client";

import { useActionState } from "react";
import Link from "next/link";
import { submitZine } from "@/app/actions/zine";

const CHAPTERS = ["Malaysia (national)", "UM", "UTM", "USM", "UniSZA", "SPARC UTeM"];

export default function ZineSubmitPage() {
  const [state, action, pending] = useActionState(submitZine, undefined);

  return (
    <section className="border-b border-line bg-paper">
      <div className="mx-auto w-full max-w-lg px-4 py-16 sm:px-6">
        <Link
          href="/zine"
          className="mono text-[11px] uppercase tracking-[0.14em] text-ink/50 hover:text-brand"
        >
          {"\u2190"} Back to zine
        </Link>
        <h1 className="display mt-6 text-4xl leading-[0.9]">Submit to the zine</h1>
        <p className="mt-3 text-[14px] text-ink/60">
          Share your voice. Submissions are reviewed by your chapter committee before publishing.
        </p>

        {state?.error ? (
          <div className="mt-6 border border-brand/40 bg-brand/10 px-4 py-3 text-[13px] text-brand-text">
            {state.error}
          </div>
        ) : null}

        <form action={action} className="mt-8 space-y-4" noValidate>
          <div>
            <label htmlFor="zine-title" className="mb-1.5 block text-[13px] font-bold">
              Title
            </label>
            <input
              id="zine-title"
              name="title"
              type="text"
              required
              minLength={3}
              placeholder="Your zine title"
              className="w-full border border-line bg-midnight px-4 py-3 text-[14px] placeholder:text-ink/35 focus:outline-none focus:ring-2 focus:ring-brand/50"
            />
          </div>

          <div>
            <label htmlFor="zine-chapter" className="mb-1.5 block text-[13px] font-bold">
              Chapter
            </label>
            <select
              id="zine-chapter"
              name="chapter"
              required
              className="w-full border border-line bg-midnight px-4 py-3 text-[14px] focus:outline-none focus:ring-2 focus:ring-brand/50"
            >
              <option value="">Pick your chapter...</option>
              {CHAPTERS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="zine-content" className="mb-1.5 block text-[13px] font-bold">
              Content
            </label>
            <textarea
              id="zine-content"
              name="content"
              required
              minLength={50}
              rows={10}
              placeholder="Write your zine content here. At least 50 characters."
              className="w-full border border-line bg-midnight px-4 py-3 text-[14px] placeholder:text-ink/35 focus:outline-none focus:ring-2 focus:ring-brand/50 resize-y"
            />
          </div>

          <button
            type="submit"
            disabled={pending}
            className="press mt-2 w-full border border-2 border-ink bg-brand px-5 py-3.5 text-[13px] font-extrabold uppercase tracking-[0.16em] text-white disabled:opacity-50"
          >
            {pending ? "Submitting..." : "Submit for review"}
          </button>
        </form>
      </div>
    </section>
  );
}
