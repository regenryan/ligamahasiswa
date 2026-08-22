"use client";

import { useEffect, useState, startTransition } from "react";

interface NewsItem {
  outlet: string;
  title: string;
  url: string;
  fetchedAt: string;
  topic: string;
}

const TOPICS = ["", "AUKU", "PTPTN", "campus", "policy", "rights"];

export function LiveFeed() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [topic, setTopic] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const LIMIT = 8;

  useEffect(() => {
    let active = true;

    const fetchNews = async () => {
      try {
        const params = new URLSearchParams({ page: String(page), limit: String(LIMIT) });
        if (topic) params.set("topic", topic);
        const res = await fetch(`/api/news?${params}`);
        if (res.ok) {
          const data = await res.json();
          if (active && data.ok) {
            startTransition(() => {
              setItems(data.items ?? []);
              setTotal(data.total ?? 0);
            });
          }
        }
      } catch {
        // ignore
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchNews();
    return () => { active = false; };
  }, [page, topic]);

  if (loading && items.length === 0) {
    return null;
  }

  if (items.length === 0) {
    return null;
  }

  const totalPages = Math.max(1, Math.ceil(total / LIMIT));

  return (
    <div className="overflow-hidden border-b border-line bg-midnight">
      <div className="mx-auto w-full max-w-6xl px-4 py-3 sm:px-6">
        <div className="flex items-center gap-4">
          <span className="mono shrink-0 text-[10px] font-extrabold uppercase tracking-[0.2em] text-fog/50">
            Live
          </span>
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-brand" />
          </span>
          <div className="overflow-hidden">
            <div className="flex gap-8 animate-[marquee_30s_linear_infinite]">
              {items.slice(0, 8).map((item, i) => (
                <a
                  key={`${item.url}-${i}`}
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="shrink-0 text-[12px] text-fog/60 hover:text-fog transition-colors"
                >
                  <span className="font-bold text-fog/80">{item.outlet}</span>
                  {" "}
                  {item.title}
                </a>
              ))}
            </div>
          </div>
        </div>
        {TOPICS.length > 1 ? (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {TOPICS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => { setTopic(t); setPage(1); }}
                className={`mono border px-2 py-0.5 text-[10px] uppercase tracking-[0.1em] transition-colors ${
                  topic === t
                    ? "border-brand bg-brand/10 text-brand"
                    : "border-fog/20 text-fog/50 hover:border-fog/40 hover:text-fog/70"
                }`}
              >
                {t || "All"}
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
