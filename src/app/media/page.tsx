"use client";

import { Suspense, useState } from "react";
import { VariantFrame } from "@/components/VariantFrame";
import { NavA, FooterA, NavB, FooterB, NavC, FooterC, NavD, FooterD, NavE, FooterE } from "@/components/shells";
import { Placeholder } from "@/components/Placeholder";
import { mediaItems } from "@/lib/mock";

const NAMES = ["A Kad Merah", "B Skuad Kampus", "C Midnight Demo", "D Zine Print", "E Flat Signal"];

function MediaCard({
  outlet,
  date,
  kind,
  title,
  blurb,
  tone,
}: {
  outlet: string;
  date: string;
  kind: "Video" | "Podcast" | "Artikel";
  title: string;
  blurb: string;
  tone: "a" | "b" | "c" | "d" | "e";
}) {
  const [copied, setCopied] = useState(false);
  const caption = `KELIHATAN LIGA DI ${outlet.toUpperCase()}: ${title}. BACA / DENGAR PENUH. #LIGAMAhasISWAMALAYSIA`;
  const card =
    tone === "a"
      ? "border-2 border-ink bg-paper"
      : tone === "b"
        ? "rounded-3xl bg-paper shadow-[0_2px_16px_rgba(17,17,17,0.06)]"
        : tone === "c"
          ? "border border-white/10 bg-mist"
          : tone === "d"
            ? "border-2 border-ink bg-paper rotate-[-0.3deg]"
            : "border-2 border-paper/15 bg-mist";
  const meta = tone === "c" ? "text-paper/50" : "text-ink/50";
  const typeBadge =
    tone === "c"
      ? "bg-brand text-paper"
      : tone === "e"
        ? "bg-hi text-ink"
        : "bg-ink text-paper";
  return (
    <article className={`${card} flex flex-col overflow-hidden`}>
      <div className="relative">
        <Placeholder
          ratio="16/10"
          caption={`${kind === "Podcast" ? "Podcast artwork" : "Coverage screenshot"}: ${outlet} memberitakan Liga`}
          className={tone === "b" ? "rounded-none border-0" : "border-0"}
        />
        <span className={`absolute left-3 top-3 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em] ${typeBadge}`}>
          {kind}
        </span>
      </div>
      <div className={`flex flex-1 flex-col ${tone === "b" ? "p-5" : "p-5"}`}>
        <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${meta}`}>
          {outlet} - {date}
        </p>
        <h2 className="display mt-3 text-2xl leading-[1.05]">{title}</h2>
        <p className={`mt-3 text-sm leading-relaxed ${tone === "c" ? "text-paper/60" : "text-ink/60"}`}>{blurb}</p>
        <div className="mt-5 flex flex-1 items-end gap-2">
          <button
            type="button"
            className={`press border-2 px-4 py-2 text-xs font-black uppercase tracking-widest ${
              tone === "c"
                ? "border-paper/25 text-paper/70 hover:border-glow hover:text-glow"
                : tone === "e"
                  ? "border-paper/25 text-paper/70 hover:border-brand hover:text-brand"
                  : "border-ink text-ink/70 hover:bg-ink hover:text-paper"
            }`}
          >
            Baca / dengar
          </button>
          <button
            type="button"
            onClick={() => {
              navigator.clipboard?.writeText(caption).catch(() => {});
              setCopied(true);
              setTimeout(() => setCopied(false), 1600);
            }}
            className={`press border-2 px-4 py-2 text-xs font-black uppercase tracking-widest ${
              copied ? (tone === "c" ? "border-glow text-glow" : "border-brand text-brand") : tone === "c" ? "border-paper/25 text-paper/70 hover:border-glow hover:text-glow" : tone === "e" ? "border-paper/25 text-paper/70 hover:border-brand hover:text-brand" : "border-ink text-ink/70 hover:bg-ink hover:text-paper"
            }`}
          >
            {copied ? "Caption disalin" : "Copy caption"}
          </button>
        </div>
      </div>
    </article>
  );
}

function MediaHeader({ tone }: { tone: "a" | "b" | "c" | "d" | "e" }) {
  const sub =
    "Liputan dan podcast yang ada nama Liga. Nak share ke story? Copy caption kami siap-siap.";
  return (
    <div className="flex flex-wrap items-end justify-between gap-6">
      <div>
        <h1 className="display text-5xl sm:text-6xl">MEDIA</h1>
        <p className={`mt-4 max-w-md text-sm leading-relaxed ${tone === "c" ? "text-paper/60" : "text-ink/60"}`}>{sub}</p>
      </div>
      <span className={`text-xs font-bold uppercase tracking-[0.2em] ${tone === "c" ? "text-glow" : "text-brand"}`}>
        Sumber luaran sahaja
      </span>
    </div>
  );
}

/* ================= A ================= */

function MediaA() {
  return (
    <div className="dir-a min-h-screen bg-paper text-ink">
      <NavA />
      <main className="mx-auto max-w-7xl px-5 py-16">
        <MediaHeader tone="a" />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {mediaItems.map((m) => (
            <MediaCard key={m.title} {...m} tone="a" />
          ))}
        </div>
      </main>
      <FooterA />
    </div>
  );
}

/* ================= B ================= */

function MediaB() {
  return (
    <div className="dir-b min-h-screen bg-cream text-ink">
      <NavB />
      <main className="mx-auto max-w-6xl px-4 py-14">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <h1 className="font-baloo text-4xl font-bold sm:text-5xl">Media</h1>
            <p className="mt-3 max-w-md text-[15px] leading-relaxed text-ink/65">
              Liputan dan podcast yang ada nama Liga. Nak share ke story? Copy caption kami siap-siap.
            </p>
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-brand">Sumber luaran sahaja</span>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {mediaItems.map((m) => (
            <MediaCard key={m.title} {...m} tone="b" />
          ))}
        </div>
      </main>
      <FooterB />
    </div>
  );
}

/* ================= C ================= */

function MediaC() {
  return (
    <div className="dir-c min-h-screen bg-midnight text-paper">
      <NavC />
      <main className="mx-auto max-w-7xl px-5 py-16">
        <MediaHeader tone="c" />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {mediaItems.map((m) => (
            <MediaCard key={m.title} {...m} tone="c" />
          ))}
        </div>
      </main>
      <FooterC />
    </div>
  );
}

/* ================= D ================= */

function MediaD() {
  return (
    <div className="dir-d grain relative min-h-screen bg-paper text-ink">
      <NavD />
      <main className="mx-auto max-w-5xl px-5 py-16">
        <p className="stamp text-xs text-brand">Liputan</p>
        <h1 className="display mt-5 text-4xl sm:text-5xl">MEDIA</h1>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-ink/65">
          Liputan dan podcast yang ada nama Liga. Nak share ke story? Copy caption kami siap-siap.
        </p>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {mediaItems.map((m) => (
            <MediaCard key={m.title} {...m} tone="d" />
          ))}
        </div>
      </main>
      <FooterD />
    </div>
  );
}

/* ================= E ================= */

function MediaE() {
  return (
    <div className="dir-e min-h-screen bg-ink text-paper">
      <NavE />
      <main className="mx-auto max-w-7xl px-5 py-16">
        <MediaHeader tone="e" />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {mediaItems.map((m) => (
            <MediaCard key={m.title} {...m} tone="e" />
          ))}
        </div>
      </main>
      <FooterE />
    </div>
  );
}

/* ================= PAGE ================= */

export default function MediaPage() {
  const variants = [
    <MediaA key="a" />,
    <MediaB key="b" />,
    <MediaC key="c" />,
    <MediaD key="d" />,
    <MediaE key="e" />,
  ];
  return (
    <Suspense fallback={null}>
      <VariantFrame names={NAMES}>{variants}</VariantFrame>
    </Suspense>
  );
}
