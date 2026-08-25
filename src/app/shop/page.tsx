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
    <Shell dir={DIR}>
      <CartProvider>
        <PageHead
          kicker="Shop"
          title="Shop"
          sub="Merchandise for the movement."
        />
        <Suspense fallback={<SkeletonShopGrid />}>
          <ShopGridClient products={products} />
        </Suspense>
        <JoinBand />
        <NewsletterBand />
      </CartProvider>
    </Shell>
  );
}
