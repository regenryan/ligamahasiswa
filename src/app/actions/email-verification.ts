"use server";

import { eq, and, gt } from "drizzle-orm";
import { db } from "@/lib/db";
import { user, resetToken } from "@/lib/schema";
import { nanoid } from "@/lib/nanoid";
import { sendEmail } from "@/lib/email";
import { logAction } from "@/lib/audit";

export type VerifyEmailState =
  | { success?: string; error?: string }
  | undefined;

export async function sendVerificationAction(
  userId: string,
): Promise<VerifyEmailState> {
  const rows = await db.select().from(user).where(eq(user.userId, userId));
  const u = rows[0];
  if (!u) return { error: "User not found." };

  const token = nanoid();
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  await db.insert(resetToken).values({
    tokenId: nanoid(),
    userId: u.userId,
    token,
    type: "email_verification",
    expiresAt,
  });

  const verifyUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/verify-email?token=${token}`;

  await sendEmail({
    to: [u.email],
    subject: "Verify your Liga Mahasiswa email",
    html: `
      <p>Hi ${u.name || "there"},</p>
      <p>Click the link below to verify your email address:</p>
      <p><a href="${verifyUrl}">Verify Email</a></p>
      <p>This link expires in 24 hours.</p>
    `,
  });

  await logAction({ userId: u.userId, action: "user:verification_sent" });
  return { success: "Verification email sent." };
}

export async function verifyEmailAction(
  token: string,
): Promise<VerifyEmailState> {
  if (!token) return { error: "Invalid verification link." };

  const now = new Date();
  const tokens = await db
    .select()
    .from(resetToken)
    .where(
      and(
        eq(resetToken.token, token),
        eq(resetToken.type, "email_verification"),
        eq(resetToken.used, false),
        gt(resetToken.expiresAt, now),
      )
    );

  const t = tokens[0];
  if (!t) return { error: "Invalid or expired verification link." };

  await db.update(resetToken).set({ used: true }).where(eq(resetToken.tokenId, t.tokenId));

  await logAction({ userId: t.userId, action: "user:email_verified" });
  return { success: "Email verified. You can now log in." };
}
