"use client";

import { useState, startTransition } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";

export function RsvpButton({ eventSlug }: { eventSlug: string }) {
  const { user } = useAuth();
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "going" | "error">("idle");
  const [loading, setLoading] = useState(false);

  const handleRsvp = async () => {
    if (!user) {
      router.push(`/login?from=/events/${eventSlug}`);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventSlug }),
      });
      const data = await res.json();
      if (data.ok) {
        startTransition(() => setStatus("going"));
      } else {
        startTransition(() => setStatus("error"));
      }
    } catch {
      startTransition(() => setStatus("error"));
    } finally {
      setLoading(false);
    }
  };

  if (status === "going") {
    return (
      <div className="mt-6 w-full border-2 border-term bg-term/10 px-5 py-3 text-center text-[13px] font-extrabold uppercase tracking-[0.12em] text-term">
        You are going
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={handleRsvp}
      disabled={loading}
      className="press mt-6 block w-full border border-2 border-ink bg-brand px-5 py-3 text-center text-[13px] font-extrabold uppercase tracking-[0.12em] text-white hover:opacity-90 transition-opacity duration-150 disabled:opacity-50"
    >
      {loading ? "Sending..." : "RSVP"}
    </button>
  );
}
