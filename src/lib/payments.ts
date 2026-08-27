import { config } from "@/lib/config";

type Product = { slug: string; name: string; price: string };

const HITPAY_API = "https://api.hit-pay.com/v1";

export type HitPayPaymentResponse = {
  id: string;
  url: string;
  reference_number: string;
  status: string;
};

export async function createHitPayPayment(
  items: Product[],
): Promise<{ ok: boolean; url?: string; reference?: string; error?: string }> {
  if (!config.hitpayApiKey) {
    return { ok: false, error: "HitPay not configured" };
  }

  const total = items.reduce(
    (sum, p) => sum + Number(p.price.replace("RM", "")),
    0,
  );
  const ref = `LM-${Date.now()}`;

  const params = new URLSearchParams({
    amount: String(total.toFixed(2)),
    currency: "myr",
    purpose: `Liga Mahasiswa - ${items.map((p) => p.name).join(", ")}`,
    reference_number: ref,
    redirect_url: `${config.siteUrl}/shop/checkout/success?ref=${ref}`,
    "payment_methods[]": "fpx",
  });

  try {
    const res = await fetch(`${HITPAY_API}/payment-requests`, {
      method: "POST",
      headers: {
        "X-BUSINESS-API-KEY": config.hitpayApiKey,
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Requested-With": "XMLHttpRequest",
      },
      body: params.toString(),
    });

    if (!res.ok) {
      const err = await res.text();
      return { ok: false, error: `HitPay ${res.status}: ${err}` };
    }

    const data: HitPayPaymentResponse = await res.json();
    return { ok: true, url: data.url, reference: data.reference_number };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Payment creation failed",
    };
  }
}

export function getHitPayPaymentUrl(paymentId: string): string {
  return `${HITPAY_API}/payment-requests/${paymentId}`;
}
