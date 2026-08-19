"use client";

import { Suspense, useState } from "react";
import { VariantFrame } from "@/components/VariantFrame";
import { NavA, FooterA, NavB, FooterB, NavC, FooterC, NavD, FooterD, NavE, FooterE } from "@/components/shells";
import { Placeholder } from "@/components/Placeholder";
import { zinePosts } from "@/lib/mock";

const NAMES = ["A Kad Merah", "B Skuad Kampus", "C Midnight Demo", "D Zine Print", "E Flat Signal"];

function ZineCard({
  title,
  author,
  excerpt,
  likes,
  tone,
}: {
  title: string;
  author: string;
  excerpt: string;
  likes: number;
  tone: "a" | "b" | "c" | "d" | "e";
}) {
  const issue = "Zine vol. 3";
  const readTime = "4 min";
  const [count, setCount] = useState(likes);
  const [liked, setLiked] = useState(false);
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
  const likeActive = tone === "c" ? "text-glow border-glow" : "text-brand border-brand";
  return (
    <article className={`${card} flex flex-col overflow-hidden`}>
      <Placeholder
        ratio="16/10"
        caption={`Zine cover or illustration: ${title}. Risograph feel, flat colours`}
        className={tone === "b" ? "rounded-none border-0" : "border-0"}
      />
      <div className={`flex flex-1 flex-col ${tone === "b" ? "p-5" : "p-5"}`}>
        <div className="flex items-center gap-2">
          <span className={`text-[11px] font-black uppercase tracking-[0.18em] ${tone === "c" ? "text-glow" : "text-brand"}`}>
            {issue}
          </span>
          <span className={`text-[11px] uppercase tracking-widest ${meta}`}>- {readTime} baca</span>
        </div>
        <h2 className="display mt-3 text-2xl leading-[1.02]">{title}</h2>
        <p className={`mt-3 max-w-prose text-sm leading-relaxed ${tone === "c" ? "text-paper/60" : "text-ink/60"}`}>{excerpt}</p>
        <p className={`mt-3 text-xs ${meta}`}>oleh {author}</p>
        <div className="mt-5 flex flex-1 items-end justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              setLiked((v) => !v);
              setCount((c) => (liked ? c - 1 : c + 1));
            }}
            className={`press border-2 px-4 py-2 text-xs font-black uppercase tracking-widest ${
              liked ? likeActive : tone === "c" ? "border-paper/25 text-paper/60 hover:border-glow hover:text-glow" : "border-ink text-ink/60 hover:bg-ink hover:text-paper"
            }`}
          >
            {liked ? "Suka!" : "Suka"} - {count}
          </button>
          <span className={`text-[11px] uppercase tracking-widest ${meta}`}>Baca penuh</span>
        </div>
      </div>
    </article>
  );
}

function ZineHeader({ tone }: { tone: "a" | "b" | "c" | "d" | "e" }) {
  const sub = "Zine mingguan Liga. Kisah kampus, tulisan mahasiswa, dan beberapa baris harapan.";
  return (
    <div className="flex flex-wrap items-end justify-between gap-6">
      <div>
        <h1 className="display text-5xl sm:text-6xl">ZINE</h1>
        <p className={`mt-4 max-w-md text-sm leading-relaxed ${tone === "c" ? "text-paper/60" : "text-ink/60"}`}>{sub}</p>
      </div>
      <span className={`text-xs font-bold uppercase tracking-[0.2em] ${tone === "c" ? "text-glow" : "text-brand"}`}>
        Keluaran mingguan
      </span>
    </div>
  );
}

/* ================= A ================= */

function ZineA() {
  return (
    <div className="dir-a min-h-screen bg-paper text-ink">
      <NavA />
      <main className="mx-auto max-w-7xl px-5 py-16">
        <ZineHeader tone="a" />
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {zinePosts.map((z) => (
            <ZineCard key={z.slug} {...z} tone="a" />
          ))}
        </div>
      </main>
      <FooterA />
    </div>
  );
}

/* ================= B ================= */

function ZineB() {
  return (
    <div className="dir-b min-h-screen bg-cream text-ink">
      <NavB />
      <main className="mx-auto max-w-6xl px-4 py-14">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <h1 className="font-baloo text-4xl font-bold sm:text-5xl">Zine</h1>
            <p className="mt-3 max-w-md text-[15px] leading-relaxed text-ink/65">
              Zine mingguan Liga. Kisah kampus, tulisan mahasiswa, dan beberapa baris harapan.
            </p>
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-brand">Keluaran mingguan</span>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {zinePosts.map((z) => (
            <ZineCard key={z.slug} {...z} tone="b" />
          ))}
        </div>
      </main>
      <FooterB />
    </div>
  );
}

/* ================= C ================= */

function ZineC() {
  return (
    <div className="dir-c min-h-screen bg-midnight text-paper">
      <NavC />
      <main className="mx-auto max-w-7xl px-5 py-16">
        <ZineHeader tone="c" />
        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {zinePosts.map((z) => (
            <ZineCard key={z.slug} {...z} tone="c" />
          ))}
        </div>
      </main>
      <FooterC />
    </div>
  );
}

/* ================= D ================= */

function ZineD() {
  return (
    <div className="dir-d grain relative min-h-screen bg-paper text-ink">
      <NavD />
      <main className="mx-auto max-w-5xl px-5 py-16">
        <p className="stamp text-xs text-brand">Edisi cetak</p>
        <h1 className="display mt-5 text-4xl sm:text-5xl">ZINE</h1>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-ink/65">
          Zine mingguan Liga. Kisah kampus, tulisan mahasiswa, dan beberapa baris harapan.
        </p>
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {zinePosts.map((z) => (
            <ZineCard key={z.slug} {...z} tone="d" />
          ))}
        </div>
      </main>
      <FooterD />
    </div>
  );
}

/* ================= E ================= */

function ZineE() {
  return (
    <div className="dir-e min-h-screen bg-ink text-paper">
      <NavE />
      <main className="mx-auto max-w-7xl px-5 py-16">
        <ZineHeader tone="e" />
        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {zinePosts.map((z) => (
            <ZineCard key={z.slug} {...z} tone="e" />
          ))}
        </div>
      </main>
      <FooterE />
    </div>
  );
}

/* ================= PAGE ================= */

export default function ZinePage() {
  const variants = [
    <ZineA key="a" />,
    <ZineB key="b" />,
    <ZineC key="c" />,
    <ZineD key="d" />,
    <ZineE key="e" />,
  ];
  return (
    <Suspense fallback={null}>
      <VariantFrame names={NAMES}>{variants}</VariantFrame>
    </Suspense>
  );
}
