"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useParams } from "next/navigation";
import { VariantFrame } from "@/components/VariantFrame";
import { NavA, FooterA, NavB, FooterB, NavC, FooterC, NavD, FooterD, NavE, FooterE } from "@/components/shells";
import { Placeholder } from "@/components/Placeholder";
import { members, getChapter } from "@/lib/mock";

const NAMES = ["A Kad Merah", "B Skuad Kampus", "C Midnight Demo", "D Zine Print", "E Flat Signal"];

function useChapterMembers() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const all = slug === "malaysia" ? members : members.filter((m) => m.chapterSlug === slug);
  return { slug, ch: getChapter(slug), all };
}

function MemberCard({
  name,
  role,
  blurb,
  tone,
}: {
  name: string;
  role: string;
  blurb: string;
  tone: "a" | "b" | "c" | "d" | "e";
}) {
  const frame =
    tone === "a"
      ? "border-2 border-ink bg-paper"
      : tone === "b"
        ? "rounded-3xl bg-paper shadow-[0_2px_16px_rgba(17,17,17,0.06)]"
        : tone === "c"
          ? "border border-white/10 bg-mist"
          : tone === "d"
            ? "border-2 border-ink bg-paper rotate-[-0.3deg]"
            : "border-2 border-paper/15 bg-mist";
  return (
    <article className={`${frame} overflow-hidden`}>
      <div className={tone === "b" ? "p-3" : ""}>
        <Placeholder
          ratio="4/5"
          caption={`Portrait photo: ${name}, ${role}. Candid protest shot atau warm studio, natural light`}
          className={tone === "b" ? "rounded-2xl border-0" : "border-0"}
        />
      </div>
      <div className={tone === "b" ? "px-5 pb-5" : "p-5"}>
        <p className="font-bold leading-snug">{name}</p>
        <p className={`text-xs font-bold uppercase tracking-[0.16em] ${tone === "c" ? "text-glow" : "text-brand"}`}>
          {role}
        </p>
        <p className={`mt-2 text-xs leading-relaxed ${tone === "c" ? "text-paper/50" : "text-ink/55"}`}>
          {blurb}
        </p>
      </div>
    </article>
  );
}

/* ================= A ================= */

function TeamA() {
  const { ch, all } = useChapterMembers();
  return (
    <div className="dir-a min-h-screen bg-paper text-ink">
      <NavA />
      <main className="mx-auto max-w-7xl px-5 py-16">
        <div className="flex flex-wrap items-end justify-between gap-6 border-b-4 border-ink pb-8">
          <div>
            <p className="display mb-3 text-xs tracking-[0.25em] text-brand">LINEUP {ch.short.toUpperCase()}</p>
            <h1 className="display text-5xl sm:text-6xl">SIAPA KAMI</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            {["Semua", "President", "Jurucakap", "Vice President"].map((f) => (
              <button
                key={f}
                type="button"
                className={`press border-2 border-ink px-3 py-1.5 text-xs font-bold uppercase tracking-widest ${
                  f === "Semua" ? "bg-ink text-paper" : "bg-paper hover:bg-cream"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {all.map((m) => (
            <MemberCard key={m.name} name={m.name} role={m.role} blurb={m.blurb} tone="a" />
          ))}
        </div>
        <div className="mt-16 border-2 border-ink bg-brand p-8 text-paper">
          <p className="display text-3xl leading-tight">NAK DALAM LINEUP NI?</p>
          <p className="mt-2 text-sm text-paper/85">Daftar, jadi ahli, dan tunjuk apa kau boleh bawa.</p>
          <Link
            href="/register"
            className="press display mt-6 inline-block bg-paper px-6 py-3 text-sm tracking-widest text-ink"
          >
            JOIN LIGA
          </Link>
        </div>
      </main>
      <FooterA />
    </div>
  );
}

/* ================= B ================= */

function TeamB() {
  const { ch, all } = useChapterMembers();
  return (
    <div className="dir-b min-h-screen bg-cream text-ink">
      <NavB />
      <main className="mx-auto max-w-6xl px-4 py-14">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-brand">
              Lineup {ch.short}
            </p>
            <h1 className="font-baloo text-4xl font-bold sm:text-5xl">Team yang jaga kampus</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            {["Semua", "President", "Jurucakap"].map((f) => (
              <button
                key={f}
                type="button"
                className={`press rounded-full px-4 py-2 text-xs font-bold ${
                  f === "Semua" ? "bg-ink text-paper" : "bg-paper text-ink/70"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {all.map((m) => (
            <MemberCard key={m.name} name={m.name} role={m.role} blurb={m.blurb} tone="b" />
          ))}
        </div>
        <div className="mt-14 rounded-3xl bg-brand p-8 text-paper">
          <p className="font-baloo text-2xl font-bold">Nak dalam lineup ni?</p>
          <p className="mt-1 text-sm text-paper/85">Daftar, jadi ahli, tunjuk apa kau boleh bawa.</p>
          <Link
            href="/register"
            className="press mt-5 inline-block rounded-full bg-paper px-6 py-3 text-sm font-bold text-ink"
          >
            Join Liga
          </Link>
        </div>
      </main>
      <FooterB />
    </div>
  );
}

/* ================= C ================= */

function TeamC() {
  const { ch, all } = useChapterMembers();
  return (
    <div className="dir-c min-h-screen bg-midnight text-paper">
      <NavC />
      <main className="mx-auto max-w-7xl px-5 py-16">
        <div className="flex flex-wrap items-end justify-between gap-6 border-b border-white/10 pb-8">
          <div>
            <p className="display text-sm tracking-[0.3em] text-glow">LINEUP {ch.short.toUpperCase()}</p>
            <h1 className="display mt-4 text-5xl sm:text-6xl">WAJAH GERAKAN</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            {["Semua", "President", "Jurucakap"].map((f) => (
              <button
                key={f}
                type="button"
                className={`press border px-4 py-1.5 text-xs font-bold uppercase tracking-[0.14em] ${
                  f === "Semua"
                    ? "border-brand bg-brand text-paper"
                    : "border-paper/20 text-paper/60 hover:border-glow hover:text-glow"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {all.map((m) => (
            <MemberCard key={m.name} name={m.name} role={m.role} blurb={m.blurb} tone="c" />
          ))}
        </div>
        <div className="mt-16 border border-brand/50 bg-mist p-8">
          <p className="display text-3xl">NAK DALAM LINEUP NI?</p>
          <p className="mt-2 text-sm text-paper/60">Daftar, jadi ahli, tunjuk apa kau boleh bawa.</p>
          <Link
            href="/register"
            className="press mt-6 inline-block bg-brand px-8 py-3 text-sm font-bold uppercase tracking-[0.16em] text-paper"
          >
            Join liga
          </Link>
        </div>
      </main>
      <FooterC />
    </div>
  );
}

/* ================= D ================= */

function TeamD() {
  const { ch, all } = useChapterMembers();
  return (
    <div className="dir-d grain relative min-h-screen bg-paper text-ink">
      <NavD />
      <main className="mx-auto max-w-5xl px-5 py-16">
        <div className="border-b-2 border-ink pb-8">
          <p className="stamp text-xs text-brand">Lineup {ch.short}</p>
          <h1 className="display mt-5 text-4xl sm:text-5xl">SIAPA KAMI</h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink/65">
            Nama, peranan, dan cerita pendek. Sembang dengan kami di event, bukan sekadar di
            Instagram.
          </p>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {all.map((m) => (
            <MemberCard key={m.name} name={m.name} role={m.role} blurb={m.blurb} tone="d" />
          ))}
        </div>
        <div className="mt-14 border-2 border-ink bg-cream p-8 text-center">
          <p className="display text-2xl">NAK DALAM LINEUP NI?</p>
          <Link
            href="/register"
            className="press stamp mt-5 inline-block bg-brand px-7 py-2.5 text-sm font-bold text-paper"
          >
            Join kami
          </Link>
        </div>
      </main>
      <FooterD />
    </div>
  );
}

/* ================= E ================= */

function TeamE() {
  const { ch, all } = useChapterMembers();
  return (
    <div className="dir-e min-h-screen bg-ink text-paper">
      <NavE />
      <main className="mx-auto max-w-7xl px-5 py-16">
        <div className="flex flex-wrap items-end justify-between gap-6 border-b border-paper/10 pb-8">
          <div>
            <p className="mb-3 text-xs font-black uppercase tracking-[0.25em] text-brand">
              Lineup {ch.short}
            </p>
            <h1 className="display text-5xl sm:text-6xl">SIAPA KAMI</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            {["Semua", "President", "Jurucakap"].map((f) => (
              <button
                key={f}
                type="button"
                className={`press border-2 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] ${
                  f === "Semua" ? "border-hi bg-hi text-ink" : "border-paper/25 text-paper/60 hover:border-brand hover:text-brand"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {all.map((m) => (
            <MemberCard key={m.name} name={m.name} role={m.role} blurb={m.blurb} tone="e" />
          ))}
        </div>
        <div className="mt-16 bg-brand p-8">
          <p className="display text-3xl">NAK DALAM LINEUP NI?</p>
          <p className="mt-2 text-sm text-paper/85">Daftar, jadi ahli, tunjuk apa kau boleh bawa.</p>
          <Link
            href="/register"
            className="press mt-6 inline-block bg-ink px-8 py-3.5 text-sm font-black text-hi"
          >
            JOIN LIGA
          </Link>
        </div>
      </main>
      <FooterE />
    </div>
  );
}

/* ================= PAGE ================= */

export default function TeamPage() {
  const variants = [
    <TeamA key="a" />,
    <TeamB key="b" />,
    <TeamC key="c" />,
    <TeamD key="d" />,
    <TeamE key="e" />,
  ];
  return (
    <Suspense fallback={null}>
      <VariantFrame names={NAMES}>{variants}</VariantFrame>
    </Suspense>
  );
}
