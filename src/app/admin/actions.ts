"use server";

import { readSheet, updateSheet } from "@/lib/sheets-db";
import { getCurrentUser } from "@/lib/auth";

export async function approveUser(userId: string) {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") return { ok: false, error: "Unauthorized" };
  return updateSheet("Users", "id", userId, { status: "approved" });
}

export async function rejectUser(userId: string) {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") return { ok: false, error: "Unauthorized" };
  return updateSheet("Users", "id", userId, { status: "rejected" });
}

export async function setUserRole(userId: string, role: string) {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") return { ok: false, error: "Unauthorized" };
  return updateSheet("Users", "id", userId, { role });
}

export async function approveZine(slug: string) {
  const user = await getCurrentUser();
  if (!user || (user.role !== "admin" && user.role !== "committee")) return { ok: false, error: "Unauthorized" };
  return updateSheet("Zines", "slug", slug, { status: "approved" });
}

export async function rejectZine(slug: string) {
  const user = await getCurrentUser();
  if (!user || (user.role !== "admin" && user.role !== "committee")) return { ok: false, error: "Unauthorized" };
  return updateSheet("Zines", "slug", slug, { status: "rejected" });
}

export async function approveNomination(id: string) {
  const user = await getCurrentUser();
  if (!user || (user.role !== "admin" && user.role !== "committee")) return { ok: false, error: "Unauthorized" };
  return updateSheet("PRK_Nominations", "id", id, { status: "approved" });
}

export async function rejectNomination(id: string) {
  const user = await getCurrentUser();
  if (!user || (user.role !== "admin" && user.role !== "committee")) return { ok: false, error: "Unauthorized" };
  return updateSheet("PRK_Nominations", "id", id, { status: "rejected" });
}

export async function updateOrderStatus(orderId: string, status: string) {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") return { ok: false, error: "Unauthorized" };
  return updateSheet("Orders", "id", orderId, { payment_status: status });
}
