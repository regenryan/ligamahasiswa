"use client";

import { Suspense, useEffect, useState } from "react";
import { Shell } from "@/components/shells";
import { PageHead } from "@/components/sections";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function PaymentSuccessInner() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const billCode = searchParams.get("billCode");
  const amount = searchParams.get("amount");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) {
      setStatus("error");
      setError("No order ID found");
      return;
    }

    // Verify payment with our backend
    fetch("/api/payment/callback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ billCode, orderId }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          setStatus("success");
        } else {
          setStatus("error");
          setError(data.error || "Payment verification failed");
        }
      })
      .catch(() => {
        setStatus("error");
        setError("Network error. Please contact support.");
      });
  }, [orderId, billCode]);

  return (
    <Shell dir={27}>
      <PageHead kicker="Payment" title={status === "loading" ? "Processing..." : status === "success" ? "Payment successful" : "Payment issue"} />
      <section className="border-b border-line">
        <div className="mx-auto w-full max-w-2xl px-4 py-16 text-center sm:px-6">
          {status === "loading" && (
            <div className="space-y-4">
              <div className="mx-auto h-8 w-8 animate-spin border-2 border-brand border-t-transparent" />
              <p className="mono text-[13px] text-ink/50">Verifying your payment...</p>
            </div>
          )}

          {status === "success" && (
            <div className="space-y-6">
              <div className="mx-auto flex h-16 w-16 items-center justify-center border-2 border-term bg-term/10 text-3xl">
                {"\u2713"}
              </div>
              <div>
                <h2 className="display text-3xl">Terima kasih!</h2>
                <p className="mt-2 text-[15px] text-ink/60">Your payment has been processed successfully.</p>
              </div>
              <div className="border border-line bg-cream p-4 text-left">
                <p className="mono text-[12px] text-ink/50">Order ID</p>
                <p className="mono text-[14px] font-bold">{orderId}</p>
                {amount && (
                  <>
                    <p className="mono mt-2 text-[12px] text-ink/50">Amount</p>
                    <p className="display text-xl">RM {amount}</p>
                  </>
                )}
              </div>
              <p className="text-[14px] text-ink/50">
                A confirmation will be sent to your email. For shop orders, we will process and ship within 3-5 business days.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link href="/dashboard/orders" className="press border border-2 border-ink bg-brand px-5 py-3 text-[13px] font-extrabold uppercase tracking-[0.14em] text-paper hover:opacity-90">
                  View my orders
                </Link>
                <Link href="/" className="press border border-line bg-cream px-5 py-3 text-[13px] font-bold uppercase tracking-[0.14em] text-ink/60 hover:border-ink hover:text-ink transition-colors">
                  Back to home
                </Link>
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="space-y-6">
              <div className="mx-auto flex h-16 w-16 items-center justify-center border-2 border-brand bg-brand/10 text-3xl">
                {"\u2717"}
              </div>
              <div>
                <h2 className="display text-3xl">Payment issue</h2>
                <p className="mt-2 text-[15px] text-ink/60">{error || "Something went wrong with your payment."}</p>
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                <Link href="/shop" className="press border border-2 border-ink bg-brand px-5 py-3 text-[13px] font-extrabold uppercase tracking-[0.14em] text-paper hover:opacity-90">
                  Try again
                </Link>
                <a href="mailto:admin@ligamahasiswa.my" className="press border border-line bg-cream px-5 py-3 text-[13px] font-bold uppercase tracking-[0.14em] text-ink/60 hover:border-ink hover:text-ink transition-colors">
                  Contact support
                </a>
              </div>
            </div>
          )}
        </div>
      </section>
    </Shell>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <Shell dir={27}>
          <PageHead kicker="Payment" title="Processing..." />
          <section className="border-b border-line">
            <div className="mx-auto w-full max-w-2xl px-4 py-16 text-center sm:px-6">
              <div className="mx-auto h-8 w-8 animate-spin border-2 border-brand border-t-transparent" />
            </div>
          </section>
        </Shell>
      }
    >
      <PaymentSuccessInner />
    </Suspense>
  );
}
