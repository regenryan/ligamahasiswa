"use client";

import { useState } from "react";
import { SectionHead, CartDrawerSlot } from "@/components/sections";
import { Reveal, FilterPills, useCart } from "@/components/interactive";
import { useAuth } from "@/components/auth-provider";
import { Marquee } from "@/components/Marquee";
import { ShopCard } from "@/components/sections";
import type { Product } from "@/lib/mock";

type ShopFilter = "All" | "Member exclusive";
const FILTERS: ShopFilter[] = ["All", "Member exclusive"];

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
  const [filter, setFilter] = useState<ShopFilter>("All");
  const { add } = useCart();
  const { user } = useAuth();
  const isMember = ["member", "committee", "national", "admin"].includes(user?.role ?? "");
  const items = filter === "All" ? products : products.filter((p) => p.memberOnly);
  return (
    <section className="border-b border-line">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <Reveal>
          <SectionHead
            index={1}
            title="The catalog"
            sub="Public items and member exclusives, one mission."
          />
        </Reveal>
        <Reveal className="mb-8">
          <FilterPills options={FILTERS} value={filter} onChange={setFilter} label="Filter" />
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
