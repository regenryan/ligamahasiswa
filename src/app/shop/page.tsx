import { Suspense } from "react";
import { Shell } from "@/components/shells";
import {
  PageHead,
  JoinBand,
  NewsletterBand,
} from "@/components/sections";
import { CartProvider } from "@/components/interactive";
import { readSheet } from "@/lib/sheets-db";
import { products as mockProducts } from "@/lib/mock";
import type { Product } from "@/lib/mock";
import { ShopGridClient } from "./shop-grid-client";

const DIR = 27;

async function getProducts(): Promise<Product[]> {
  try {
    const rows = await readSheet("Products");
    if (rows.length === 0) return mockProducts;
    return rows
      .filter((r) => r.status !== "archived")
      .map((r) => ({
        slug: r.slug ?? "",
        chapterSlug: r.chapter_slug ?? "",
        name: r.name ?? "",
        price: r.price ?? "",
        tag: r.tag ?? "",
        memberOnly: r.member_only === "true",
        preorder: r.preorder === "true",
        deliveryEstimate: r.delivery_estimate ?? "",
      }));
  } catch {
    return mockProducts;
  }
}

export default async function ShopPage() {
  const products = await getProducts();

  return (
    <Suspense fallback={null}>
      <Shell dir={DIR}>
        <CartProvider>
          <PageHead
            kicker="Shop"
            title="Wear the movement"
            sub="Every ringgit funds campaigns, prints, and the next assembly. Members get the best prices."
          />
          <ShopGridClient products={products} />
          <section className="border-b border-line">
            <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
              <div className="flex flex-wrap items-center justify-between gap-6 border border-line bg-cream p-8">
                <div className="max-w-xl">
                  <p className="display text-2xl sm:text-3xl">Members pay less</p>
                  <p className="mt-3 text-[14px] leading-relaxed text-ink/70">
                    The member card is free and issued instantly. It unlocks member prices on the
                    hoodie and lanyard, first dibs on every drop, and free shipping over RM50.
                  </p>
                </div>
                <a href="/dashboard/card" className="press inline-flex border border-2 border-ink bg-brand px-5 py-3 text-[13px] font-extrabold uppercase tracking-[0.12em] text-white hover:opacity-90 transition-opacity">
                  Get your member card
                </a>
              </div>
            </div>
          </section>
          <JoinBand />
          <NewsletterBand />
        </CartProvider>
      </Shell>
    </Suspense>
  );
}
