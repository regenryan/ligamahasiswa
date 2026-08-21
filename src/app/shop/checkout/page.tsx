"use client";

import { Suspense, useState } from "react";
import { Shell } from "@/components/shells";
import { PageHead, Btn } from "@/components/sections";
import { CartProvider, useCart } from "@/components/interactive";
import { createHitPayPayment } from "@/lib/payments";
import { submitOrder } from "@/lib/sheets";

const DIR = 27;

function CheckoutInner() {
  const { items, clear } = useCart();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
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

    const itemsStr = items.map((p) => p.name).join(", ");

    await submitOrder({
      name: name.trim(),
      email: email.trim(),
      items: itemsStr,
      total,
      paymentMethod: "pending",
      paymentStatus: "initiated",
    });

    const res = await createHitPayPayment(items);
    setSending(false);

    if (res.ok && res.url) {
      clear();
      window.location.href = res.url;
    } else if (res.error) {
      setError(res.error);
    } else {
      setError("Could not start payment. Try again.");
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
      <PageHead kicker="Shop" title="Checkout" sub="Review your order and choose a payment method." />
      <section className="border-b border-line">
        <div className="mx-auto grid w-full max-w-4xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <h2 className="display mb-6 text-2xl">Order summary</h2>
            <ul className="space-y-3">
              {items.map((p) => (
                <li key={p.slug} className="flex items-center justify-between border border-line bg-cream px-4 py-3">
                  <div>
                    <p className="text-[14px] font-bold">{p.name}</p>
                    <p className="mono text-[12px] text-ink/50">{p.tag}</p>
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
                <input id="co-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" className="w-full border border-line bg-midnight px-4 py-3 text-[14px] placeholder:text-ink/35 focus:outline-none" />
              </div>
              <div>
                <label htmlFor="co-email" className="mb-1.5 block text-[13px] font-bold">Email</label>
                <input id="co-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@campus.edu.my" className="w-full border border-line bg-midnight px-4 py-3 text-[14px] placeholder:text-ink/35 focus:outline-none" />
              </div>
            </div>

            {error && <p role="alert" className="mono mt-4 text-[12px] text-brand-text">{error}</p>}

            <div className="mt-6 space-y-3">
              <p className="mono text-[11px] uppercase tracking-[0.16em] text-ink/50">Payment method</p>
              <div className="grid grid-cols-3 gap-2">
                {["FPX", "TnG", "DuitNow"].map((m) => (
                  <div key={m} className="flex items-center justify-center border border-line bg-cream px-3 py-2.5 text-[12px] font-bold uppercase tracking-[0.08em]">
                    {m}
                  </div>
                ))}
              </div>
              <p className="mono text-[10px] text-ink/40">You will be redirected to choose your bank or e-wallet.</p>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={sending}
              className="press mt-6 w-full border border-2 border-ink bg-brand px-5 py-3.5 text-[13px] font-extrabold uppercase tracking-[0.16em] text-white disabled:opacity-50"
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
    <Suspense fallback={null}>
      <CartProvider>
        <CheckoutInner />
      </CartProvider>
    </Suspense>
  );
}
