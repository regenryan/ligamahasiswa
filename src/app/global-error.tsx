"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body style={{ background: "#0d0d0d", color: "#f0f0ee", fontFamily: "sans-serif" }}>
        <section className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
          <p className="mono text-[11px] font-extrabold uppercase tracking-[0.24em] text-ink/40">
            System error
          </p>
          <h1 className="display mt-4 text-4xl leading-none sm:text-6xl">
            Something broke
          </h1>
          <p className="mt-6 max-w-md text-[15px] leading-relaxed text-ink/60">
            An unexpected error occurred. The page could not be rendered.
          </p>
          {error.digest && (
            <p className="mono mt-2 text-[10px] text-ink/30">
              {error.digest}
            </p>
          )}
          <button
            type="button"
            onClick={reset}
            className="mt-8 inline-flex border border-ink bg-ink px-6 py-3 text-[13px] font-extrabold uppercase tracking-[0.12em] text-paper hover:bg-[#e65100] hover:text-paper"
          >
            Try again
          </button>
        </section>
      </body>
    </html>
  );
}
