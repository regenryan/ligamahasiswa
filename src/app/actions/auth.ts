"use server";

import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { user, member, roleRecord } from "@/lib/schema";
import { hashPassword, verifyPassword } from "@/lib/password";
import { createSession, deleteSession } from "@/lib/session";
import { nanoid } from "@/lib/nanoid";
import { logAction } from "@/lib/audit";

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
  const chapterSlug = String(formData.get("chapter") ?? "").trim();

  const fieldErrors: Record<string, string> = {};
  if (name.length < 3) fieldErrors.name = "Name must be at least 3 characters.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    fieldErrors.email = "Enter a valid email address.";
  if (password.length < 8) fieldErrors.password = "Password must be at least 8 characters.";
  if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password))
    fieldErrors.password = "Password must contain letters and numbers.";
  if (!chapterSlug) fieldErrors.chapter = "Pick your chapter.";

  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors };
  }

  // Check existing
  const existing = await db.select().from(user).where(eq(user.email, email));
  if (existing.length > 0) {
    return { error: "An account with this email already exists." };
  }

  const passwordHash = await hashPassword(password);
  const userId = nanoid();

  await db.insert(user).values({
    userId,
    username: email.split("@")[0],
    name,
    email,
    phone: phone || null,
    password: passwordHash,
  });

  // Assign default user role
  await db.insert(roleRecord).values({
    recordId: nanoid(),
    userId,
    roleId: "role_user",
    startDate: new Date(),
  });

  await logAction({ userId, action: "user:register", targetType: "user", targetId: userId });
  await createSession({ userId });
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

  const rows = await db.select().from(user).where(eq(user.email, email));
  const u = rows[0];

  if (!u || u.deletedAt) {
    return { error: "Invalid email or password." };
  }

  const valid = await verifyPassword(password, u.password);
  if (!valid) {
    return { error: "Invalid email or password." };
  }

  await logAction({ userId: u.userId, action: "user:login", targetType: "user", targetId: u.userId });
  await createSession({ userId: u.userId });
  redirect("/dashboard");
}

export async function logoutAction() {
  await deleteSession();
  redirect("/");
}
