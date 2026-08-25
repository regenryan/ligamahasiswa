"use client";

import { useTransition, useState } from "react";
import { updateConfig } from "../actions";

export function SettingsForm({
  membershipFee,
  membershipDuration,
  siteName,
}: {
  membershipFee: string;
  membershipDuration: string;
  siteName: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [fee, setFee] = useState(membershipFee);
  const [duration, setDuration] = useState(membershipDuration);
  const [name, setName] = useState(siteName);
  const [saved, setSaved] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaved(false);
    startTransition(async () => {
      await Promise.all([
        updateConfig("membership_fee", fee),
        updateConfig("membership_duration_days", duration),
        updateConfig("site_name", name),
      ]);
      setSaved(true);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 border border-line bg-cream p-6">
      <div>
        <label htmlFor="fee" className="mb-1.5 block text-[13px] font-bold uppercase tracking-[0.08em]">
          Yuran Keahlian (RM)
        </label>
        <input
          id="fee"
          type="number"
          min={0}
          value={fee}
          onChange={(e) => setFee(e.target.value)}
          className="w-full border border-line bg-midnight px-4 py-3 text-[14px] focus:outline-none focus:ring-2 focus:ring-brand/50"
        />
        <p className="mt-1.5 text-[12px] text-ink/50">
          Tetapkan 0 untuk keahlian percuma.
        </p>
      </div>

      <div>
        <label htmlFor="duration" className="mb-1.5 block text-[13px] font-bold uppercase tracking-[0.08em]">
          Tempoh Keahlian (hari)
        </label>
        <input
          id="duration"
          type="number"
          min={1}
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          className="w-full border border-line bg-midnight px-4 py-3 text-[14px] focus:outline-none focus:ring-2 focus:ring-brand/50"
        />
        <p className="mt-1.5 text-[12px] text-ink/50">
          365 hari = 1 tahun.
        </p>
      </div>

      <div>
        <label htmlFor="sitename" className="mb-1.5 block text-[13px] font-bold uppercase tracking-[0.08em]">
          Nama Laman
        </label>
        <input
          id="sitename"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-line bg-midnight px-4 py-3 text-[14px] focus:outline-none focus:ring-2 focus:ring-brand/50"
        />
      </div>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={isPending}
          className="press border border-2 border-ink bg-brand px-6 py-2.5 text-[13px] font-extrabold uppercase tracking-[0.14em] text-paper hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {isPending ? "Menyimpan..." : "Simpan"}
        </button>
        {saved && (
          <span className="text-[13px] text-term font-medium">Tersimpan</span>
        )}
      </div>
    </form>
  );
}
