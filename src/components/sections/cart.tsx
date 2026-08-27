"use client";

import Link from "next/link";
import { Btn } from "@/components/sections/head";
import { useCart } from "@/components/interactive";

type Product = { slug: string; name: string; price: string; tag: string; memberOnly: boolean; preorder: boolean; deliveryEstimate: string };

export function AddToCart({ product }: { product: Product }) {
  const { add } = useCart();
  return (
    <Btn kind={product.memberOnly ? "ghost" : "join"} className="w-full" onClick={() => add(product)}>
      {product.memberOnly ? "Unlock as member" : "Add to cart"}
    </Btn>
  );
}

export function CartDrawerSlot() {
  const { items, open, setOpen, remove } = useCart();
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open cart"
        className="press fixed bottom-24 right-4 z-50 flex h-12 w-12 items-center justify-center border border-line bg-cream text-ink shadow-lg"
      >
        <span className="text-base">{"\uD83D\uDED2"}</span>
        {items.length > 0 ? (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center bg-brand text-[11px] font-bold text-paper">
            {items.length}
          </span>
        ) : null}
      </button>
      {open ? (
        <div className="fixed inset-0 z-[60]">
          <button type="button" className="absolute inset-0 bg-midnight/70" onClick={() => setOpen(false)} aria-label="Close cart" />
          <aside
            role="dialog"
            aria-modal="true"
            aria-label="Cart"
            className="absolute right-0 top-0 flex h-full w-full max-w-sm flex-col border-l border-line bg-paper"
          >
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <p className="display text-xl">Your cart</p>
              <button type="button" onClick={() => setOpen(false)} className="press px-2 py-1 text-[13px] font-bold uppercase tracking-[0.1em] text-ink/60 hover:text-ink">
                Close
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {items.length === 0 ? (
                <p className="text-[14px] text-ink/60">Your cart is empty. The movement funds itself.</p>
              ) : (
                <ul className="space-y-4">
                  {items.map((p) => (
                    <li key={p.slug} className="flex items-center gap-4 border border-line bg-cream p-3">
                      <div className="halftone flex h-14 w-14 shrink-0 items-center justify-center border border-line bg-midnight">
                        <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-fog/50">{p.tag}</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-[14px] font-bold">{p.name}</p>
                        <p className="mono text-[12px] text-ink/60">{p.price}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => remove(p.slug)}
                        className="press px-2 py-1 text-[12px] font-bold uppercase tracking-[0.08em] text-ink/50 hover:text-brand"
                        aria-label={`Remove ${p.name}`}
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="border-t border-line px-5 py-4">
              <div className="mb-4 flex items-center justify-between text-[14px]">
                <span className="text-ink/60">Total</span>
                <span className="font-bold">
                  {items.reduce((sum, p) => sum + Number(p.price.replace("RM", "")), 0)} RM
                </span>
              </div>
              <Link
                href="/shop/checkout"
                onClick={() => setOpen(false)}
                className="press block w-full border border-2 border-ink bg-brand px-5 py-3.5 text-center text-[13px] font-extrabold uppercase tracking-[0.16em] text-paper"
              >
                Checkout
              </Link>
              <p className="mono mt-3 text-center text-[11px] uppercase tracking-[0.14em] text-ink/40">
                All proceeds fund the movement
              </p>
            </div>
          </aside>
        </div>
      ) : null}
    </>
  );
}
