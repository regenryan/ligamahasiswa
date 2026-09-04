"use client";

import { Suspense, useState } from "react";
import { Shell } from "@/components/shells";
import { PageHead, Btn } from "@/components/sections";
import { CartProvider, useCart } from "@/components/interactive";
import { SkeletonGrid } from "@/components/skeleton";

const DIR = 27;

function CheckoutInner() {
  const { items, clear } = useCart();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const total = items.reduce(
    (sum, p) => sum + Number(p.price.replace("RM", "")),
    0,
  );

  const handleSubmit = async () => {
    if (!name.trim()) { setError("Enter your name."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError("Enter a valid email."); return; }
    setError(null);
    setSending(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          paymentMethod: "toyyibpay",
          buyerName: name,
          buyerEmail: email,
          buyerPhone: phone,
          buyerAddress: address,
        }),
      });
      const data = await res.json();
      setSending(false);

      if (data.ok && data.url) {
        clear();
        window.location.href = data.url;
      } else if (data.error) {
        setError(data.error);
      } else {
        setError("Could not start payment. Try again.");
      }
    } catch {
      setSending(false);
      setError("Network error. Check your connection and try again.");
    }
  };

  if (items.length === 0) {
    return (
      <Shell dir={DIR}>
        <PageHead kicker="Shop" title="Checkout" />
        <section className="border-b border-line">
          <div className="mx-auto w-full max-w-2xl px-4 py-16 text-center sm:px-6">
            <p className="text-[15px] text-ink/60">Your cart is empty.</p>
            <div className="mt-6">
              <Btn kind="act" href="/shop">Back to shop</Btn>
            </div>
          </div>
        </section>
      </Shell>
    );
  }

  return (
    <Shell dir={DIR}>
      <PageHead kicker="Shop" title="Checkout" sub="Review your order and complete payment." />
      <section className="border-b border-line">
        <div className="mx-auto grid w-full max-w-4xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <h2 className="display mb-6 text-2xl">Order summary</h2>
            <ul className="space-y-3">
              {items.map((p) => (
                <li key={p.slug} className="flex items-center justify-between border border-line bg-cream px-4 py-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-[14px] font-bold">{p.name}</p>
                      {p.preorder ? (
                        <span className="border border-hi/40 bg-hi/10 px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-[0.12em] text-hi">Preorder</span>
                      ) : null}
                    </div>
                    <p className="mono text-[12px] text-ink/50">{p.tag}</p>
                    {p.preorder && p.deliveryEstimate ? (
                      <p className="mono text-[11px] text-hi/70">Est. delivery: {p.deliveryEstimate}</p>
                    ) : null}
                  </div>
                  <span className="mono text-[14px] font-bold">{p.price}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
              <span className="mono text-[13px] uppercase tracking-[0.12em] text-ink/50">Total</span>
              <span className="display text-2xl">{total} RM</span>
            </div>
          </div>

          <div>
            <h2 className="display mb-6 text-2xl">Your details</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="co-name" className="mb-1.5 block text-[13px] font-bold">Name</label>
                <input id="co-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" className="w-full border border-line bg-midnight px-4 py-3 text-[14px] placeholder:text-ink/40 focus:outline-none" />
              </div>
              <div>
                <label htmlFor="co-email" className="mb-1.5 block text-[13px] font-bold">Email</label>
                <input id="co-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@campus.edu.my" className="w-full border border-line bg-midnight px-4 py-3 text-[14px] placeholder:text-ink/40 focus:outline-none" />
              </div>
              <div>
                <label htmlFor="co-phone" className="mb-1.5 block text-[13px] font-bold">Phone (optional)</label>
                <input id="co-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="012-345 6789" className="w-full border border-line bg-midnight px-4 py-3 text-[14px] placeholder:text-ink/40 focus:outline-none" />
              </div>
              <div>
                <label htmlFor="co-address" className="mb-1.5 block text-[13px] font-bold">Shipping address</label>
                <textarea id="co-address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Full address for shipping" rows={3} className="w-full border border-line bg-midnight px-4 py-3 text-[14px] placeholder:text-ink/40 focus:outline-none resize-none" />
              </div>
            </div>

            {error && <p role="alert" className="mono mt-4 text-[12px] text-brand-text">{error}</p>}

            <div className="mt-6 space-y-3">
              <p className="mono text-[11px] uppercase tracking-[0.16em] text-ink/50">Payment</p>
              <div className="border border-line bg-cream px-4 py-3">
                <p className="text-[14px] font-bold">ToyyibPay</p>
                <p className="mono text-[12px] text-ink/50">FPX, credit/debit cards, e-wallets</p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={sending}
              className="press mt-6 w-full border border-2 border-ink bg-brand px-5 py-3.5 text-[13px] font-extrabold uppercase tracking-[0.16em] text-paper disabled:opacity-50"
            >
              {sending ? "Redirecting to payment..." : `Pay ${total} RM`}
            </button>

            <p className="mono mt-3 text-center text-[11px] uppercase tracking-[0.14em] text-ink/40">
              All proceeds fund the movement
            </p>
          </div>
        </div>
      </section>
    </Shell>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<SkeletonGrid />}>
      <CartProvider>
        <CheckoutInner />
      </CartProvider>
    </Suspense>
  );
}
