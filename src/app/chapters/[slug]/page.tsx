"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useParams } from "next/navigation";
import { VariantFrame } from "@/components/VariantFrame";
import { NavA, FooterA, NavB, FooterB, NavC, FooterC, NavD, FooterD, NavE, FooterE } from "@/components/shells";
import { Placeholder } from "@/components/Placeholder";
import { getChapter } from "@/lib/mock";

const NAMES = ["A Kad Merah", "B Skuad Kampus", "C Midnight Demo", "D Zine Print", "E Flat Signal"];

function QuickLinks({ slug, dark = false }: { slug: string; dark?: boolean }) {
  const links = [
    { href: `/chapters/${slug}/team`, label: "Team" },
    { href: `/chapters/${slug}/campaigns/mansuh-auku`, label: "Campaigns" },
    { href: `/chapters/${slug}/events`, label: "Events" },
    { href: `/chapters/${slug}/statements`, label: "Statements" },
    { href: `/chapters/${slug}/gallery`, label: "Gallery" },
  ];
  const base = dark
    ? "border border-paper/20 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-paper/70 hover:border-glow hover:text-glow"
    : "border-2 border-ink px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-ink/70 hover:bg-ink hover:text-paper";
  return (
    <div className="flex flex-wrap gap-2">
      {links.map((l) => (
        <Link key={l.href} href={l.href} className={`press ${base}`}>
          {l.label}
        </Link>
      ))}
    </div>
  );
}

function GalleryStrip({ slug, tone }: { slug: string; tone: "a" | "b" | "c" | "d" | "e" }) {
  const captions = [
    "IG post: event chapter, crowd shot",
    "IG post: aksi perhimpunan kampus",
    "IG post: kawan-kawan pegang banner",
  ];
  return (
    <div className="grid grid-cols-3 gap-3">
      {captions.map((c, i) => (
        <Placeholder
          key={i}
          ratio="1/1"
          caption={c}
          className={
            tone === "b" ? "rotate-[-1.5deg] border-0 shadow-[0_2px_12px_rgba(17,17,17,0.12)]" : ""
          }
        />
      ))}
      <p className="col-span-3 text-center text-xs text-ink/45">
        Feed dari {getChapter(slug).ig}. (mock placeholders, live sync nanti)
      </p>
    </div>
  );
}

/* ================= A ================= */

function ChapterA({ slug }: { slug: string }) {
  const ch = getChapter(slug);
  return (
    <div className="dir-a min-h-screen bg-paper text-ink">
      <NavA />
      <main>
        <section className="relative border-b-4 border-ink">
          <div className="halftone absolute inset-0 opacity-[0.07]" aria-hidden="true" />
          <div className="relative mx-auto grid max-w-7xl gap-10 px-5 py-20 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <span className="stamp mb-5 inline-block text-sm text-brand">{ch.ig}</span>
              <h1 className="display text-5xl leading-[0.95] sm:text-7xl">{ch.name}</h1>
              <p className="mt-5 max-w-lg text-lg leading-relaxed text-ink/70">{ch.tagline}</p>
              <div className="mt-8">
                <QuickLinks slug={slug} />
              </div>
              <div className="mt-10 flex gap-4">
                <Link
                  href={`/chapters/${slug}/team`}
                  className="press display bg-brand px-6 py-3 text-sm tracking-widest text-paper"
                >
                  JUMPA TEAM
                </Link>
                <Link
                  href="/register"
                  className="press display border-2 border-ink px-6 py-3 text-sm tracking-widest hover:bg-ink hover:text-paper"
                >
                  JOIN CHAPTER INI
                </Link>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <Placeholder
                ratio="16/10"
                caption={`Hero photo: ${ch.name} dalam perhimpunan atau aktiviti kampus`}
              />
              <div className="border-2 border-ink bg-cream p-4">
                <p className="display mb-2 text-xs tracking-widest text-brand">TENTANG KAMI</p>
                <p className="text-sm leading-relaxed text-ink/70">
                  Kami bab kampus {ch.short}. Gerakan, kempen, dan kawan baru. Mulakan dengan
                  baca kempen kami, lepas tu datang event.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="mx-auto max-w-7xl px-5 py-16">
          <p className="display mb-6 text-2xl">DARI FEED KAMI</p>
          <GalleryStrip slug={slug} tone="a" />
        </section>
      </main>
      <FooterA />
    </div>
  );
}

/* ================= B ================= */

function ChapterB({ slug }: { slug: string }) {
  const ch = getChapter(slug);
  return (
    <div className="dir-b min-h-screen bg-cream text-ink">
      <NavB />
      <main className="mx-auto max-w-6xl px-4">
        <section className="grid gap-10 py-14 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div>
            <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-hi px-3 py-1 text-xs font-bold">
              <span className="h-2 w-2 rounded-full bg-brand" />
              {ch.ig}
            </span>
            <h1 className="font-baloo text-4xl font-bold leading-[1.05] sm:text-5xl">
              {ch.name}
            </h1>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-ink/65">{ch.tagline}</p>
            <div className="mt-7">
              <QuickLinks slug={slug} />
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={`/chapters/${slug}/team`}
                className="press rounded-full bg-brand px-6 py-3 text-sm font-bold text-paper"
              >
                Jumpa team
              </Link>
              <Link
                href="/register"
                className="press rounded-full border-2 border-ink/15 bg-paper px-6 py-3 text-sm font-bold"
              >
                Join chapter ini
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <Placeholder
                ratio="4/5"
                caption={`Photo: ${ch.name} beraktiviti, suasana santai`}
                className="rotate-[-2deg] border-0"
              />
              <div className="mt-10">
                <Placeholder
                  ratio="4/5"
                  caption="Photo: event chapter, senyum semua"
                  className="rotate-[2deg] border-0"
                />
              </div>
              <span className="tape left-1/2 top-[-8px] -translate-x-1/2 -rotate-3" />
            </div>
            <div className="mt-6 rounded-2xl bg-paper p-4 shadow-[0_2px_16px_rgba(17,17,17,0.06)]">
              <p className="text-sm leading-relaxed text-ink/70">
                Kami bab kampus {ch.short}. Gerakan, kempen, dan kawan baru. Datang event, bawa
                kawan, lepas tu baru rasa apa itu kampus.
              </p>
            </div>
          </div>
        </section>
        <section className="pb-20">
          <p className="font-baloo mb-5 text-2xl font-bold">Dari feed kami</p>
          <GalleryStrip slug={slug} tone="b" />
        </section>
      </main>
      <FooterB />
    </div>
  );
}

/* ================= C ================= */

function ChapterC({ slug }: { slug: string }) {
  const ch = getChapter(slug);
  return (
    <div className="dir-c min-h-screen bg-midnight text-paper">
      <NavC />
      <main>
        <section className="relative overflow-hidden">
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: "radial-gradient(55% 45% at 60% 25%, rgba(225,29,46,0.25), transparent 70%)" }}
            aria-hidden="true"
          />
          <div className="relative mx-auto max-w-7xl px-5 py-24">
            <p className="display text-sm tracking-[0.3em] text-glow">{ch.ig.toUpperCase()}</p>
            <h1 className="display mt-5 max-w-4xl text-5xl leading-[0.95] sm:text-7xl">
              {ch.name}
            </h1>
            <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-paper/60">{ch.tagline}</p>
            <div className="mt-8">
              <QuickLinks slug={slug} dark />
            </div>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                href={`/chapters/${slug}/team`}
                className="press bg-brand px-7 py-3 text-sm font-bold uppercase tracking-[0.16em] text-paper shadow-[0_0_24px_rgba(225,29,46,0.4)]"
              >
                Jumpa team
              </Link>
              <Link
                href="/register"
                className="press border border-paper/25 px-7 py-3 text-sm font-bold uppercase tracking-[0.16em] text-paper/80 hover:border-glow hover:text-glow"
              >
                Join chapter ini
              </Link>
            </div>
          </div>
        </section>
        <section className="border-y border-white/10 bg-mist">
          <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 lg:grid-cols-[0.9fr_1.1fr]">
            <Placeholder
              ratio="16/10"
              caption={`Photo: ${ch.name}, aksi malam atau event kampus`}
              className="border-0"
            />
            <div>
              <p className="display mb-4 text-2xl">TENTANG KAMI</p>
              <p className="max-w-md text-sm leading-relaxed text-paper/65">
                Kami bab kampus {ch.short}. Gerakan, kempen, dan kawan baru. Kalau kampus kau
                sunyi, kami yang bisingkan.
              </p>
              <div className="mt-8">
                <GalleryStrip slug={slug} tone="c" />
              </div>
            </div>
          </div>
        </section>
      </main>
      <FooterC />
    </div>
  );
}

/* ================= D ================= */

function ChapterD({ slug }: { slug: string }) {
  const ch = getChapter(slug);
  return (
    <div className="dir-d grain relative min-h-screen bg-paper text-ink">
      <NavD />
      <main className="mx-auto max-w-5xl px-5">
        <section className="border-b-2 border-ink py-16">
          <p className="stamp text-xs text-brand">{ch.ig}</p>
          <h1 className="display mt-6 text-4xl leading-[0.98] sm:text-6xl">{ch.name}</h1>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-ink/70">{ch.tagline}</p>
          <div className="mt-8">
            <QuickLinks slug={slug} />
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href={`/chapters/${slug}/team`}
              className="press stamp bg-brand px-6 py-2.5 text-sm font-bold text-paper"
            >
              Jumpa team
            </Link>
            <Link
              href="/register"
              className="press stamp border-2 border-ink px-6 py-2.5 text-sm font-bold"
            >
              Join chapter ini
            </Link>
          </div>
        </section>
        <section className="grid gap-8 py-16 md:grid-cols-[0.9fr_1.1fr]">
          <div>
            <Placeholder
              ratio="4/3"
              caption={`Foto: ${ch.name} dalam perhimpunan atau aktiviti`}
            />
            <div className="mt-6 border-2 border-ink bg-cream p-5">
              <p className="display mb-2 text-sm tracking-widest text-brand">TENTANG KAMI</p>
              <p className="text-sm leading-relaxed text-ink/70">
                Kami bab kampus {ch.short}. Gerakan, kempen, dan kawan baru. Zine ini satu bab
                dari cerita kami.
              </p>
            </div>
          </div>
          <div>
            <p className="display mb-4 text-2xl">DARI FEED KAMI</p>
            <GalleryStrip slug={slug} tone="d" />
          </div>
        </section>
      </main>
      <FooterD />
    </div>
  );
}

/* ================= E ================= */

function ChapterE({ slug }: { slug: string }) {
  const ch = getChapter(slug);
  return (
    <div className="dir-e min-h-screen bg-ink text-paper">
      <NavE />
      <main className="mx-auto max-w-7xl px-5">
        <section className="grid items-center gap-12 py-20 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <div className="mb-6 flex items-center gap-3">
              <span className="h-3 w-3 bg-brand" />
              <span className="text-xs font-black uppercase tracking-[0.25em] text-paper/50">
                {ch.ig}
              </span>
            </div>
            <h1 className="display text-5xl leading-[0.9] sm:text-7xl">{ch.name}</h1>
            <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-paper/60">{ch.tagline}</p>
            <div className="mt-8">
              <QuickLinks slug={slug} dark />
            </div>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href={`/chapters/${slug}/team`}
                className="press bg-hi px-8 py-3.5 text-sm font-black text-ink"
              >
                JUMPA TEAM
              </Link>
              <Link
                href="/register"
                className="press border-2 border-paper/30 px-8 py-3.5 text-sm font-black text-paper hover:border-brand hover:text-brand"
              >
                JOIN CHAPTER INI
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Placeholder
              ratio="4/5"
              caption={`Photo: ${ch.name} dalam perhimpunan`}
              className="border-0"
            />
            <div className="mt-8">
              <Placeholder
                ratio="4/5"
                caption="Photo: event chapter, keramaian"
                className="border-0"
              />
            </div>
            <div className="col-span-2 bg-brand p-4">
              <p className="display text-lg leading-tight">KAMPUS KAU, SUARA KAU.</p>
            </div>
          </div>
        </section>
        <section className="border-t border-paper/10 py-16">
          <p className="display mb-6 text-3xl">DARI FEED KAMI</p>
          <GalleryStrip slug={slug} tone="e" />
        </section>
      </main>
      <FooterE />
    </div>
  );
}

/* ================= PAGE ================= */

export default function ChapterPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const variants = [
    <ChapterA key="a" slug={slug} />,
    <ChapterB key="b" slug={slug} />,
    <ChapterC key="c" slug={slug} />,
    <ChapterD key="d" slug={slug} />,
    <ChapterE key="e" slug={slug} />,
  ];
  return (
    <Suspense fallback={null}>
      <VariantFrame names={NAMES}>{variants}</VariantFrame>
    </Suspense>
  );
}
