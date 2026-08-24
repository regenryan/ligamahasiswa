"use client";

import Link from "next/link";
import { useCountdown, useNow, useNowDaysSince } from "@/components/clock";
import { aukuStart, countdownTarget, type Campaign } from "@/lib/mock";

const pad = (n: number) => String(n).padStart(2, "0");

type BtnProps = {
  kind: "join" | "act" | "ghost" | "line";
  size?: "md" | "lg";
  href?: string;
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  className?: string;
};

export function Btn({ kind, size = "md", href, children, onClick, type = "button", className = "" }: BtnProps) {
  const sizes = size === "lg" ? "px-7 py-3.5 text-[14px]" : "px-5 py-3 text-[13px]";
  let skin = "";
  if (kind === "join") {
    skin = "bg-brand text-paper hover:opacity-90 transition-opacity duration-150";
  } else if (kind === "act") {
    skin = "border border-line text-ink hover:bg-brand hover:text-paper transition-colors duration-150";
  } else if (kind === "ghost") {
    skin = "border border-line text-ink/70 hover:border-ink hover:text-ink";
  } else {
    skin = "mono underline underline-offset-4 text-ink/70 hover:text-brand";
  }
  const cls = `press inline-flex items-center justify-center gap-2 font-extrabold uppercase tracking-[0.12em] ${sizes} ${skin} ${className}`;
  if (href) {
    return (
      <Link href={href} className={cls} onClick={onClick}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} className={cls} onClick={onClick}>
      {children}
    </button>
  );
}

type SectionHeadProps = {
  index: number;
  title: string;
  sub?: string;
};

export function SectionHead({ index, title, sub }: SectionHeadProps) {
  const num = String(index).padStart(2, "0");
  return (
    <div className="mb-8">
      <div className="flex flex-wrap items-center gap-4">
        <span className="mono inline-flex h-8 w-8 items-center justify-center bg-brand text-[12px] font-bold text-paper">{num}</span>
        <h2 className="display text-3xl leading-none sm:text-5xl">{title}</h2>
      </div>
      {sub ? <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-ink/70">{sub}</p> : null}
    </div>
  );
}

export function PageHead({
  kicker,
  title,
  sub,
}: {
  kicker: string;
  title: string;
  sub?: string;
}) {
  return (
    <section className="border-b border-line bg-paper">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
        <div className="mono flex flex-wrap items-center justify-between gap-3 border border-line bg-cream px-4 py-2 text-[11px] uppercase tracking-[0.14em] text-ink/60">
          <span className="flex items-center gap-2">
            <span className="metro-dot inline-block h-2 w-2 rounded-full bg-brand" aria-hidden="true" />
            {kicker}
          </span>
          <span>Liga Mahasiswa</span>
          <span className="accent">Active</span>
        </div>
        <h1 className="display mt-8 text-4xl leading-[0.9] sm:text-5xl lg:text-6xl xl:text-7xl">{title}</h1>
        {sub ? <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-ink/70">{sub}</p> : null}
      </div>
    </section>
  );
}

export function Countdown({ label = "Next assembly" }: { label?: string }) {
  const now = useNow();
  const c = useCountdown(countdownTarget, now);
  const cells = [
    { v: c.days, l: "Days" },
    { v: c.hours, l: "Hours" },
    { v: c.minutes, l: "Mins" },
    { v: c.seconds, l: "Secs" },
  ];
  return (
    <div>
      <p className="mb-3 text-center text-[11px] font-extrabold uppercase tracking-[0.2em] text-ink/50">{label}</p>
      <div className="grid grid-cols-4 gap-2">
        {cells.map((cell) => (
          <div key={cell.l} className="flex flex-col items-center justify-center border border-line bg-cream p-3 sm:p-4">
            <span className="display text-3xl">{cell.v === null ? "--" : pad(cell.v)}</span>
            <span className="mt-1 mono text-[10px] uppercase tracking-[0.18em] text-ink/50">{cell.l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AukuYears() {
  const days = useNowDaysSince(aukuStart);
  const years = days === null ? null : Math.floor(days / 365.25);
  return (
    <p className="mono text-[13px] uppercase tracking-[0.16em] text-ink/70">
      AUKU in effect for <span className="accent">{years ?? "--"} years</span>
    </p>
  );
}

export function StatusChip({ status }: { status: Campaign["status"] }) {
  const skin =
    status === "Active"
      ? "bg-brand/15 text-brand-text border-brand/40"
      : status === "Won"
        ? "bg-term/10 text-term border-term/40"
        : "bg-hi/10 text-hi border-hi/40";
  return (
    <span className={`inline-flex items-center gap-1.5 border px-2 py-1 text-[11px] font-extrabold uppercase tracking-[0.14em] ${skin}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
      {status}
    </span>
  );
}
