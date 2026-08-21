"use client";

import { useEffect, useState, startTransition } from "react";

interface NewsItem {
  outlet: string;
  title: string;
  url: string;
  fetchedAt: string;
}

export function LiveFeed() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const fetchNews = async () => {
      try {
        const res = await fetch("/api/news");
        if (res.ok) {
          const data = await res.json();
          if (active && data.ok) {
            startTransition(() => {
              setItems(data.items ?? []);
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
    const interval = setInterval(fetchNews, 60000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  if (loading && items.length === 0) {
    return null;
  }

  if (items.length === 0) {
    return null;
  }

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
      </div>
    </div>
  );
}
