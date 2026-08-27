"use server";

import { db } from "@/lib/db";
import { user, nomination, order, config } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";

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
