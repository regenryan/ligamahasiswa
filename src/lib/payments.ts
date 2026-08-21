import { config } from "@/lib/config";
import type { Product } from "@/lib/mock";

const HITPAY_API = "https://api.hitpayapp.com/v1";

type HitPayPaymentRequest = {
  amount: string;
  currency: string;
  description: string;
  reference_no: string;
  redirect_url: string;
  webhook_url: string;
  payment_methods?: string[];
};

export type HitPayPaymentResponse = {
  id: string;
  url: string;
  reference_no: string;
  status: string;
};

function headers(): Record<string, string> {
  const token = Buffer.from(
    `${config.hitpayApiKey}:${config.hitpayApiSecret}`,
  ).toString("base64");
  return {
    Authorization: `Basic ${token}`,
    "Content-Type": "application/json",
  };
}

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

  const body: HitPayPaymentRequest = {
    amount: String(total),
    currency: "MYR",
    description: `Liga Mahasiswa - ${items.map((p) => p.name).join(", ")}`,
    reference_no: ref,
    redirect_url: `${config.siteUrl}/shop/checkout/success?ref=${ref}`,
    webhook_url: `${config.siteUrl}/api/payment/webhook`,
    payment_methods: ["fpx", "duitnow_qr", "touch_n_go"],
  };

  try {
    const res = await fetch(`${HITPAY_API}/payment-requests`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.text();
      return { ok: false, error: `HitPay error: ${res.status} ${err}` };
    }

    const data: HitPayPaymentResponse = await res.json();
    return { ok: true, url: data.url, reference: data.reference_no };
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
