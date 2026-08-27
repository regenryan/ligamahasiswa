"use server";

import { db } from "@/lib/db";
import { user } from "@/lib/schema";
import { getSession } from "@/lib/session";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export async function deleteAccount() {
  const session = await getSession();
  if (!session?.userId) {
    return { ok: false, error: "Unauthorized" };
  }

  // Soft delete: set deletedAt, scramble name/email to anonymize
  await db.update(user).set({ 
    deletedAt: new Date(),
    name: "Deleted User",
    email: `deleted_${session.userId}@example.com`,
    phone: null,
    password: "", // remove password hash
  }).where(eq(user.userId, session.userId));

  // Clear session
  const cookieStore = await cookies();
  cookieStore.delete("session");

  redirect("/");
}

export async function exportData() {
  const session = await getSession();
  if (!session?.userId) {
    return { ok: false, error: "Unauthorized" };
  }

  const u = await db.select().from(user).where(eq(user.userId, session.userId));
  
  if (!u[0]) return { ok: false, error: "User not found" };

  const data = {
    user: u[0],
    // in a real implementation we would fetch orders, nominations, etc.
  };

  return { ok: true, data };
}