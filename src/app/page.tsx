"use client";

import Link from "next/link";
import { Suspense } from "react";
import { VariantFrame } from "@/components/VariantFrame";
import { NavA, FooterA, NavB, FooterB, NavC, FooterC, NavD, FooterD, NavE, FooterE } from "@/components/shells";
import { Placeholder } from "@/components/Placeholder";
import { useNow, useCountdown, useDaysSince } from "@/components/clock";
import { chapters, campaigns, stories, allies, countdownTarget, aukuStart } from "@/lib/mock";

const NAMES = ["A Kad Merah", "B Skuad Kampus", "C Midnight Demo", "D Zine Print", "E Flat Signal"];

function CountdownBlock({ big = false }: { big?: boolean }) {
  const now = useNow();
  const c = useCountdown(countdownTarget, now);
  const cells = [
    { v: c.ready ? String(c.days).padStart(2, "0") : "00", l: "hari" },
    { v: c.ready ? String(c.hours).padStart(2, "0") : "00", l: "jam" },
    { v: c.ready ? String(c.minutes).padStart(2, "0") : "00", l: "minit" },
    { v: c.ready ? String(c.seconds).padStart(2, "0") : "00", l: "saat" },
  ];
  const cell = big
    ? "border-2 border-current px-3 py-2 text-2xl sm:text-3xl"
    : "border-2 border-current px-2 py-1.5 text-base sm:text-xl";
  return (
    <div className="flex items-center gap-2 sm:gap-3">
      {cells.map((x) => (
        <div key={x.l} className="text-center">
          <div className={`${cell} font-bold tabular-nums`}>{x.v}</div>
          <p className="countdown-label mt-1 text-[11px] font-bold uppercase tracking-[0.18em]">{x.l}</p>
        </div>
      ))}
    </div>
  );
}

function AukuTicker({ light = false }: { light?: boolean }) {
  const now = useNow();
  const days = useDaysSince(aukuStart, now);
  return (
    <p className={`text-sm font-bold tracking-wide ${light ? "text-paper/80" : "text-ink/70"}`}>
      AUKU telah memerintah selama <span className="tabular-nums text-brand">{days === null ? "00" : days.toLocaleString()}</span> hari.
      {" "}Dah cukup.
    </p>
  );
}

/* ================= A. KAD MERAH ================= */

function HomeA() {
  const featured = campaigns[0];
  return (
    <div className="dir-a min-h-screen bg-paper text-ink">
      <NavA />
      <main>
        <section className="relative border-b-4 border-ink">
          <div className="halftone absolute inset-0 opacity-[0.07]" aria-hidden="true" />
          <div className="relative mx-auto grid max-w-7xl gap-10 px-5 py-20 lg:grid-cols-[1.2fr_0.8fr] lg:py-28">
            <div>
              <span className="stamp mb-6 inline-block text-sm text-brand">AUKU 1971</span>
              <h1 className="display text-6xl leading-[0.95] sm:text-7xl lg:text-8xl">
                MANSUH
                <br />
                AUKU<RedX />
              </h1>
              <p className="mt-6 max-w-lg text-lg leading-relaxed text-ink/70">
                Lebih setengah abad pelajar diperintah akta yang menyekat suara kami. Sekarang
                dah cukup. Kampus bebas bermula dengan satu tuntutan: mansuh AUKU.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="/chapters/malaysia/campaigns/mansuh-auku"
                  className="press display bg-brand px-6 py-3 text-sm tracking-widest text-paper"
                >
                  SERTAI KEMENANGAN INI
                </Link>
                <Link
                  href="/register"
                  className="press display border-2 border-ink px-6 py-3 text-sm tracking-widest hover:bg-ink hover:text-paper"
                >
                  JOIN LIGA
                </Link>
              </div>
              <div className="mt-10">
                <AukuTicker />
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="bg-paper p-5 shadow-[8px_8px_0_#111111]">
                <p className="display mb-3 text-xs tracking-widest text-brand">Hari-H AUKU</p>
                <CountdownBlock big />
              </div>
              <Placeholder
                ratio="16/10"
                caption="Hero photo: perhimpunan pelajar depan Parlimen, sepanduk merah, kamera dekat"
              />
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-20">
          <h2 className="display text-4xl sm:text-5xl">
            KEMENANGAN SEDANG DIBINA
          </h2>
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            <Link
              href={`/chapters/${featured.chapterSlug}/campaigns/${featured.slug}`}
              className="press group border-2 border-ink bg-brand p-6 text-paper transition-transform hover:-translate-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="display text-xs tracking-widest">KEMENANGAN UTAMA</span>
                <span className="stamp text-xs">{featured.status}</span>
              </div>
              <p className="display mt-6 text-4xl leading-none">{featured.title}</p>
              <p className="mt-4 text-sm leading-relaxed text-paper/85">{featured.summary}</p>
              <p className="display mt-6 text-xs tracking-widest underline underline-offset-4">
                BACA TUNTUTAN KAMI
              </p>
            </Link>
            {campaigns.slice(1, 3).map((c) => (
              <Link
                key={c.slug}
                href={`/chapters/${c.chapterSlug}/campaigns/${c.slug}`}
                className="press group border-2 border-ink bg-paper p-6 transition-transform hover:-translate-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="display text-xs tracking-widest text-ink/50">KAMPANYE</span>
                  <span className={`stamp text-xs ${c.status === "Menang" ? "text-brand" : "text-ink/60"}`}>
                    {c.status}
                  </span>
                </div>
                <p className="display mt-6 text-2xl leading-tight">{c.title}</p>
                <p className="mt-3 text-sm leading-relaxed text-ink/60">{c.summary}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="border-y-4 border-ink bg-cream">
          <div className="mx-auto max-w-7xl px-5 py-20">
            <h2 className="display text-4xl sm:text-5xl">
              LIGA ADA DI MANA-MANA
            </h2>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {chapters.map((ch, i) => (
                <Link
                  key={ch.slug}
                  href={`/chapters/${ch.slug}`}
                  className="press group border-2 border-ink bg-paper p-5 transition-transform hover:-rotate-1"
                  style={{ rotate: i % 3 === 1 ? "0.5deg" : i % 3 === 2 ? "-0.5deg" : "0deg" }}
                >
                  <div className="flex items-center justify-between">
                    <p className="display text-xl">{ch.name}</p>
                    <RedX className="text-ink/15" />
                  </div>
                  <p className="mt-2 text-sm text-ink/60">{ch.tagline}</p>
                  <p className="mt-4 text-xs font-bold tracking-widest text-brand">{ch.ig}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

          <section className="mx-auto max-w-7xl px-5 py-20">
          <h2 className="display text-4xl sm:text-5xl">KENAPA AKU JOIN</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {stories.map((s) => (
              <figure key={s.name} className="border-2 border-ink bg-paper p-5">
                <Placeholder
                  ratio="4/5"
                  caption={`Portrait photo: ${s.name}, candid protest shot, natural light`}
                />
                <figcaption className="mt-4">
                  <p className="text-sm leading-relaxed text-ink/75">&quot;{s.text}&quot;</p>
                  <p className="display mt-3 text-xs tracking-widest text-brand">{s.name.toUpperCase()}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section className="border-y-4 border-ink bg-ink py-10 text-paper">
          <div className="mx-auto max-w-7xl px-5">
            <p className="display mb-6 text-xs tracking-[0.25em] text-paper/50">BERSAMA KAMI</p>
            <div className="flex flex-wrap gap-3">
              {allies.map((a) => (
                <span key={a} className="stamp text-sm text-paper/80">
                  {a}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-24 text-center">
          <p className="display text-5xl leading-tight sm:text-6xl">
            JANGAN TUNGGU
            <br />
            ORANG LAIN.
          </p>
          <Link
            href="/register"
            className="press display mt-10 inline-block bg-brand px-10 py-4 text-base tracking-widest text-paper"
          >
            DAFTAR SEKARANG
          </Link>
        </section>
      </main>
      <FooterA />
    </div>
  );
}

function RedX({ className = "" }: { className?: string }) {
  return (
    <span className={`red-x ml-2 inline-block align-baseline text-brand ${className}`} aria-hidden="true" />
  );
}

/* ================= B. SKUAD KAMPUS ================= */

function HomeB() {
  return (
    <div className="dir-b min-h-screen bg-cream text-ink">
      <NavB />
      <main>
        <section className="mx-auto grid max-w-6xl gap-10 px-4 pb-16 pt-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:pt-20">
          <div>
            <p className="mb-4 inline-block rounded-full bg-hi px-3 py-1 text-xs font-bold">
              {"Gerakan mahasiswa Malaysia, est. 2024"}
            </p>
            <h1 className="font-baloo text-4xl leading-[1.05] font-bold sm:text-5xl lg:text-6xl">
              Kampus tu <span className="text-brand">milik kita</span>, bukan milik akta.
            </h1>
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-ink/65">
              Kami mahasiswa biasa yang dah muak. Sekarang kami buat benda biasa jadi gerakan.
              Jom masuk, jom lawan, jom menang.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                href="/register"
                className="press rounded-full bg-brand px-6 py-3 text-sm font-bold text-paper"
              >
                Join Liga
              </Link>
              <Link
                href="/chapters/malaysia/campaigns/mansuh-auku"
                className="press rounded-full border-2 border-ink/15 bg-paper px-6 py-3 text-sm font-bold"
              >
                Tengok Mansuh AUKU
              </Link>
            </div>
            <div className="mt-8 rounded-2xl bg-paper p-4 shadow-[0_2px_16px_rgba(17,17,17,0.06)]">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.15em] text-ink/50">
                Countdown ke Gerak Jalan Mansuh AUKU
              </p>
              <CountdownBlock />
            </div>
          </div>
          <div className="relative">
            <div className="relative grid grid-cols-2 gap-4">
              <Placeholder
                ratio="4/5"
                caption="Photo: kawan-kawan pegang sepanduk kecil, senyum, hujan renyai"
                className="rotate-[-2deg]"
              />
              <div className="mt-10">
                <Placeholder
                  ratio="4/5"
                  caption="Photo: perhimpunan petang, lampu jalan, sorak"
                  className="rotate-[2deg]"
                />
              </div>
              <span className="tape left-1/2 top-[-8px] -translate-x-1/2 -rotate-3" />
            </div>
            <p className="mt-4 text-center text-xs text-ink/45">
              Foto gerakan dari kampus ke kampus. (mock placeholders)
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16">
          <div className="flex items-end justify-between gap-4">
            <h2 className="font-baloo text-3xl font-bold">Kempen yang kami bawa</h2>
            <Link href="/chapters/malaysia" className="text-sm font-bold text-brand hover:underline">
              Semua kempen
            </Link>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {campaigns.slice(0, 3).map((c, i) => (
              <Link
                key={c.slug}
                href={`/chapters/${c.chapterSlug}/campaigns/${c.slug}`}
                className={`press rounded-3xl bg-paper p-6 shadow-[0_2px_16px_rgba(17,17,17,0.06)] transition-transform hover:-translate-y-1 ${
                  i === 0 ? "bg-brand text-paper" : ""
                }`}
              >
                <span
                  className={`inline-block rounded-full px-2.5 py-1 text-[11px] font-bold ${
                    i === 0 ? "bg-paper/20 text-paper" : "bg-hi text-ink"
                  }`}
                >
                  {c.status}
                </span>
                <p className="mt-4 font-baloo text-xl font-bold leading-snug">{c.title}</p>
                <p className={`mt-2 text-sm leading-relaxed ${i === 0 ? "text-paper/85" : "text-ink/60"}`}>
                  {c.summary}
                </p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="font-baloo text-3xl font-bold">Cawangan Liga</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {chapters.map((ch) => (
              <Link
                key={ch.slug}
                href={`/chapters/${ch.slug}`}
                className="press flex items-center gap-4 rounded-2xl bg-paper p-4 transition-transform hover:-translate-y-0.5"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand font-bold text-paper">
                  {ch.short.slice(0, 2)}
                </span>
                <span>
                  <p className="font-bold">{ch.name}</p>
                  <p className="text-xs text-ink/50">{ch.ig}</p>
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="font-baloo text-3xl font-bold">Kata mereka</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {stories.map((s) => (
              <div key={s.name} className="relative rounded-3xl bg-paper p-6 shadow-[0_2px_16px_rgba(17,17,17,0.06)]">
                <span className="tape left-1/2 top-[-9px] -translate-x-1/2 -rotate-2" />
                <p className="text-sm leading-relaxed text-ink/75">&quot;{s.text}&quot;</p>
                <p className="mt-4 text-xs font-bold text-brand">{s.name}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16">
          <div className="flex flex-wrap items-center gap-3">
            {allies.map((a) => (
              <span key={a} className="rounded-full bg-paper px-4 py-2 text-xs font-bold text-ink/60">
                {a}
              </span>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-20 text-center">
          <p className="font-baloo text-3xl font-bold sm:text-4xl">
            Jom jadi generasi yang tak diam.
          </p>
          <Link
            href="/register"
            className="press mt-8 inline-block rounded-full bg-ink px-10 py-4 text-base font-bold text-paper"
          >
            Daftar sekarang
          </Link>
        </section>
      </main>
      <FooterB />
    </div>
  );
}

/* ================= C. MIDNIGHT DEMO ================= */

function HomeC() {
  const featured = campaigns[0];
  return (
    <div className="dir-c min-h-screen bg-midnight text-paper">
      <NavC />
      <main>
        <section className="relative overflow-hidden">
          <div
            className="pointer-events-none absolute inset-0 opacity-60"
            style={{
              background:
                "radial-gradient(60% 50% at 70% 30%, rgba(225,29,46,0.28), transparent 70%)",
            }}
            aria-hidden="true"
          />
          <div className="relative mx-auto max-w-7xl px-5 pb-20 pt-24 text-center">
            <p className="display text-sm tracking-[0.3em] text-glow [text-shadow:0_0_20px_rgba(255,59,48,0.6)]">
              DARI PARLIMEN HINGGA KAMPUS
            </p>
            <h1 className="display mx-auto mt-6 max-w-5xl text-6xl leading-[0.95] sm:text-7xl lg:text-8xl">
              DAH SUBUH.
              <br />
              MASIH BELUM <span className="text-glow">MENANG.</span>
            </h1>
            <p className="mx-auto mt-7 max-w-xl text-[15px] leading-relaxed text-paper/65">
              Kami bangun bila semua orang tidur. Tuntutan kami tak tidur. Mansuh AUKU bukan
              kempen, ini kesudahan.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/register"
                className="press bg-brand px-8 py-3.5 text-sm font-bold uppercase tracking-[0.16em] text-paper shadow-[0_0_28px_rgba(225,29,46,0.5)]"
              >
                Join pergerakan
              </Link>
              <Link
                href="/chapters/malaysia/campaigns/mansuh-auku"
                className="press border border-paper/25 px-8 py-3.5 text-sm font-bold uppercase tracking-[0.16em] text-paper/80 hover:border-glow hover:text-glow"
              >
                Baca tuntutan
              </Link>
            </div>
            <div className="mx-auto mt-12 flex max-w-xl flex-col items-center gap-3">
              <AukuTicker light />
              <CountdownBlock />
            </div>
          </div>
        </section>

        <section className="border-y border-white/10 bg-brand py-3">
          <div className="marquee-track">
            {Array.from({ length: 2 }).map((_, i) => (
              <span key={i} className="display whitespace-nowrap px-4 text-sm tracking-[0.2em] text-paper">
                MANSUH AUKU MANSUH AUKU MANSUH AUKU MANSUH AUKU MANSUH AUKU MANSUH AUKU
              </span>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-20">
          <h2 className="display text-4xl sm:text-5xl">KEMENANGAN UTAMA</h2>
          <Link
            href={`/chapters/${featured.chapterSlug}/campaigns/${featured.slug}`}
            className="group mt-8 grid gap-0 overflow-hidden border border-white/10 bg-mist lg:grid-cols-2"
          >
            <Placeholder
              ratio="16/10"
              caption="Photo: demo malam, kilat kamera, sepanduk Mansuh AUKU"
              className="border-0 bg-midnight"
            />
            <div className="flex flex-col justify-between p-8 lg:p-12">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-glow">
                  {featured.status} · Tuntutan utama
                </span>
                <p className="display mt-4 text-4xl leading-none sm:text-5xl">{featured.title}</p>
                <p className="mt-5 max-w-md text-sm leading-relaxed text-paper/65">
                  {featured.summary}
                </p>
              </div>
              <div className="mt-8 flex flex-wrap gap-2">
                {featured.demands.map((d) => (
                  <span key={d} className="border border-white/15 px-3 py-1.5 text-xs text-paper/70">
                    {d}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-20">
          <h2 className="display text-4xl sm:text-5xl">CAWANGAN</h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {chapters.map((ch) => (
              <Link
                key={ch.slug}
                href={`/chapters/${ch.slug}`}
                className="press group border border-white/10 bg-mist p-6 transition-colors hover:border-glow/60"
              >
                <p className="display text-2xl text-paper/90 group-hover:text-glow">{ch.name}</p>
                <p className="mt-2 text-sm text-paper/50">{ch.tagline}</p>
                <p className="mt-5 text-xs font-bold tracking-[0.18em] text-glow/80">{ch.ig}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-20">
          <h2 className="display text-4xl sm:text-5xl">SUARA DARI LORONG</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {stories.map((s) => (
              <figure key={s.name} className="border border-white/10 bg-mist p-6">
                <p className="text-sm leading-relaxed text-paper/75">&quot;{s.text}&quot;</p>
                <figcaption className="mt-4 text-xs font-bold uppercase tracking-[0.18em] text-glow/80">
                  {s.name}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 pb-20 pt-6 text-center">
          <p className="display text-5xl leading-none sm:text-6xl">
            SUARA KAMU<span className="text-glow">.</span>
            <br />
            KAMI HANYA BUNYI.
          </p>
          <Link
            href="/register"
            className="press mt-10 inline-block bg-brand px-12 py-4 text-base font-bold uppercase tracking-[0.16em] text-paper shadow-[0_0_32px_rgba(225,29,46,0.5)]"
          >
            Daftar sekarang
          </Link>
        </section>
      </main>
      <FooterC />
    </div>
  );
}

/* ================= D. ZINE PRINT ================= */

function HomeD() {
  const featured = campaigns[0];
  return (
    <div className="dir-d grain relative min-h-screen bg-paper text-ink">
      <NavD />
      <main className="mx-auto max-w-5xl px-5">
        <section className="border-b-2 border-ink py-16 text-center">
          <p className="stamp text-xs text-brand">Edisi pertama</p>
          <h1 className="display mt-6 text-5xl leading-[0.95] sm:text-7xl">
            KENAPA KAMI
            <br />
            BANGUN
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-[15px] leading-relaxed text-ink/70">
            Zine ini ditulis oleh mahasiswa untuk mahasiswa. Kandungan: satu akta yang sudah
            lama tamat tempoh, satu gerakan yang baru bermula, dan seribu alasan untuk tidak
            diam.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4">
            <AukuTicker />
            <CountdownBlock big />
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/register"
              className="press stamp bg-brand px-6 py-2.5 text-sm font-bold text-paper"
            >
              Join kami
            </Link>
            <Link
              href="/chapters/malaysia/campaigns/mansuh-auku"
              className="press stamp border-2 border-ink px-6 py-2.5 text-sm font-bold"
            >
              Baca tuntutan
            </Link>
          </div>
        </section>

        <section className="grid gap-8 py-16 md:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-4">
            <p className="display text-2xl">ISI ZINE INI</p>
            <div className="border-2 border-ink p-4">
              {[
                "01 Kemenangan utama: Mansuh AUKU",
                "02 Dialog dengan KPT: menang",
                "03 Kisah dari kampus: Rumah Mandiri",
                "04 Solidariti: Palestin dan pendidikan",
              ].map((t) => (
                <p key={t} className="border-b border-ink/15 py-2.5 text-sm last:border-0">
                  {t}
                </p>
              ))}
            </div>
            <Placeholder
              ratio="4/3"
              caption="Cover art: stencil ilustrasi pelajar pegang kad merah"
            />
          </div>
          <div>
            <p className="display mb-4 text-2xl">KEMENANGAN UTAMA</p>
            <Link
              href={`/chapters/${featured.chapterSlug}/campaigns/${featured.slug}`}
              className="group block border-2 border-ink bg-cream p-6 transition-transform hover:-translate-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="stamp text-xs text-brand">{featured.status}</span>
                <span className="text-xs text-ink/40">{featured.timeline.length} nota</span>
              </div>
              <p className="display mt-5 text-3xl leading-tight">{featured.title}</p>
              <p className="mt-3 text-sm leading-relaxed text-ink/65">{featured.summary}</p>
              <div className="mt-5 space-y-2">
                {featured.demands.map((d, i) => (
                  <p key={d} className="flex gap-3 text-sm">
                    <span className="font-bold text-brand">{String(i + 1).padStart(2, "0")}</span>
                    {d}
                  </p>
                ))}
              </div>
              <p className="display mt-6 text-xs tracking-widest text-brand underline underline-offset-4">
                TERUSKAN MEMBACA
              </p>
            </Link>
          </div>
        </section>

        <section className="border-t-2 border-ink py-16">
          <p className="display text-2xl">CAWANGAN LIGA</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {chapters.map((ch, i) => (
              <Link
                key={ch.slug}
                href={`/chapters/${ch.slug}`}
                className="press flex items-center justify-between border-2 border-ink bg-paper p-4 transition-transform hover:-translate-y-0.5"
                style={{ rotate: i % 2 === 0 ? "-0.4deg" : "0.4deg" }}
              >
                <span>
                  <p className="display text-lg">{ch.name}</p>
                  <p className="mt-1 text-xs text-ink/50">{ch.tagline}</p>
                </span>
                <span className="text-xs font-bold text-brand">{ch.ig}</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="border-t-2 border-ink py-16">
          <p className="display text-2xl">SURAT PEMBACA</p>
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {stories.map((s) => (
              <div key={s.name} className="border-2 border-ink bg-paper p-5">
                <p className="text-sm leading-relaxed">&quot;{s.text}&quot;</p>
                <p className="mt-4 text-xs font-bold tracking-widest text-brand">
                  TANDATANGAN: {s.name.toUpperCase()}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-y-2 border-ink py-10 text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-ink/50">Dicetak dengan kasih sayang</p>
          <p className="display mt-3 text-3xl">JANGAN TUNGGU ORANG LAIN</p>
          <Link
            href="/register"
            className="press stamp mt-6 inline-block bg-brand px-8 py-3 text-sm font-bold text-paper"
          >
            Daftar sekarang
          </Link>
        </section>
      </main>
      <FooterD />
    </div>
  );
}

/* ================= E. FLAT SIGNAL ================= */

function HomeE() {
  const featured = campaigns[0];
  return (
    <div className="dir-e min-h-screen bg-ink text-paper">
      <NavE />
      <main>
        <section className="mx-auto max-w-7xl px-5 py-20 lg:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-[1.3fr_0.7fr]">
            <div>
              <div className="mb-6 flex items-center gap-3">
                <span className="h-3 w-3 bg-brand" />
                <span className="h-3 w-3 bg-hi" />
                <span className="text-xs font-bold uppercase tracking-[0.25em] text-paper/50">
                  Liga Mahasiswa Malaysia
                </span>
              </div>
              <h1 className="display text-6xl leading-[0.9] sm:text-7xl lg:text-8xl">
                MANSUH
                <br />
                AUKU<span className="text-brand">.</span>
              </h1>
              <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-paper/60">
                55 tahun terlalu lama. Kampus bebas bukan angan-angan, ini kerja. Sertai kami,
                bawa kampus kau, bawa kawan kau.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/register"
                  className="press bg-hi px-8 py-3.5 text-sm font-black text-ink"
                >
                  JOIN
                </Link>
                <Link
                  href="/chapters/malaysia/campaigns/mansuh-auku"
                  className="press border-2 border-paper/30 px-8 py-3.5 text-sm font-black text-paper hover:border-brand hover:text-brand"
                >
                  TUNTUTAN
                </Link>
              </div>
              <div className="mt-10 flex flex-col gap-3">
                <AukuTicker light />
                <CountdownBlock />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Placeholder
                ratio="4/5"
                caption="Photo: pelajar pegang kad merah di depan Parlimen"
                className="border-0"
              />
              <div className="mt-8">
                <Placeholder
                  ratio="4/5"
                  caption="Photo: sorakan di perhimpunan, tangan ke atas"
                  className="border-0"
                />
              </div>
              <div className="col-span-2 bg-brand p-4">
                <p className="display text-xl leading-tight">KAMPUS BEBAS MULAI DARI KAU.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-paper/10 bg-midnight">
          <div className="mx-auto max-w-7xl px-5 py-16">
            <p className="display mb-8 text-3xl">KEMENANGAN UTAMA</p>
            <Link
              href={`/chapters/${featured.chapterSlug}/campaigns/${featured.slug}`}
              className="grid gap-0 md:grid-cols-[1fr_1.2fr]"
            >
              <div className="flex flex-col justify-between bg-brand p-8">
                <span className="text-xs font-black uppercase tracking-[0.2em] text-paper/80">
                  {featured.status}
                </span>
                <p className="display text-4xl leading-none">{featured.title}</p>
                <span className="mt-8 text-xs font-black uppercase tracking-[0.2em]">
                  Baca tuntutan
                </span>
              </div>
              <div className="bg-mist p-8">
                <p className="max-w-lg text-sm leading-relaxed text-paper/70">{featured.summary}</p>
                <div className="mt-6 space-y-3">
                  {featured.demands.map((d, i) => (
                    <p key={d} className="flex gap-3 text-sm text-paper/85">
                      <span className="font-black text-hi">{String(i + 1).padStart(2, "0")}</span>
                      {d}
                    </p>
                  ))}
                </div>
              </div>
            </Link>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-16">
          <p className="display mb-8 text-3xl">CAWANGAN</p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {chapters.map((ch, i) => (
              <Link
                key={ch.slug}
                href={`/chapters/${ch.slug}`}
                className="press group border-2 border-paper/15 p-6 transition-colors hover:border-brand"
              >
                <div className="flex items-start justify-between">
                  <p className="display text-xl text-paper/90 group-hover:text-hi">{ch.name}</p>
                  <span className="text-xs font-black text-paper/30">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <p className="mt-2 text-sm text-paper/50">{ch.tagline}</p>
                <p className="mt-5 text-xs font-black tracking-[0.2em] text-brand">{ch.ig}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-16">
          <p className="display mb-8 text-3xl">KENAPA AKU JOIN</p>
          <div className="grid gap-3 md:grid-cols-3">
            {stories.map((s, i) => (
              <div key={s.name} className={`p-6 ${i === 1 ? "bg-brand" : "bg-mist"}`}>
                <p className="text-sm leading-relaxed">&quot;{s.text}&quot;</p>
                <p className={`mt-4 text-xs font-black uppercase tracking-[0.18em] ${i === 1 ? "text-paper" : "text-hi"}`}>
                  {s.name}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-t border-paper/10 bg-midnight py-6">
          <div className="marquee-track">
            {Array.from({ length: 2 }).map((_, i) => (
              <span key={i} className="display whitespace-nowrap px-5 text-sm tracking-[0.25em] text-paper/60">
                {allies.join("  \u2022  ")}
              </span>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-20 text-center">
          <p className="display text-5xl leading-[0.95] sm:text-6xl">
            TAMATKAN AUKU.
            <span className="block text-brand">START KAMPUS BARU.</span>
          </p>
          <Link
            href="/register"
            className="press mt-10 inline-block bg-hi px-12 py-4 text-base font-black text-ink"
          >
            DAFTAR SEKARANG
          </Link>
        </section>
      </main>
      <FooterE />
    </div>
  );
}

/* ================= PAGE ================= */

const VARIANTS = [<HomeA key="a" />, <HomeB key="b" />, <HomeC key="c" />, <HomeD key="d" />, <HomeE key="e" />];

export default function HomePage() {
  return (
    <Suspense fallback={null}>
      <VariantFrame names={NAMES}>{VARIANTS}</VariantFrame>
    </Suspense>
  );
}
