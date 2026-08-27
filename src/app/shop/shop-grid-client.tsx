"use client";

import { useState, useCallback } from "react";
import { SectionHead, CartDrawerSlot } from "@/components/sections";
import { Reveal, FilterPills, useCart } from "@/components/interactive";
import { useAuth } from "@/components/auth-provider";
import { Marquee } from "@/components/Marquee";
import { ShopCard } from "@/components/sections";

type Product = { slug: string; chapterSlug: string; name: string; price: string; tag: string; memberOnly: boolean; preorder: boolean; deliveryEstimate: string };

type Catalog = "all" | "member" | "limited";
type ShopFilter = "All" | "Member exclusive";

const CATALOGS: { value: Catalog; label: string }[] = [
  { value: "all", label: "All" },
  { value: "member", label: "Member Exclusive" },
  { value: "limited", label: "Limited Edition" },
];

const FILTER_BTN =
  "press border px-3 py-1.5 text-[12px] font-bold uppercase tracking-[0.1em] transition-colors";

function ShopMarquee() {
  return (
    <Marquee
      items={[
        "Mansuh AUKU",
        "Free the campus",
        "All proceeds fund the movement",
        "Members get the best prices",
        "Free shipping over RM50",
        "Every ringgit stays in the fight",
      ]}
      className="border-y border-line bg-brand py-2 text-[13px] font-extrabold uppercase tracking-[0.14em] text-paper"
    />
  );
}

function ShopGrid({ products }: { products: Product[] }) {
  const [catalog, setCatalog] = useState<Catalog>("all");
  const [shopFilter, setShopFilter] = useState<ShopFilter>("All");
  const { add } = useCart();
  const { user } = useAuth();
  const isMember = ["member", "committee", "national", "admin"].includes(user?.role ?? "");

  const byCatalog =
    catalog === "member"
      ? products.filter((p) => p.memberOnly)
      : catalog === "limited"
        ? products.filter((p) => p.preorder)
        : products;

  const items = shopFilter === "All" ? byCatalog : byCatalog.filter((p) => p.memberOnly);

  const updateUrl = useCallback((cat: string) => {
    const url = cat === "all" ? "/shop" : `/shop?catalog=${cat}`;
    window.history.replaceState(null, "", url);
  }, []);

  return (
    <section className="border-b border-line">
      <div className="mx-auto w-full max-w-6xl px-4 pt-8 sm:px-6">
        <div className="flex flex-wrap gap-2">
          {CATALOGS.map((c) => (
            <button
              key={c.value}
              onClick={() => { setCatalog(c.value); updateUrl(c.value); }}
              className={`${FILTER_BTN} ${catalog === c.value ? "border-brand bg-brand/10 text-brand" : "border-line text-ink/60 hover:border-ink hover:text-ink"}`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <Reveal>
          <SectionHead
            index={1}
            title="The catalog"
            sub="Public items and member exclusives, one mission."
          />
        </Reveal>
        <Reveal className="mb-8">
          <FilterPills options={["All", "Member exclusive"]} value={shopFilter} onChange={setShopFilter} label="Filter" />
        </Reveal>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p, i) => (
            <Reveal key={p.slug} delay={i * 60}>
              <ShopCard p={p} onAdd={() => add(p)} isMember={isMember} />
            </Reveal>
          ))}
        </div>
        {items.length === 0 ? (
          <p className="text-center text-[14px] text-ink/50">No products available yet.</p>
        ) : null}
      </div>
    </section>
  );
}

export function ShopGridClient({ products }: { products: Product[] }) {
  return (
    <>
      <ShopMarquee />
      <ShopGrid products={products} />
      <CartDrawerSlot />
    </>
  );
}
