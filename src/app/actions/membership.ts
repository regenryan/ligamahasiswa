"use server";

import crypto from "crypto";
import { config } from "@/lib/config";
import { getSession } from "@/lib/session";
import { getMembershipFee, getMembershipDurationDays } from "@/lib/config";
import { writeSheet, updateSheet } from "@/lib/sheets-db";
import { hasRole } from "@/lib/auth";

export type MembershipState = { error?: string; success?: boolean; paymentUrl?: string } | undefined;

export async function initiateMembershipPayment(): Promise<MembershipState> {
  const session = await getSession();
  if (!session?.userId) return { error: "Log masuk diperlukan." };

  if (hasRole(session.role, "member") && session.status === "active") {
    return { error: "Anda sudah menjadi ahli." };
  }

  const fee = await getMembershipFee();
  const durationDays = await getMembershipDurationDays();

  if (fee === 0) {
    const now = new Date().toISOString();
    const expires = new Date(Date.now() + durationDays * 86400_000).toISOString();
    await updateSheet("Users", "id", session.userId, {
      role: "member",
      status: "active",
      membership_paid_at: now,
      membership_expires_at: expires,
    });
    return { success: true };
  }

  const amountCents = Math.round(fee * 100);
  const referenceId = `membership_${session.userId}_${Date.now()}`;
  const callbackUrl = `${config.siteUrl}/api/membership/callback`;
  const redirectUrl = `${config.siteUrl}/#member`;

  const data = new URLSearchParams();
  data.append("api_key", config.hitpayApiKey);
  data.append("amount", String(amountCents));
  data.append("currency", "MYR");
  data.append("reference_id", referenceId);
  data.append("description", `Yuran keahlian Liga Mahasiswa Malaysia (RM${fee} / ${durationDays} hari)`);
  data.append("callback_url", callbackUrl);
  data.append("redirect_url", redirectUrl);

  const HMAC = crypto
    .createHmac("sha256", config.hitpaySalt)
    .update(data.toString())
    .digest("hex");

  const res = await fetch("https://api.hitpay.com/v1/payment-requests", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "X-HitPay-Key": config.hitpayApiKey,
      "X-HitPay-Salt": config.hitpaySalt,
    },
    body: data.toString(),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("HitPay error:", text);
    return { error: "Gagal memulakan pembayaran. Cuba lagi." };
  }

  const result = await res.json();
  return { success: true, paymentUrl: result.url };
}
