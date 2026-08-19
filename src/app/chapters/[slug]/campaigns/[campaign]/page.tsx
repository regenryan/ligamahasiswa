"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useParams } from "next/navigation";
import { VariantFrame } from "@/components/VariantFrame";
import { NavA, FooterA, NavB, FooterB, NavC, FooterC, NavD, FooterD, NavE, FooterE } from "@/components/shells";
import { Placeholder } from "@/components/Placeholder";
import { useNowDaysSince } from "@/components/clock";
import { getCampaign, aukuStart } from "@/lib/mock";

const NAMES = ["A Kad Merah", "B Skuad Kampus", "C Midnight Demo", "D Zine Print", "E Flat Signal"];

function Demands({ items, tone }: { items: string[]; tone: "a" | "b" | "c" | "d" | "e" }) {
  const style =
    tone === "a"
      ? "border-2 border-ink p-5 bg-paper"
      : tone === "b"
        ? "rounded-2xl bg-paper p-5 shadow-[0_2px_12px_rgba(17,17,17,0.06)]"
        : tone === "c"
          ? "border border-white/10 bg-mist p-5"
          : tone === "d"
            ? "border-2 border-ink p-5 bg-cream"
            : "border-2 border-paper/15 bg-mist p-5";
  const num = tone === "a" || tone === "d" ? "display text-brand" : tone === "c" ? "display text-glow" : "font-black text-brand";
  return (
    <ol className="space-y-3">
      {items.map((d, i) => (
        <li key={d} className={`flex gap-4 ${style}`}>
          <span className={`${num} text-lg leading-snug`}>{String(i + 1).padStart(2, "0")}</span>
          <span className="text-sm leading-relaxed">{d}</span>
        </li>
      ))}
    </ol>
  );
}

function ShareKit({ tone, caption }: { tone: "a" | "b" | "c" | "d" | "e"; caption: string }) {
  const dark = tone === "c";
  const box = dark
    ? "border border-white/15 bg-mist"
    : "border-2 border-ink bg-cream";
  return (
    <section className={`${box} p-5`}>
      <p className={`mb-3 text-xs font-bold uppercase tracking-[0.2em] ${dark ? "text-glow" : "text-brand"}`}>
        Share kit
      </p>
      <div className="flex flex-col gap-4 sm:flex-row">
        <Placeholder
          ratio="4/3"
          caption="Shareable poster: tuntutan kempen, typography tebal, sedia dimuat turun"
          className={dark ? "border-0" : ""}
        />
        <div className="flex flex-1 flex-col">
          <p className={`text-xs font-bold uppercase tracking-[0.16em] ${dark ? "text-paper/50" : "text-ink/50"}`}>
            Caption sedia copy
          </p>
          <textarea
            readOnly
            value={caption}
            rows={5}
            className={`mt-2 w-full flex-1 resize-none bg-transparent p-2 text-xs leading-relaxed ${
              dark ? "text-paper/70" : "text-ink/70"
            }`}
          />
          <div className="mt-3 flex gap-2">
            <button type="button" className={`press border-2 px-4 py-2 text-xs font-bold uppercase tracking-widest ${dark ? "border-paper/30 text-paper hover:border-glow hover:text-glow" : "border-ink hover:bg-ink hover:text-paper"}`}>
              Copy caption
            </button>
            <button type="button" className={`press border-2 px-4 py-2 text-xs font-bold uppercase tracking-widest ${dark ? "border-paper/30 text-paper hover:border-glow hover:text-glow" : "border-ink hover:bg-ink hover:text-paper"}`}>
              Muat turun poster
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function CtaRow({ slug, tone }: { slug: string; tone: "a" | "b" | "c" | "d" | "e" }) {
  const base =
    tone === "a"
      ? "press border-2 border-ink px-6 py-3 text-sm font-bold uppercase tracking-widest hover:bg-ink hover:text-paper"
      : tone === "b"
        ? "press rounded-full border-2 border-ink/15 bg-paper px-6 py-3 text-sm font-bold"
        : tone === "c"
          ? "press border border-paper/25 px-6 py-3 text-sm font-bold uppercase tracking-[0.16em] text-paper hover:border-glow hover:text-glow"
          : tone === "d"
            ? "press stamp border-2 border-ink px-6 py-2.5 text-sm font-bold"
            : "press border-2 border-paper/30 px-7 py-3 text-sm font-black uppercase tracking-[0.16em] hover:border-brand hover:text-brand";
  const solid =
    tone === "a"
      ? "press display bg-brand px-6 py-3 text-sm tracking-widest text-paper"
      : tone === "b"
        ? "press rounded-full bg-brand px-6 py-3 text-sm font-bold text-paper"
        : tone === "c"
          ? "press bg-brand px-7 py-3 text-sm font-bold uppercase tracking-[0.16em] text-paper"
          : tone === "d"
            ? "press stamp bg-brand px-6 py-2.5 text-sm font-bold text-paper"
            : "press bg-hi px-7 py-3.5 text-sm font-black text-ink";
  return (
    <div className="flex flex-wrap gap-3">
      <Link href={`/chapters/${slug}/fundraise`} className={solid}>
        Sumbang / Fundraise
      </Link>
      <Link href={`/chapters/${slug}/campaigns/mansuh-auku`} className={base}>
        Jadi volunteer
      </Link>
    </div>
  );
}

/* ================= A ================= */

function CampaignA({ slug, cid }: { slug: string; cid: string }) {
  const c = getCampaign(slug, cid);
  const days = useNowDaysSince(aukuStart);
  return (
    <div className="dir-a min-h-screen bg-paper text-ink">
      <NavA />
      <main>
        <section className="relative border-b-4 border-ink">
          <div className="halftone absolute inset-0 opacity-[0.07]" aria-hidden="true" />
          <div className="relative mx-auto max-w-7xl px-5 py-20">
            <div className="flex flex-wrap items-center gap-3">
              <span className="stamp text-xs text-brand">Kempen</span>
              <span className="border-2 border-ink px-2 py-1 text-[10px] font-bold uppercase tracking-[0.2em]">
                {c.status}
              </span>
            </div>
            <h1 className="display mt-6 max-w-4xl text-5xl leading-[0.95] sm:text-7xl">{c.title}</h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink/70">{c.summary}</p>
            <div className="mt-8">
              <CtaRow slug={slug} tone="a" />
            </div>
          </div>
        </section>
        {c.hasTicker && (
          <section className="border-b-4 border-ink bg-brand py-4">
            <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-10 gap-y-2 px-5">
              <span className="display text-sm tracking-[0.25em] text-paper">AUKU HIDUP SEJAK {1971}</span>
              <span className="display text-lg text-paper">{days === null ? "00" : days.toLocaleString()} HARI</span>
              <span className="text-xs text-paper/80">Tuntutan kami: Mansuhkan AUKU.</span>
            </div>
          </section>
        )}
        <section className="mx-auto grid max-w-7xl gap-12 px-5 py-16 lg:grid-cols-[1fr_0.8fr]">
          <div className="space-y-8">
            <div>
              <p className="display mb-4 text-2xl">TUNTUTAN</p>
              <Demands items={c.demands} tone="a" />
            </div>
            <ShareKit tone="a" caption={`SOKONG KEMPPEN ${c.title.toUpperCase()}. BACA TUNTUTAN, KONGSI POSTER, DATANG EVENT. #ligamahasiswa`} />
          </div>
          <div className="space-y-6">
            <Placeholder ratio="16/10" caption={`Photo: perhimpunan atau program ${c.title}`} />
            <div className="border-2 border-ink bg-cream p-5">
              <p className="display mb-2 text-xs tracking-widest text-brand">KEMBANGAN</p>
              <p className="text-sm leading-relaxed text-ink/70">
                {c.timeline.map((t) => `${t.date} - ${t.text}`).join(" • ")}
              </p>
            </div>
          </div>
        </section>
      </main>
      <FooterA />
    </div>
  );
}

/* ================= B ================= */

function CampaignB({ slug, cid }: { slug: string; cid: string }) {
  const c = getCampaign(slug, cid);
  const days = useNowDaysSince(aukuStart);
  return (
    <div className="dir-b min-h-screen bg-cream text-ink">
      <NavB />
      <main className="mx-auto max-w-6xl px-4 py-12">
        <span className="inline-flex items-center gap-2 rounded-full bg-hi px-3 py-1 text-xs font-bold">
          Kempen
          <span className="rounded-full bg-ink px-2 py-0.5 text-[10px] text-paper">{c.status}</span>
        </span>
        <h1 className="font-baloo mt-5 max-w-3xl text-4xl font-bold leading-[1.05] sm:text-5xl">{c.title}</h1>
        <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-ink/65">{c.summary}</p>
        <div className="mt-6">
          <CtaRow slug={slug} tone="b" />
        </div>
        {c.hasTicker && (
          <div className="mt-8 flex flex-wrap items-center gap-4 rounded-2xl bg-brand p-5 text-paper">
            <span className="font-baloo text-2xl font-bold">AUKU hidup sejak {1971}</span>
            <span className="rounded-full bg-paper px-4 py-1.5 text-sm font-bold text-brand">
              {days === null ? "00" : days.toLocaleString()} hari
            </span>
            <span className="text-sm font-bold">Mansuhkan AUKU. Sekarang.</span>
          </div>
        )}
        <section className="mt-12 grid gap-8 lg:grid-cols-[1fr_0.85fr]">
          <div>
            <p className="font-baloo mb-4 text-2xl font-bold">Tuntutan kami</p>
            <Demands items={c.demands} tone="b" />
          </div>
          <div className="space-y-6">
            <Placeholder ratio="16/10" caption={`Photo: aksi ${c.title}, senyum + energy`} className="rounded-2xl border-0" />
            <div className="rounded-2xl bg-paper p-5 shadow-[0_2px_12px_rgba(17,17,17,0.06)]">
              <p className="mb-1 text-xs font-bold uppercase tracking-widest text-brand">Kembangan</p>
              <p className="text-sm leading-relaxed text-ink/65">{c.timeline.map((t) => `${t.date} - ${t.text}`).join(" • ")}</p>
            </div>
            <ShareKit tone="b" caption={`SOKONG ${c.title.toUpperCase()}! BACA TUNTUTAN, KONGSI POSTER, DATANG EVENT. #ligamahasiswa`} />
          </div>
        </section>
      </main>
      <FooterB />
    </div>
  );
}

/* ================= C ================= */

function CampaignC({ slug, cid }: { slug: string; cid: string }) {
  const c = getCampaign(slug, cid);
  const days = useNowDaysSince(aukuStart);
  return (
    <div className="dir-c min-h-screen bg-midnight text-paper">
      <NavC />
      <main className="mx-auto max-w-7xl px-5 py-16">
        <span className="display text-sm tracking-[0.3em] text-glow">KEMPEN / {c.status.toUpperCase()}</span>
        <h1 className="display mt-5 max-w-4xl text-5xl leading-[0.95] sm:text-7xl">{c.title}</h1>
        <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-paper/60">{c.summary}</p>
        <div className="mt-7">
          <CtaRow slug={slug} tone="c" />
        </div>
        {c.hasTicker && (
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 border border-brand/50 bg-mist px-6 py-5">
            <span className="display text-xl text-glow">AUKU HIDUP SEJAK {1971}</span>
            <span className="display text-3xl">{days === null ? "00" : days.toLocaleString()} HARI</span>
            <span className="text-sm text-paper/60">Mansuhkan AUKU. Sekarang.</span>
          </div>
        )}
        <section className="mt-14 grid gap-10 lg:grid-cols-[1fr_0.85fr]">
          <div>
            <p className="display mb-5 text-2xl">TUNTUTAN</p>
            <Demands items={c.demands} tone="c" />
          </div>
          <div className="space-y-6">
            <Placeholder ratio="16/10" caption={`Photo: perhimpunan malam atau aksi ${c.title}`} className="border-0" />
            <div className="border border-white/10 bg-mist p-5">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-glow">Kembangann</p>
              <p className="text-sm leading-relaxed text-paper/60">{c.timeline.map((t) => `${t.date} - ${t.text}`).join(" • ")}</p>
            </div>
            <ShareKit tone="c" caption={`SOKONG ${c.title.toUpperCase()}. BACA TUNTUTAN, KONGSI POSTER, DATANG EVENT. #ligamahasiswa`} />
          </div>
        </section>
      </main>
      <FooterC />
    </div>
  );
}

/* ================= D ================= */

function CampaignD({ slug, cid }: { slug: string; cid: string }) {
  const c = getCampaign(slug, cid);
  const days = useNowDaysSince(aukuStart);
  return (
    <div className="dir-d grain relative min-h-screen bg-paper text-ink">
      <NavD />
      <main className="mx-auto max-w-5xl px-5 py-14">
        <p className="stamp text-xs text-brand">Kempen / {c.status}</p>
        <h1 className="display mt-6 text-4xl leading-[0.98] sm:text-6xl">{c.title}</h1>
        <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-ink/70">{c.summary}</p>
        <div className="mt-7">
          <CtaRow slug={slug} tone="d" />
        </div>
        {c.hasTicker && (
          <div className="mt-10 grid gap-3 border-2 border-ink bg-brand p-6 text-paper sm:grid-cols-3">
            <div>
              <p className="display text-xs tracking-[0.25em]">SEJAK {1971}</p>
              <p className="display mt-1 text-3xl">AUKU HIDUP</p>
            </div>
            <div>
              <p className="display text-xs tracking-[0.25em]">HARI DIPERJUANGKAN</p>
              <p className="display mt-1 text-3xl">{days === null ? "00" : days.toLocaleString()}</p>
            </div>
            <div>
              <p className="display text-xs tracking-[0.25em]">TUNTUTAN</p>
              <p className="display mt-1 text-3xl">MANSUHKAN AUKU</p>
            </div>
          </div>
        )}
        <section className="mt-12 grid gap-10 md:grid-cols-[1fr_0.9fr]">
          <div>
            <p className="display mb-4 text-2xl">TUNTUTAN</p>
            <Demands items={c.demands} tone="d" />
          </div>
          <div className="space-y-6">
            <Placeholder ratio="4/3" caption={`Foto: dokumentasi ${c.title}`} />
            <div className="border-2 border-ink bg-cream p-5">
              <p className="display mb-2 text-xs tracking-widest text-brand">KEMBANGAN</p>
              <p className="text-sm leading-relaxed text-ink/70">
                {c.timeline.map((t) => `${t.date} - ${t.text}`).join(" • ")}
              </p>
            </div>
            <ShareKit tone="d" caption={`SOKONG ${c.title.toUpperCase()}. BACA TUNTUTAN, KONGSI POSTER, DATANG EVENT. #ligamahasiswa`} />
          </div>
        </section>
      </main>
      <FooterD />
    </div>
  );
}

/* ================= E ================= */

function CampaignE({ slug, cid }: { slug: string; cid: string }) {
  const c = getCampaign(slug, cid);
  const days = useNowDaysSince(aukuStart);
  return (
    <div className="dir-e min-h-screen bg-ink text-paper">
      <NavE />
      <main className="mx-auto max-w-7xl px-5 py-16">
        <div className="flex items-center gap-3">
          <span className="h-3 w-3 bg-brand" />
          <span className="text-xs font-black uppercase tracking-[0.25em] text-paper/50">
            Kempen / {c.status}
          </span>
        </div>
        <h1 className="display mt-5 max-w-4xl text-5xl leading-[0.9] sm:text-7xl">{c.title}</h1>
        <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-paper/60">{c.summary}</p>
        <div className="mt-7">
          <CtaRow slug={slug} tone="e" />
        </div>
        {c.hasTicker && (
          <div className="mt-10 grid gap-px overflow-hidden bg-paper/15 sm:grid-cols-3">
            <div className="bg-mist p-6">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-brand">Sejak {1971}</p>
              <p className="display mt-2 text-3xl">AUKU HIDUP</p>
            </div>
            <div className="bg-mist p-6">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-brand">Hari diperjuangkan</p>
              <p className="display mt-2 text-3xl">{days === null ? "00" : days.toLocaleString()}</p>
            </div>
            <div className="bg-brand p-6">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-paper/80">Tuntutan</p>
              <p className="display mt-2 text-3xl text-paper">MANSUHKAN AUKU</p>
            </div>
          </div>
        )}
        <section className="mt-14 grid gap-10 lg:grid-cols-[1fr_0.85fr]">
          <div>
            <p className="display mb-5 text-2xl">TUNTUTAN</p>
            <Demands items={c.demands} tone="e" />
          </div>
          <div className="space-y-6">
            <Placeholder ratio="16/10" caption={`Photo: aksi ${c.title}`} className="border-0" />
            <div className="border-2 border-paper/15 bg-mist p-5">
              <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-brand">Kembangan</p>
              <p className="text-sm leading-relaxed text-paper/60">{c.timeline.map((t) => `${t.date} - ${t.text}`).join(" • ")}</p>
            </div>
            <ShareKit tone="e" caption={`SOKONG ${c.title.toUpperCase()}. BACA TUNTUTAN, KONGSI POSTER, DATANG EVENT. #ligamahasiswa`} />
          </div>
        </section>
      </main>
      <FooterE />
    </div>
  );
}

/* ================= PAGE ================= */

export default function CampaignPage() {
  const params = useParams<{ slug: string; campaign: string }>();
  const { slug, campaign: cid } = params;
  const variants = [
    <CampaignA key="a" slug={slug} cid={cid} />,
    <CampaignB key="b" slug={slug} cid={cid} />,
    <CampaignC key="c" slug={slug} cid={cid} />,
    <CampaignD key="d" slug={slug} cid={cid} />,
    <CampaignE key="e" slug={slug} cid={cid} />,
  ];
  return (
    <Suspense fallback={null}>
      <VariantFrame names={NAMES}>{variants}</VariantFrame>
    </Suspense>
  );
}
