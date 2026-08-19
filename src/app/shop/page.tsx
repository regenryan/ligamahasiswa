"use client";

import Link from "next/link";
import { Suspense } from "react";
import { VariantFrame } from "@/components/VariantFrame";
import { NavA, FooterA, NavB, FooterB, NavC, FooterC, NavD, FooterD, NavE, FooterE } from "@/components/shells";
import { Placeholder } from "@/components/Placeholder";
import { products } from "@/lib/mock";

const NAMES = ["A Kad Merah", "B Skuad Kampus", "C Midnight Demo", "D Zine Print", "E Flat Signal"];

function ProductCard({ name, price, memberOnly, tone }: { name: string; price: string; memberOnly: boolean; tone: "a" | "b" | "c" | "d" | "e" }) {
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
  const priceStyle = tone === "c" ? "display text-glow" : tone === "e" ? "display text-brand" : "font-black text-brand";
  return (
    <article className={`${frame} flex flex-col overflow-hidden`}>
      <div className="relative">
        <Placeholder
          ratio="4/5"
          caption={`Product photo: ${name}, produk Liga. Flat lay atau studio shot`}
          className={tone === "b" ? "rounded-none border-0" : "border-0"}
        />
        {memberOnly && (
          <span
            className={`absolute left-3 top-3 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] ${
              tone === "c" ? "bg-brand text-paper" : "bg-hi text-ink"
            }`}
          >
            Ahli sahaja
          </span>
        )}
      </div>
      <div className={`flex flex-1 flex-col ${tone === "b" ? "p-5" : "p-4"}`}>
        <div className="flex items-start justify-between gap-3">
          <p className="text-sm font-bold leading-snug">{name}</p>
          <p className={`shrink-0 text-sm ${priceStyle}`}>{price}</p>
        </div>
        <div className="mt-4 flex-1" />
        <Link
          href="/shop/tees"
          className={`press mt-4 text-center text-xs font-black uppercase tracking-[0.16em] ${
            tone === "c"
              ? "bg-brand px-4 py-2.5 text-paper"
              : tone === "e"
                ? "bg-hi px-4 py-2.5 text-ink"
                : "border-2 border-ink px-4 py-2.5 hover:bg-ink hover:text-paper"
          }`}
        >
          {memberOnly ? "Daftar untuk unlock" : "Order / Preorder"}
        </Link>
      </div>
    </article>
  );
}

function ShopHeader({ tone }: { tone: "a" | "b" | "c" | "d" | "e" }) {
  const title =
    tone === "a"
      ? "KEDAI LIGA"
      : tone === "b"
        ? "Kedai kami"
        : tone === "c"
          ? "KEDAI LIGA"
          : tone === "d"
            ? "KEDAI LIGA"
            : "KEDAI LIGA";
  const sub =
    "Hasil jualan terus ke kewangan Liga. Baju, sticker, zine, dan merchandise yang perjuangan boleh pakai.";
  return (
    <div className="flex flex-wrap items-end justify-between gap-6">
      <div>
        <h1 className="display text-5xl sm:text-6xl">{title}</h1>
        <p className={`mt-4 max-w-md text-sm leading-relaxed ${tone === "c" ? "text-paper/60" : "text-ink/60"}`}>{sub}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {["Semua", "Baju", "Sticker", "Zine", "Aksesori"].map((f) => (
          <button
            key={f}
            type="button"
            className={`press border-2 px-3 py-1.5 text-xs font-bold uppercase tracking-widest ${
              f === "Semua"
                ? tone === "c"
                  ? "border-brand bg-brand text-paper"
                  : tone === "e"
                    ? "border-hi bg-hi text-ink"
                    : "border-ink bg-ink text-paper"
                : tone === "c"
                  ? "border-paper/20 text-paper/60 hover:border-glow hover:text-glow"
                  : tone === "e"
                    ? "border-paper/25 text-paper/60 hover:border-brand hover:text-brand"
                    : "border-ink text-ink/60 hover:bg-ink hover:text-paper"
            }`}
          >
            {f}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ================= A ================= */

function ShopA() {
  return (
    <div className="dir-a min-h-screen bg-paper text-ink">
      <NavA />
      <main className="mx-auto max-w-7xl px-5 py-16">
        <ShopHeader tone="a" />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <ProductCard key={p.name} name={p.name} price={p.price} memberOnly={p.memberOnly} tone="a" />
          ))}
        </div>
        <div className="mt-16 border-2 border-ink bg-cream p-6 text-sm leading-relaxed text-ink/70">
          <p className="font-black uppercase tracking-widest text-brand">Cara bayar</p>
          <p className="mt-2 max-w-2xl">
            Pembayaran melalui payment gateway yang sokong DuitNow, TnG eWallet dan FPX. Order dan
            preorder diproses oleh pihak Liga; penghantaran mengikut jadual batch. (Mockup - sistem
            bayaran masuk fasa lepas design.)
          </p>
        </div>
      </main>
      <FooterA />
    </div>
  );
}

/* ================= B ================= */

function ShopB() {
  return (
    <div className="dir-b min-h-screen bg-cream text-ink">
      <NavB />
      <main className="mx-auto max-w-6xl px-4 py-14">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <h1 className="font-baloo text-4xl font-bold sm:text-5xl">Kedai kami</h1>
            <p className="mt-3 max-w-md text-[15px] leading-relaxed text-ink/65">
              Hasil jualan terus ke kewangan Liga. Baju, sticker, zine, dan merchandise yang
              perjuangan boleh pakai.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {["Semua", "Baju", "Sticker", "Zine"].map((f) => (
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
          {products.map((p) => (
            <ProductCard key={p.name} name={p.name} price={p.price} memberOnly={p.memberOnly} tone="b" />
          ))}
        </div>
        <div className="mt-14 rounded-3xl bg-paper p-6 text-sm leading-relaxed text-ink/65 shadow-[0_2px_12px_rgba(17,17,17,0.06)]">
          <p className="font-bold uppercase tracking-widest text-brand">Cara bayar</p>
          <p className="mt-2 max-w-2xl">
            Pembayaran melalui payment gateway yang sokong DuitNow, TnG eWallet dan FPX. Order dan
            preorder diproses oleh pihak Liga. (Mockup - sistem bayaran masuk fasa lepas design.)
          </p>
        </div>
      </main>
      <FooterB />
    </div>
  );
}

/* ================= C ================= */

function ShopC() {
  return (
    <div className="dir-c min-h-screen bg-midnight text-paper">
      <NavC />
      <main className="mx-auto max-w-7xl px-5 py-16">
        <ShopHeader tone="c" />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <ProductCard key={p.name} name={p.name} price={p.price} memberOnly={p.memberOnly} tone="c" />
          ))}
        </div>
        <div className="mt-16 border border-white/10 bg-mist p-6 text-sm leading-relaxed text-paper/60">
          <p className="font-bold uppercase tracking-[0.2em] text-glow">Cara bayar</p>
          <p className="mt-2 max-w-2xl">
            Pembayaran melalui payment gateway yang sokong DuitNow, TnG eWallet dan FPX. Order dan
            preorder diproses oleh pihak Liga. (Mockup - sistem bayaran masuk fasa lepas design.)
          </p>
        </div>
      </main>
      <FooterC />
    </div>
  );
}

/* ================= D ================= */

function ShopD() {
  return (
    <div className="dir-d grain relative min-h-screen bg-paper text-ink">
      <NavD />
      <main className="mx-auto max-w-5xl px-5 py-16">
        <p className="stamp text-xs text-brand">Katalog riso</p>
        <h1 className="display mt-5 text-4xl sm:text-5xl">KEDAI LIGA</h1>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-ink/65">
          Hasil jualan terus ke kewangan Liga. Baju, sticker, zine, dan merchandise yang
          perjuangan boleh pakai.
        </p>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <ProductCard key={p.name} name={p.name} price={p.price} memberOnly={p.memberOnly} tone="d" />
          ))}
        </div>
        <div className="mt-14 border-2 border-ink bg-cream p-6 text-sm leading-relaxed text-ink/65">
          <p className="font-black uppercase tracking-widest text-brand">Cara bayar</p>
          <p className="mt-2 max-w-2xl">
            Pembayaran melalui payment gateway yang sokong DuitNow, TnG eWallet dan FPX. Order dan
            preorder diproses oleh pihak Liga. (Mockup - sistem bayaran masuk fasa lepas design.)
          </p>
        </div>
      </main>
      <FooterD />
    </div>
  );
}

/* ================= E ================= */

function ShopE() {
  return (
    <div className="dir-e min-h-screen bg-ink text-paper">
      <NavE />
      <main className="mx-auto max-w-7xl px-5 py-16">
        <ShopHeader tone="e" />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <ProductCard key={p.name} name={p.name} price={p.price} memberOnly={p.memberOnly} tone="e" />
          ))}
        </div>
        <div className="mt-16 border-2 border-paper/15 bg-mist p-6 text-sm leading-relaxed text-paper/60">
          <p className="font-black uppercase tracking-[0.2em] text-brand">Cara bayar</p>
          <p className="mt-2 max-w-2xl">
            Pembayaran melalui payment gateway yang sokong DuitNow, TnG eWallet dan FPX. Order dan
            preorder diproses oleh pihak Liga. (Mockup - sistem bayaran masuk fasa lepas design.)
          </p>
        </div>
      </main>
      <FooterE />
    </div>
  );
}

/* ================= PAGE ================= */

export default function ShopPage() {
  const variants = [
    <ShopA key="a" />,
    <ShopB key="b" />,
    <ShopC key="c" />,
    <ShopD key="d" />,
    <ShopE key="e" />,
  ];
  return (
    <Suspense fallback={null}>
      <VariantFrame names={NAMES}>{variants}</VariantFrame>
    </Suspense>
  );
}
