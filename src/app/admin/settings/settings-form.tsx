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
    <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-mist bg-white p-6">
      <div>
        <label htmlFor="fee" className="mb-1 block text-sm font-medium">
          Yuran Keahlian (RM)
        </label>
        <input
          id="fee"
          type="number"
          min={0}
          value={fee}
          onChange={(e) => setFee(e.target.value)}
          className="w-full rounded border border-mist bg-paper px-4 py-2.5 text-sm"
        />
        <p className="mt-1 text-xs text-stone">
          Tetapkan 0 untuk keahlian percuma.
        </p>
      </div>

      <div>
        <label htmlFor="duration" className="mb-1 block text-sm font-medium">
          Tempoh Keahlian (hari)
        </label>
        <input
          id="duration"
          type="number"
          min={1}
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          className="w-full rounded border border-mist bg-paper px-4 py-2.5 text-sm"
        />
        <p className="mt-1 text-xs text-stone">
          365 hari = 1 tahun.
        </p>
      </div>

      <div>
        <label htmlFor="sitename" className="mb-1 block text-sm font-medium">
          Nama Laman
        </label>
        <input
          id="sitename"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded border border-mist bg-paper px-4 py-2.5 text-sm"
        />
      </div>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={isPending}
          className="rounded bg-liga-red px-6 py-2.5 text-sm font-display uppercase tracking-wider text-white hover:bg-liga-red-deep disabled:opacity-50"
        >
          {isPending ? "Menyimpan..." : "Simpan"}
        </button>
        {saved && (
          <span className="text-sm text-success font-medium">Tersimpan</span>
        )}
      </div>
    </form>
  );
}
