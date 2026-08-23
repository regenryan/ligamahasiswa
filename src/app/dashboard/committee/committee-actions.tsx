"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { approveResignation, rejectResignation } from "@/app/actions/committee";

type Approval = {
  id: string;
  type: string;
  requesterId: string;
  payload: string;
  approverIds: string;
};

export function CommitteeActions({
  approvals,
  currentUserId,
  isAdmin,
}: {
  approvals: Approval[];
  currentUserId: string;
  isAdmin: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleApprove(id: string) {
    startTransition(async () => {
      await approveResignation(id);
      router.refresh();
    });
  }

  function handleReject(id: string) {
    startTransition(async () => {
      await rejectResignation(id);
      router.refresh();
    });
  }

  return (
    <div className="mt-4 space-y-3">
      {approvals.map((a) => {
        const payload = JSON.parse(a.payload || "{}");
        const approverIds = a.approverIds ? a.approverIds.split(",") : [];
        const alreadyApproved = approverIds.includes(currentUserId);

        return (
          <div key={a.id} className="border border-line bg-cream p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[14px] font-bold capitalize">
                  {a.type}: {payload.positionTitle?.replace(/_/g, " ") ?? "Unknown"}
                </p>
                <p className="mono text-[12px] text-ink/50">
                  Requested by {a.requesterId}
                </p>
                <p className="mono text-[11px] text-ink/40 mt-1">
                  Approvals: {approverIds.length}/3
                </p>
              </div>
              <div className="flex items-center gap-2">
                {alreadyApproved ? (
                  <span className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-term">Approved by you</span>
                ) : (
                  <>
                    <button
                      onClick={() => handleApprove(a.id)}
                      disabled={isPending}
                      className="border border-term/40 bg-term/10 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.12em] text-term hover:bg-term/20 transition-colors disabled:opacity-50"
                    >
                      Approve
                    </button>
                    {isAdmin && (
                      <button
                        onClick={() => handleReject(a.id)}
                        disabled={isPending}
                        className="border border-brand/40 bg-brand/10 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.12em] text-brand-text hover:bg-brand/20 transition-colors disabled:opacity-50"
                      >
                        Reject
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
