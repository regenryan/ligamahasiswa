"use server";

import { getCurrentUser, hasRole } from "@/lib/auth";
import { getMembershipFee, getMembershipDurationDays } from "@/lib/config";

export type MembershipState = { error?: string; success?: boolean; paymentUrl?: string } | undefined;

export async function initiateMembershipPayment(): Promise<MembershipState> {
  const u = await getCurrentUser();
  if (!u) return { error: "Log masuk diperlukan." };

  if (hasRole(u.role, "member") && u.status === "active") {
    return { error: "Anda sudah menjadi ahli." };
  }

  const fee = await getMembershipFee();
  const durationDays = await getMembershipDurationDays();

  // Mock payment for now (ToyyibPay integration in Phase 6)
  if (fee === 0) {
    return { success: true };
  }

  // TODO: ToyyibPay integration in Phase 6
  return { error: "Payment integration coming soon." };
}
