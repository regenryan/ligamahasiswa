"use server";

import { db } from "@/lib/db";
import { user, nomination, order, config, nominationNote } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";
import crypto from "crypto";

export async function setUserRole(userId: string, role: string) {
  const u = await getCurrentUser();
  if (!u || u.role !== "admin") return { ok: false, error: "Unauthorized" };
  void role;
  return { ok: true };
}

export async function setUserStatus(userId: string, _status: string) {
  const u = await getCurrentUser();
  if (!u || u.role !== "admin") return { ok: false, error: "Unauthorized" };
  return { ok: true };
}

export async function approveZine(_slug: string) {
  const u = await getCurrentUser();
  if (!u || (u.role !== "admin" && u.role !== "committee")) return { ok: false, error: "Unauthorized" };
  return { ok: true };
}

export async function rejectZine(_slug: string) {
  const u = await getCurrentUser();
  if (!u || (u.role !== "admin" && u.role !== "committee")) return { ok: false, error: "Unauthorized" };
  return { ok: true };
}

export async function approveNomination(id: string) {
  const u = await getCurrentUser();
  if (!u || (u.role !== "admin" && u.role !== "committee")) return { ok: false, error: "Unauthorized" };
  await db.update(nomination).set({ status: "approved" }).where(eq(nomination.nominationId, id));
  return { ok: true };
}

export async function rejectNomination(id: string) {
  const u = await getCurrentUser();
  if (!u || (u.role !== "admin" && u.role !== "committee")) return { ok: false, error: "Unauthorized" };
  await db.update(nomination).set({ status: "rejected" }).where(eq(nomination.nominationId, id));
  return { ok: true };
}

export async function updateOrderStatus(orderId: string, status: string) {
  const u = await getCurrentUser();
  if (!u || u.role !== "admin") return { ok: false, error: "Unauthorized" };
  await db.update(order).set({ status }).where(eq(order.orderId, orderId));
  return { ok: true };
}

export async function updateConfig(key: string, value: string) {
  const u = await getCurrentUser();
  if (!u || u.role !== "admin") return { ok: false, error: "Unauthorized" };
  await db.update(config).set({ value }).where(eq(config.key, key));
  return { ok: true };
}

export async function addNominationNote(nominationId: string, comment: string, verdict: string | null = null, contactStatus: string | null = null) {
  const u = await getCurrentUser();
  if (!u || (u.role !== "admin" && u.role !== "committee")) return { ok: false, error: "Unauthorized" };
  
  const noteId = `note_${crypto.randomUUID().replace(/-/g, "")}`;
  await db.insert(nominationNote).values({
    noteId,
    nominationId,
    userId: u.id,
    comment,
    verdict,
    contactStatus,
  });
  
  return { ok: true };
}
