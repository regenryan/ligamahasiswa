"use server";

import { getCurrentUser } from "@/lib/auth";

export type CommitteeState = { error?: string; success?: boolean } | undefined;

export async function addCommitteeMember(
  _prev: CommitteeState,
  _formData: FormData,
): Promise<CommitteeState> {
  const u = await getCurrentUser();
  if (!u) return { error: "Login required." };
  return { error: "Committee management coming soon." };
}

export async function requestResignation(_positionId: string): Promise<CommitteeState> {
  const u = await getCurrentUser();
  if (!u) return { error: "Login required." };
  return { error: "Resignation feature coming soon." };
}

export async function approveResignation(_approvalId: string): Promise<CommitteeState> {
  const u = await getCurrentUser();
  if (!u) return { error: "Login required." };
  return { error: "Approval feature coming soon." };
}

export async function rejectResignation(_approvalId: string): Promise<CommitteeState> {
  const u = await getCurrentUser();
  if (!u) return { error: "Login required." };
  return { error: "Rejection feature coming soon." };
}
