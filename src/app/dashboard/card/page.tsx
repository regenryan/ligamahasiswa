"use client";

import { Suspense } from "react";
import { VariantFrame } from "@/components/VariantFrame";
import { NavA, FooterA, NavB, FooterB, NavC, FooterC, NavD, FooterD, NavE, FooterE } from "@/components/shells";

const NAMES = ["A Kad Merah", "B Skuad Kampus", "C Midnight Demo", "D Zine Print", "E Flat Signal"];

const MEMBER = {
  name: "Adam Raiyan",
  id: "LMMA-2026-0017",
  chapter: "Malaysia",
  exp: "11.2026",
};

function MemberCardFront({ tone }: { tone: "a" | "b" | "c" | "d" | "e" }) {
  const frame =
    tone === "a"
      ? "border-2 border-ink bg-cream"
      : tone === "b"
        ? "rounded-3xl bg-hi"
        : tone === "c"
          ? "border border-white/10 bg-gradient-to-br from-mist to-[#131313]"
          : tone === "d"
            ? "border-2 border-ink bg-cream"
            : "border-2 border-paper/20 bg-mist";
  const dark = tone === "c" || tone === "e";
  const text = dark ? "text-paper" : "text-ink";
  const sub = dark ? "text-paper/50" : "text-ink/50";
  return (
    <div className={`relative aspect-[1.586/1] w-full overflow-hidden ${frame} p-5`}>
      {tone === "a" && <div className="halftone absolute inset-0 opacity-[0.06]" aria-hidden="true" />}
      {tone === "d" && <div className="grain absolute inset-0 opacity-[0.05]" aria-hidden="true" />}
      <div className="relative flex h-full flex-col justify-between">
        <div className="flex items-start justify-between">
          <div>
            <p className={`display text-lg leading-none ${dark ? "text-glow" : "text-brand"}`}>LIGA</p>
            <p className={`display text-[11px] tracking-[0.3em] ${sub}`}>MAHASISWA MALAYSIA</p>
          </div>
          <div className="flex h-9 w-9 items-center justify-center border-2 border-current text-xs font-black">
            LM
          </div>
        </div>
        <div className={`flex items-end justify-between gap-3 ${text}`}>
          <div className="flex items-center gap-3">
            <div className={`relative h-14 w-14 overflow-hidden ${dark ? "border-paper/30" : "border-ink/30"} border`}>
              <div aria-hidden="true" className={`halftone absolute inset-0 opacity-40 ${dark ? "halftone-light" : ""}`} />
            </div>
            <div>
              <p className="font-black leading-tight">{MEMBER.name}</p>
              <p className={`text-[11px] font-bold uppercase tracking-[0.2em] ${sub}`}>
                {MEMBER.chapter} - {MEMBER.id}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className={`text-[11px] uppercase tracking-[0.2em] ${sub}`}>Valid until</p>
            <p className="font-black">{MEMBER.exp}</p>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <p className={`text-[11px] uppercase tracking-[0.2em] ${sub}`}>Ahli diperakui oleh jawatankuasa</p>
          <div className="h-8 w-8 rotate-45 border-2 border-dashed border-current opacity-60" />
        </div>
      </div>
    </div>
  );
}

function DashboardNav({ tone }: { tone: "a" | "b" | "c" | "d" | "e" }) {
  const links = ["Dashboard", "Kad ahli", "Pesanan", "RSVP", "Suka zine"];
  const active = "Kad ahli";
  const cls =
    tone === "c"
      ? "border border-paper/15 px-3 py-1.5 text-xs font-bold uppercase tracking-widest"
      : "border-2 border-ink px-3 py-1.5 text-xs font-bold uppercase tracking-widest";
  const on = tone === "c" ? "border-brand bg-brand text-paper" : "bg-ink text-paper";
  const off = tone === "c" ? "text-paper/50 hover:border-glow hover:text-glow" : "text-ink/60 hover:bg-ink hover:text-paper";
  return (
    <div className="flex flex-wrap gap-2">
      {links.map((l) => (
        <button key={l} type="button" className={`press ${cls} ${l === active ? on : off}`}>
          {l}
        </button>
      ))}
    </div>
  );
}

function CardView({ tone }: { tone: "a" | "b" | "c" | "d" | "e" }) {
  const dark = tone === "c" || tone === "e";
  const pageBg = tone === "a" ? "bg-paper" : tone === "b" ? "bg-cream" : tone === "c" ? "bg-midnight" : tone === "d" ? "bg-paper grain relative" : "bg-ink";
  const text = dark ? "text-paper" : "text-ink";
  const sub = dark ? "text-paper/50" : "text-ink/50";
  const perks = [
    "Beli barang member-only di Kedai Liga",
    "Pesanan dan history order terus dalam dashboard",
    "Kemasukan event tertutup dan RSVP awal",
    "Undi dalam Pilihan Raya Kampus",
  ];
  const solidBtn =
    tone === "a"
      ? "press display bg-brand px-6 py-3 text-sm tracking-widest text-paper"
      : tone === "b"
        ? "press rounded-full bg-ink px-6 py-3 text-sm font-bold text-paper"
        : tone === "c"
          ? "press bg-brand px-7 py-3 text-sm font-bold uppercase tracking-[0.16em] text-paper"
          : tone === "d"
            ? "press stamp bg-brand px-6 py-2.5 text-sm font-bold text-paper"
            : "press bg-hi px-7 py-3.5 text-sm font-black text-ink";
  const ghostBtn =
    tone === "a"
      ? "press display border-2 border-ink px-6 py-3 text-sm tracking-widest hover:bg-ink hover:text-paper"
      : tone === "b"
        ? "press rounded-full border-2 border-ink/15 bg-paper px-6 py-3 text-sm font-bold"
        : tone === "c"
          ? "press border border-paper/25 px-7 py-3 text-sm font-bold uppercase tracking-[0.16em] text-paper hover:border-glow hover:text-glow"
          : tone === "d"
            ? "press stamp border-2 border-ink px-6 py-2.5 text-sm font-bold"
            : "press border-2 border-paper/30 px-7 py-3.5 text-sm font-black uppercase tracking-[0.16em] hover:border-brand hover:text-brand";
  const box = dark ? "border border-white/10 bg-mist" : "border-2 border-ink bg-cream";
  return (
    <div className={`dir-${tone} ${pageBg} ${text} min-h-screen`}>
      {tone === "a" && <NavA />}
      {tone === "b" && <NavB />}
      {tone === "c" && <NavC />}
      {tone === "d" && <NavD />}
      {tone === "e" && <NavE />}
      <main className="mx-auto max-w-7xl px-5 py-14">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className={`text-xs font-bold uppercase tracking-[0.25em] ${dark ? "text-glow" : "text-brand"}`}>
              Dashboard - Kad ahli
            </p>
            <h1 className="display mt-4 text-4xl sm:text-5xl">KAD AHLI DIGITAL</h1>
          </div>
          <DashboardNav tone={tone} />
        </div>
        <div className="mt-12 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div className="space-y-6">
            <MemberCardFront tone={tone} />
            <div className="flex flex-wrap gap-3">
              <button type="button" className={solidBtn}>
                Simpan ke Apple / Google Wallet
              </button>
              <button type="button" className={ghostBtn}>
                Muat turun PDF kad
              </button>
            </div>
          </div>
          <div className="space-y-6">
            <div className={box}>
              <p className={`text-xs font-bold uppercase tracking-[0.2em] ${dark ? "text-glow" : "text-brand"}`}>
                Apa kad ni bagi?
              </p>
              <ul className="mt-4 space-y-3">
                {perks.map((p) => (
                  <li key={p} className="flex gap-3 text-sm leading-relaxed">
                    <span className={`font-black ${dark ? "text-glow" : "text-brand"}`}>+</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className={box}>
              <p className={`text-xs font-bold uppercase tracking-[0.2em] ${dark ? "text-glow" : "text-brand"}`}>
                Pasal kad ni
              </p>
              <p className={`mt-3 text-sm leading-relaxed ${sub}`}>
                Kad digital dikeluarkan selepas keahlian disahkan oleh jawatankuasa chapter.
                Satu ID, satu ahli. Jangan kongsi kad dengan orang lain - nanti kawan kau
                kena tahan di pintu masuk event.
              </p>
            </div>
          </div>
        </div>
      </main>
      {tone === "a" && <FooterA />}
      {tone === "b" && <FooterB />}
      {tone === "c" && <FooterC />}
      {tone === "d" && <FooterD />}
      {tone === "e" && <FooterE />}
    </div>
  );
}

export default function CardPage() {
  const variants = [
    <CardView key="a" tone="a" />,
    <CardView key="b" tone="b" />,
    <CardView key="c" tone="c" />,
    <CardView key="d" tone="d" />,
    <CardView key="e" tone="e" />,
  ];
  return (
    <Suspense fallback={null}>
      <VariantFrame names={NAMES}>{variants}</VariantFrame>
    </Suspense>
  );
}
