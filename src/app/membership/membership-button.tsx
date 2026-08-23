"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { initiateMembershipPayment } from "@/app/actions/membership";

export function MembershipButton() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleClick() {
    startTransition(async () => {
      const result = await initiateMembershipPayment();
      if (result?.paymentUrl) {
        window.location.href = result.paymentUrl;
      } else if (result?.success) {
        router.push("/membership?status=success");
      } else if (result?.error) {
        alert(result.error);
      }
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className="w-full rounded-lg bg-liga-red px-4 py-3 font-display text-sm uppercase tracking-wider text-white transition-colors hover:bg-liga-red-deep disabled:opacity-50"
    >
      {isPending ? "Memproses..." : "Bayar Sekarang"}
    </button>
  );
}
