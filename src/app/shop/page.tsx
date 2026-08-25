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
import { SkeletonShopGrid } from "@/components/skeleton";
import Link from "next/link";

const DIR = 27;

type Catalog = "all" | "member" | "limited";

const CATALOGS: { value: Catalog; label: string }[] = [
  { value: "all", label: "All" },
  { value: "member", label: "Member Exclusive" },
  { value: "limited", label: "Limited Edition" },
];

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

async function ProductGrid({ catalog }: { catalog: Catalog }) {
  const products = await getProducts();
  const filtered =
    catalog === "member"
      ? products.filter((p) => p.memberOnly)
      : catalog === "limited"
        ? products.filter((p) => p.preorder)
        : products;
  return <ShopGridClient products={filtered} />;
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ catalog?: string }>;
}) {
  const params = await searchParams;
  const catalog: Catalog =
    params.catalog === "member"
      ? "member"
      : params.catalog === "limited"
        ? "limited"
        : "all";

  return (
    <Shell dir={DIR}>
      <CartProvider>
        <PageHead
          kicker="Shop"
          title="Shop"
          sub="Merchandise for the movement."
        />
        <section className="border-b border-line">
          <div className="mx-auto w-full max-w-6xl px-4 pt-8 sm:px-6">
            <div className="flex flex-wrap gap-2">
              <Link
                href="/shop"
                className={`press border px-3 py-1.5 text-[12px] font-bold uppercase tracking-[0.1em] transition-colors ${
                  catalog === "all"
                    ? "border-brand bg-brand/10 text-brand"
                    : "border-line text-ink/60 hover:border-ink hover:text-ink"
                }`}
              >
                All
              </Link>
              {CATALOGS.slice(1).map((c) => (
                <Link
                  key={c.value}
                  href={`/shop?catalog=${c.value}`}
                  className={`press border px-3 py-1.5 text-[12px] font-bold uppercase tracking-[0.1em] transition-colors ${
                    catalog === c.value
                      ? "border-brand bg-brand/10 text-brand"
                      : "border-line text-ink/60 hover:border-ink hover:text-ink"
                  }`}
                >
                  {c.label}
                </Link>
              ))}
            </div>
          </div>
        </section>
        <Suspense fallback={<SkeletonShopGrid />}>
          <ProductGrid catalog={catalog} />
        </Suspense>
        <JoinBand />
        <NewsletterBand />
      </CartProvider>
    </Shell>
  );
}
