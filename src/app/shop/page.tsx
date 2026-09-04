import type { Metadata } from "next";
import { Suspense } from "react";
import { Shell } from "@/components/shells";
import {
  PageHead,
  JoinBand,
} from "@/components/sections";
import { CartProvider } from "@/components/interactive";
import { dbGetProducts } from "@/lib/queries";
import { ShopGridClient } from "./shop-grid-client";
import { SkeletonShopGrid } from "@/components/skeleton";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ligamahasiswa.vercel.app";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Merchandise for the movement. All proceeds fund the fight for student rights.",
  openGraph: {
    title: "Shop | Liga Mahasiswa Malaysia",
    description:
      "Merchandise for the movement. All proceeds fund the fight for student rights.",
    url: `${siteUrl}/shop`,
    siteName: "Liga Mahasiswa Malaysia",
    locale: "en_MY",
    type: "website",
  },
  alternates: { canonical: `${siteUrl}/shop` },
};

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
      </CartProvider>
    </Shell>
  );
}
