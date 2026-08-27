"use server";

import { eq, and, gt } from "drizzle-orm";
import { db } from "@/lib/db";
import { user, resetToken } from "@/lib/schema";
import { hashPassword } from "@/lib/password";
import { nanoid } from "@/lib/nanoid";
import { sendEmail } from "@/lib/email";
import { logAction } from "@/lib/audit";

export type PasswordResetState =
  | { success?: string; error?: string }
  | undefined;

export async function requestResetAction(
  _prev: PasswordResetState,
  formData: FormData,
): Promise<PasswordResetState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!email) return { error: "Email is required." };

  const rows = await db.select().from(user).where(eq(user.email, email));
  const u = rows[0];

  // Always return success to prevent email enumeration
  if (!u) {
    return { success: "If an account exists with that email, you will receive a reset link." };
  }

  const token = nanoid();
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await db.insert(resetToken).values({
    tokenId: nanoid(),
    userId: u.userId,
    token,
    type: "password_reset",
    expiresAt,
  });

  const resetUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password?token=${token}`;

  await sendEmail({
    to: [u.email],
    subject: "Reset your Liga Mahasiswa password",
    html: `
      <p>Hi ${u.name || "there"},</p>
      <p>You requested a password reset. Click the link below to set a new password:</p>
      <p><a href="${resetUrl}">Reset Password</a></p>
      <p>This link expires in 1 hour.</p>
      <p>If you did not request this, you can safely ignore this email.</p>
    `,
  });

  await logAction({ userId: u.userId, action: "user:password_reset_request" });
  return { success: "If an account exists with that email, you will receive a reset link." };
}

export async function resetPasswordAction(
  _prev: PasswordResetState,
  formData: FormData,
): Promise<PasswordResetState> {
  const token = String(formData.get("token") ?? "");
  const password = String(formData.get("password") ?? "");

  if (!token) return { error: "Invalid reset link." };
  if (password.length < 8) return { error: "Password must be at least 8 characters." };
  if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password))
    return { error: "Password must contain letters and numbers." };

  const now = new Date();
  const tokens = await db
    .select()
    .from(resetToken)
    .where(
      and(
        eq(resetToken.token, token),
        eq(resetToken.type, "password_reset"),
        eq(resetToken.used, false),
        gt(resetToken.expiresAt, now),
      )
    );

  const t = tokens[0];
  if (!t) return { error: "Invalid or expired reset link." };

  const passwordHash = await hashPassword(password);
  await db.update(user).set({ password: passwordHash, updatedAt: now }).where(eq(user.userId, t.userId!));
  await db.update(resetToken).set({ used: true }).where(eq(resetToken.tokenId, t.tokenId));

  await logAction({ userId: t.userId, action: "user:password_reset" });
  return { success: "Password updated. You can now log in." };
}
