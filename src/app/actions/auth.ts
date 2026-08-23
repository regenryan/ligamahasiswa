"use server";

import { redirect } from "next/navigation";
import { hashPassword, verifyPassword } from "@/lib/hash";
import { createSession, deleteSession } from "@/lib/session";
import { findRow, readSheet, writeSheet } from "@/lib/sheets-db";

function genId(): string {
  return `u_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function genMemberId(year: number, seq: number): string {
  return `LMM-${year}-${String(seq).padStart(4, "0")}`;
}

export type AuthState =
  | { error?: string; fieldErrors?: Record<string, string> }
  | undefined;

export async function registerAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const phone = String(formData.get("phone") ?? "").trim();
  const chapter = String(formData.get("chapter") ?? "").trim();

  const fieldErrors: Record<string, string> = {};
  if (name.length < 3) fieldErrors.name = "Name must be at least 3 characters.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    fieldErrors.email = "Enter a valid email address.";
  if (password.length < 8) fieldErrors.password = "Password must be at least 8 characters.";
  if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password))
    fieldErrors.password = "Password must contain letters and numbers.";
  if (!chapter) fieldErrors.chapter = "Pick your chapter.";

  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors };
  }

  const existing = await findRow("Users", "email", email);
  if (existing) {
    return { error: "An account with this email already exists." };
  }

  const passwordHash = await hashPassword(password);
  const users = await readSheet("Users");
  const seq = users.length + 1;
  const year = new Date().getFullYear();
  const userId = genId();
  const memberId = genMemberId(year, seq);

  const result = await writeSheet("Users", {
    id: userId,
    name,
    email,
    password_hash: passwordHash,
    phone,
    chapter_slug: chapter,
    role: "user",
    status: "active",
    member_id: memberId,
    membership_paid_at: "",
    membership_expires_at: "",
    avatar_url: "",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  if (!result.ok) {
    return { error: result.error ?? "Registration failed. Try again." };
  }

  await createSession({
    userId,
    role: "user",
    status: "active",
    chapterSlug: chapter,
  });

  redirect("/dashboard");
}

export async function loginAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const user = await findRow("Users", "email", email);
  if (!user) {
    return { error: "Invalid email or password." };
  }

  const valid = await verifyPassword(password, user.password_hash ?? "");
  if (!valid) {
    return { error: "Invalid email or password." };
  }

  await createSession({
    userId: user.id ?? "",
    role: (user.role as "user" | "member" | "committee" | "national" | "admin") ?? "user",
    status: (user.status as "active" | "expired" | "suspended") ?? "active",
    chapterSlug: user.chapter_slug ?? "",
    membershipPaidAt: user.membership_paid_at ?? "",
    membershipExpiresAt: user.membership_expires_at ?? "",
  });

  redirect("/dashboard");
}

export async function logoutAction() {
  await deleteSession();
  redirect("/");
}
