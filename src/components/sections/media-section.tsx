"use client";

import { useState } from "react";
import Link from "next/link";

type MediaItem = {
  id: string;
  type: string;
  title: string;
  chapter: string;
  date: string;
  url: string;
};

const TYPES = ["All", "Posts", "Statements", "Zines", "Podcasts", "Articles"] as const;

export function MediaSection({ items }: { items: MediaItem[] }) {
  const [filter, setFilter] = useState<string>("All");

  const filtered = filter === "All" ? items : items.filter((i) => i.type === filter);

  return (
    <section className="border-b border-line" id="media">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="mono text-[11px] uppercase tracking-[0.2em] text-ink/50">Latest</p>
            <h2 className="display mt-2 text-2xl sm:text-3xl">Media</h2>
          </div>
          <Link href="/media" className="press inline-flex border border-line px-4 py-2 text-[12px] font-bold uppercase tracking-[0.1em] text-ink/60 hover:border-ink hover:text-ink transition-colors">
            View all
          </Link>
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          {TYPES.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setFilter(t)}
              className={`press border px-3 py-1.5 text-[12px] font-bold uppercase tracking-[0.1em] transition-colors ${
                filter === t
                  ? "border-brand bg-brand/10 text-brand-text"
                  : "border-line text-ink/60 hover:border-ink hover:text-ink"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {filtered.slice(0, 4).map((item) => (
            <a
              key={item.id}
              href={item.url}
              target={item.url.startsWith("http") ? "_blank" : undefined}
              rel={item.url.startsWith("http") ? "noreferrer" : undefined}
              className="border border-line bg-cream p-5 hover:border-brand transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="border border-brand/40 bg-brand/10 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-[0.12em] text-brand-text">
                  {item.type}
                </span>
                <span className="mono text-[11px] uppercase tracking-[0.14em] text-ink/50">{item.chapter}</span>
              </div>
              <h3 className="mt-2 display text-lg">{item.title}</h3>
            </a>
          ))}
        </div>
        {filtered.length === 0 && (
          <p className="mt-8 text-center text-[14px] text-ink/50">No content available yet.</p>
        )}
      </div>
    </section>
  );
}
