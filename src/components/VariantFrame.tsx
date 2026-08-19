"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useSearchParams } from "next/navigation";

type VariantFrameProps = {
  names: string[];
  children: ReactNode[];
};

export function VariantFrame({ names, children }: VariantFrameProps) {
  const searchParams = useSearchParams();
  const [current, setCurrent] = useState(() => {
    const v = Number(searchParams?.get("v") ?? "1");
    return Number.isFinite(v) && v >= 1 && v <= names.length ? v - 1 : 0;
  });
  const [ready, setReady] = useState(false);
  const [replay, setReplay] = useState(0);
  const highlightRef = useRef<HTMLSpanElement>(null);
  const itemsRef = useRef<(HTMLButtonElement | null)[]>([]);

  const moveHighlight = useCallback(() => {
    const el = itemsRef.current[current];
    const h = highlightRef.current;
    if (!el || !h) return;
    h.style.width = `${el.offsetWidth}px`;
    h.style.transform = `translateX(${el.offsetLeft}px)`;
  }, [current]);

  useLayoutEffect(() => {
    moveHighlight();
  }, [moveHighlight, ready]);

  useEffect(() => {
    const raf = requestAnimationFrame(() =>
      requestAnimationFrame(() => setReady(true)),
    );
    window.addEventListener("resize", moveHighlight);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", moveHighlight);
    };
  }, [moveHighlight]);

  const setActive = useCallback(
    (i: number) => {
      if (i < 0 || i >= names.length) return;
      setCurrent(i);
      const url = new URL(window.location.href);
      url.searchParams.set("v", String(i + 1));
      history.replaceState(null, "", url);
    },
    [names.length],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (/^(INPUT|TEXTAREA|SELECT)$/.test((e.target as HTMLElement | null)?.tagName ?? "")) return;
      if (e.target instanceof HTMLElement && e.target.isContentEditable) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const num = parseInt(e.key, 10);
      if (num >= 1 && num <= names.length) setActive(num - 1);
      else if (e.key === "ArrowRight") setActive((current + 1) % names.length);
      else if (e.key === "ArrowLeft")
        setActive((current - 1 + names.length) % names.length);
      else if (e.key === "r" || e.key === "R") setReplay((r) => r + 1);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [names.length, current, setActive]);

  return (
    <>
      <main key={`${current}-${replay}`} className="overflow-x-hidden w-full max-w-full">
        {children[current]}
      </main>
      <nav
        className="proto-picker"
        aria-label="Prototype variants"
        data-ready={ready || undefined}
      >
        <span className="proto-picker-highlight" ref={highlightRef} aria-hidden="true" />
        {names.map((n, i) => (
          <button
            key={n}
            ref={(el) => {
              itemsRef.current[i] = el;
            }}
            type="button"
            className="proto-picker-item"
            data-active={i === current || undefined}
            aria-current={i === current ? "true" : undefined}
            onClick={() => setActive(i)}
          >
            {n}
          </button>
        ))}
        <span className="proto-picker-divider" aria-hidden="true" />
        <button
          type="button"
          className="proto-picker-item proto-picker-replay"
          aria-label="Replay animation (R)"
          onClick={() => setReplay((r) => r + 1)}
        >
          {"\u21BB"}
        </button>
      </nav>
    </>
  );
}
