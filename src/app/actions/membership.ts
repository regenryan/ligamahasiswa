"use server";

import { getCurrentUser } from "@/lib/auth";
import { getMembershipFee, getMembershipDurationDays } from "@/lib/config";
import { createBill } from "@/lib/toyyibpay";
import { db } from "@/lib/db";
import { order as orderTable } from "@/lib/schema";
import { nanoid } from "@/lib/nanoid";

export type MembershipState = { error?: string; success?: boolean; paymentUrl?: string } | undefined;

export async function initiateMembershipPayment(): Promise<MembershipState> {
  const u = await getCurrentUser();
  if (!u) return { error: "Log masuk diperlukan." };

  // Check if already an active member
  const isMember = u.role === "member" && u.status === "active";
  if (isMember) {
    return { error: "Anda sudah menjadi ahli." };
  }

  const fee = await getMembershipFee();
  const durationDays = await getMembershipDurationDays();

  // If fee is 0, grant membership directly
  if (fee === 0) {
    // In a real implementation, this would update the member table
    // For now, just return success
    return { success: true };
  }

  // Create a membership order
  const orderId = `mbr_${nanoid()}`;
  
  await db.insert(orderTable).values({
    orderId,
    userId: u.id,
    email: u.email,
    total: String(fee),
    currency: "MYR",
    method: "toyyibpay",
    status: "pending",
  });

  // Create ToyyibPay bill
  const bill = await createBill({
    orderId,
    amount: fee,
    buyerName: u.name || "Member",
    buyerEmail: u.email,
    description: `Liga Mahasiswa Membership - ${fee} MYR`,
  });

  if (bill.ok && bill.redirectUrl) {
    return { success: true, paymentUrl: bill.redirectUrl };
  }

  return { error: bill.error || "Payment gateway error. Please try again." };
}
