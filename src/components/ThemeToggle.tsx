"use client";
import { startTransition, useCallback, useEffect, useState } from "react";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const saved = localStorage.getItem("liga-theme") as "light" | "dark" | null;
    const initial = saved ?? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    const target = document.querySelector(".dir-27");
    if (target) target.setAttribute("data-theme", initial);
    startTransition(() => {
      setTheme(initial);
    });
  }, []);

  const toggle = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "light" ? "dark" : "light";
      const target = document.querySelector(".dir-27");
      if (target) {
        target.classList.add("theme-transitioning");
        target.setAttribute("data-theme", next);
        setTimeout(() => target.classList.remove("theme-transitioning"), 250);
      }
      localStorage.setItem("liga-theme", next);
      return next;
    });
  }, []);

  return (
    <button
      type="button"
      onClick={toggle}
      className="ml-4 inline-flex h-8 w-8 items-center justify-center border border-line text-ink/70 hover:text-brand focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2"
      aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
    >
      {theme === "light" ? (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="8" cy="8" r="3" />
          <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.05 3.05l1.41 1.41M11.54 11.54l1.41 1.41M3.05 12.95l1.41-1.41M11.54 4.46l1.41-1.41" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M6.5 1a6.5 6.5 0 0 0 5.43 11.93A5.5 5.5 0 0 1 6.5 1z" />
        </svg>
      )}
    </button>
  );
}
