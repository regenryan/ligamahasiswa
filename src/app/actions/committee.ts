"use server";

import { writeSheet, readSheet, updateSheet } from "@/lib/sheets-db";
import { getCurrentUser, hasRole } from "@/lib/auth";

export type CommitteeState = { error?: string; success?: boolean } | undefined;

const MAIN4_TITLES = ["president", "vice_president", "secretary", "treasurer"];

function isMainCommittee(title: string): boolean {
  return MAIN4_TITLES.includes(title);
}

export async function addCommitteeMember(
  _prev: CommitteeState,
  formData: FormData,
): Promise<CommitteeState> {
  const u = await getCurrentUser();
  if (!u) return { error: "Login required." };

  const chapter = String(formData.get("chapter") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();

  if (!chapter) return { error: "Pick a chapter." };
  if (!title) return { error: "Enter the title." };
  if (!name) return { error: "Enter the name." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "Enter a valid email." };

  if (isMainCommittee(title) && !hasRole(u.role, "admin")) {
    return { error: "Hanya admin boleh menambah jawatan utama." };
  }

  const result = await writeSheet("CommitteePositions", {
    id: `cp_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    user_id: "",
    chapter,
    title,
    name,
    email,
    status: "active",
    start_date: new Date().toISOString(),
    end_date: "",
    approved_by: u.id,
    created_at: new Date().toISOString(),
  });

  if (!result.ok) {
    return { error: result.error ?? "Failed to add. Try again." };
  }

  return { success: true };
}

export async function requestResignation(positionId: string): Promise<CommitteeState> {
  const u = await getCurrentUser();
  if (!u) return { error: "Login required." };

  const positions = await readSheet("CommitteePositions", { id: positionId });
  const position = positions[0];
  if (!position) return { error: "Jawatan tidak dijumpai." };
  if (position.user_id !== u.id) return { error: "Anda tidak memegang jawatan ini." };
  if (position.status !== "active") return { error: "Jawatan ini tidak aktif." };

  const existing = await readSheet("CommitteeApprovals", {
    requester_id: u.id,
    type: "resignation",
    status: "pending",
  });
  if (existing.length > 0) return { error: "Permohonan peletakan jawatan sedia ada." };

  const result = await writeSheet("CommitteeApprovals", {
    id: `ca_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    requester_id: u.id,
    chapter: position.chapter,
    type: "resignation",
    payload: JSON.stringify({ positionTitle: position.title, positionId }),
    status: "pending",
    approver_ids: "",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  if (!result.ok) return { error: result.error ?? "Gagal menghantar permohonan." };
  return { success: true };
}

export async function approveResignation(approvalId: string): Promise<CommitteeState> {
  const u = await getCurrentUser();
  if (!u) return { error: "Login required." };

  const approvals = await readSheet("CommitteeApprovals", { id: approvalId });
  const approval = approvals[0];
  if (!approval) return { error: "Permohonan tidak dijumpai." };
  if (approval.status !== "pending") return { error: "Permohonan sudah diproses." };

  if (!hasRole(u.role, "admin")) {
    const userPositions = await readSheet("CommitteePositions", {
      chapter: approval.chapter,
      status: "active",
    });
    const main4InChapter = userPositions.filter((p) => isMainCommittee(p.title ?? ""));
    const hasMain4 = main4InChapter.some((p) => p.user_id === u.id);
    if (!hasMain4) return { error: "Hanya ahli jawatankuasa utama boleh meluluskan." };
  }

  const approverIds = approval.approver_ids ? approval.approver_ids.split(",") : [];
  if (approverIds.includes(u.id)) return { error: "Anda sudah meluluskan." };

  const newIds = [...approverIds, u.id].join(",");
  await updateSheet("CommitteeApprovals", "id", approvalId, {
    approver_ids: newIds,
  });

  const payload = JSON.parse(approval.payload || "{}");
  if (payload.positionId) {
    await updateSheet("CommitteePositions", "id", payload.positionId, {
      status: "resigned",
      end_date: new Date().toISOString(),
    });
  }

  await updateSheet("CommitteeApprovals", "id", approvalId, { status: "approved" });
  return { success: true };
}

export async function rejectResignation(approvalId: string): Promise<CommitteeState> {
  const u = await getCurrentUser();
  if (!u) return { error: "Login required." };
  if (!hasRole(u.role, "admin")) return { error: "Hanya admin boleh menolak." };

  const approvals = await readSheet("CommitteeApprovals", { id: approvalId });
  if (!approvals[0]) return { error: "Permohonan tidak dijumpai." };

  await updateSheet("CommitteeApprovals", "id", approvalId, { status: "rejected" });
  return { success: true };
}
