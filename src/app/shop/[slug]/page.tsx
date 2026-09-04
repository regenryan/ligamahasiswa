import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Shell } from "@/components/shells";
import { PageHead } from "@/components/sections";
import { CartProvider } from "@/components/interactive";
import { dbGetProductBySlug } from "@/lib/queries";
import { ProductDetailClient } from "./product-detail-client";
import { SkeletonDetail } from "@/components/skeleton";
import { generateSafeHTML } from "@/lib/tiptap";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ligamahasiswa.vercel.app";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const r = await dbGetProductBySlug(slug);
  return {
    title: r ? r.name : "Product",
    description: r ? `Buy the ${r.name} from the Liga Mahasiswa shop.` : "A product from the Liga Mahasiswa shop.",
    openGraph: {
      title: r ? `${r.name} | Liga Mahasiswa Shop` : "Product | Liga Mahasiswa Shop",
      description: r ? `Buy the ${r.name} from the Liga Mahasiswa shop.` : "A product from the Liga Mahasiswa shop.",
      url: `${siteUrl}/shop/${slug}`,
      images: r?.image ? [{ url: r.image }] : undefined,
      siteName: "Liga Mahasiswa Malaysia",
      locale: "en_MY",
      type: "website",
    },
    alternates: { canonical: `${siteUrl}/shop/${slug}` },
  };
}

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

async function getProduct(slug: string): Promise<ShopProduct | null> {
  try {
    const r = await dbGetProductBySlug(slug);
    if (r) {
      return {
        slug: r.slug,
        chapterSlug: r.chapterSlug,
        name: r.name,
        price: r.price,
        tag: r.type,
        memberOnly: false,
        preorder: false,
        deliveryEstimate: "",
      };
    }
  } catch {
    // fall through
  }
  return null;
}

async function ProductContent({ slug }: { slug: string }) {
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  return (
    <>
      <PageHead kicker="Shop" title={product.name} sub={product.tag} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.name,
            description: product.tag,
            offers: {
              "@type": "Offer",
              price: product.price.replace("RM", "").trim(),
              priceCurrency: "MYR",
              availability: "https://schema.org/InStock",
            },
            url: `${siteUrl}/shop/${slug}`,
          }),
        }}
      />
      <CartProvider>
      <section className="border-b border-line">
        <div className="mx-auto grid w-full max-w-4xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_1fr]">
          <div className="flex aspect-square items-center justify-center border border-line bg-midnight">
            <span className="mono text-[11px] uppercase tracking-[0.16em] text-ink/30">{product.tag}</span>
          </div>
          <div>
            <Link href="/shop" className="mono text-[11px] uppercase tracking-[0.14em] text-ink/50 hover:text-brand transition-colors">
              {"\u2190"} Back to shop
            </Link>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="mono text-[11px] uppercase tracking-[0.16em] text-ink/50">{product.tag}</span>
              {product.preorder ? (
                <span className="border border-hi/40 bg-hi/10 px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-[0.12em] text-hi">Preorder</span>
              ) : null}
              {product.memberOnly ? (
                <span className="border border-term/40 bg-term/10 px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-[0.12em] text-term">Members only</span>
              ) : null}
            </div>
            <h1 className="mt-4 display text-3xl">{product.name}</h1>
            <p className="mt-3 display text-4xl">{product.price}</p>
            {product.preorder && product.deliveryEstimate ? (
              <p className="mono mt-2 text-[12px] text-hi">Estimated delivery: {product.deliveryEstimate}</p>
            ) : null}
            <p className="mono mt-1 text-[11px] uppercase tracking-[0.14em] text-ink/40">{product.memberOnly ? "Members get a better price" : "Open to all"}</p>
            <div className="mt-8">
              <ProductDetailClient product={product} />
            </div>
          </div>
        </div>
      </section>
    </CartProvider>
    </>
  );
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <Shell dir={DIR}>
      <Suspense fallback={<SkeletonDetail />}>
        <ProductContent slug={slug} />
      </Suspense>
    </Shell>
  );
}
