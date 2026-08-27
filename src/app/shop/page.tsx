import { Suspense } from "react";
import { Shell } from "@/components/shells";
import {
  PageHead,
  JoinBand,
  NewsletterBand,
} from "@/components/sections";
import { CartProvider } from "@/components/interactive";
import { dbGetProducts } from "@/lib/queries";
import { ShopGridClient } from "./shop-grid-client";
import { SkeletonShopGrid } from "@/components/skeleton";

type ShopProduct = {
  slug: string;
  chapterSlug: string;
  name: string;
  price: string;
  tag: string;
  memberOnly: boolean;
  preorder: boolean;
  deliveryEstimate: string;
};

const DIR = 27;

async function getProducts(): Promise<ShopProduct[]> {
  try {
    const rows = await dbGetProducts();
    return rows.map((r) => ({
      slug: r.slug,
      chapterSlug: r.chapterSlug,
      name: r.name,
      price: r.price,
      tag: r.type,
      memberOnly: false,
      preorder: false,
      deliveryEstimate: "",
    }));
  } catch {
    return [];
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
