"use client";

import { useCart } from "@/components/interactive";
import type { Product } from "@/lib/mock";

export function ProductDetailClient({ product }: { product: Product }) {
  const { add, items } = useCart();
  const inCart = items.some((i) => i.slug === product.slug);

  return (
    <button
      type="button"
      onClick={() => add(product)}
      disabled={inCart}
      className="press w-full border border-2 border-ink bg-brand px-5 py-3.5 text-[13px] font-extrabold uppercase tracking-[0.16em] text-white disabled:opacity-50"
    >
      {inCart ? "In cart" : product.preorder ? "Preorder" : "Add to cart"}
    </button>
  );
}
