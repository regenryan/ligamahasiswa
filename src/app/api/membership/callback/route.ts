import { NextRequest, NextResponse } from "next/server";
import { getMembershipDurationDays } from "@/lib/config";
import { updateSheet } from "@/lib/sheets-db";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const referenceId = searchParams.get("reference_id");
  const status = searchParams.get("status");

  if (!referenceId) {
    return NextResponse.redirect(new URL("/#member", request.url));
  }

  if (status !== "completed" && status !== "paid") {
    return NextResponse.redirect(new URL("/#member", request.url));
  }

  const match = referenceId.match(/^membership_(.+)_\d+$/);
  if (!match) {
    return NextResponse.redirect(new URL("/#member", request.url));
  }

  const userId = match[1];
  const durationDays = await getMembershipDurationDays();
  const now = new Date().toISOString();
  const expires = new Date(Date.now() + durationDays * 86400_000).toISOString();

  await updateSheet("Users", "id", userId, {
    role: "member",
    status: "active",
    membership_paid_at: now,
    membership_expires_at: expires,
  });

  return NextResponse.redirect(new URL("/#member", request.url));
}
