"use client";

import { useState } from "react";
import { Shell } from "@/components/shells";
import { PageHead } from "@/components/sections";
import Link from "next/link";

type OrderRow = {
  orderId: string;
  email: string;
  status: string;
  total: string;
  currency: string;
  trackingUrl: string | null;
  trackingCode: string | null;
  createdAt: string;
};

export function ShipOrderClient({ orders }: { orders: OrderRow[] }) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [trackingUrl, setTrackingUrl] = useState("");
  const [trackingCode, setTrackingCode] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState<string | null>(null);

  const handleSave = async (orderId: string) => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/order-ship", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, trackingUrl, trackingCode }),
      });
      const data = await res.json();
      if (data.ok) {
        setSaved(orderId);
        setEditingId(null);
        // Update local state
        const idx = orders.findIndex(o => o.orderId === orderId);
        if (idx >= 0) {
          orders[idx].trackingUrl = trackingUrl;
          orders[idx].trackingCode = trackingCode;
          orders[idx].status = "shipped";
        }
      } else {
        alert(data.error || "Failed to update");
      }
    } catch {
      alert("Network error");
    }
    setSaving(false);
  };

  const statusColors: Record<string, string> = {
    completed: "bg-term/20 text-term",
    paid: "bg-term/20 text-term",
    shipped: "bg-blue-500/10 text-blue-600",
    pending: "bg-midnight text-ink/50",
    cancelled: "bg-brand/10 text-ink/40",
  };

  return (
    <Shell dir={27}>
      <PageHead kicker="Admin" title="Ship Orders" sub="Add tracking info for paid orders." />
      <section className="border-b border-line">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <Link href="/admin" className="mono mb-6 inline-block text-[11px] uppercase tracking-[0.14em] text-ink/50 hover:text-brand transition-colors">
            {"\u2190"} Back to admin
          </Link>

          {orders.length === 0 ? (
            <p className="border border-dashed border-line p-8 text-center text-[14px] text-ink/50">No orders to ship.</p>
          ) : (
            <div className="space-y-4">
              {orders.map((o) => (
                <div key={o.orderId} className="border border-line bg-cream p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <p className="mono text-[12px] text-ink/50">{o.orderId}</p>
                      <p className="mt-1 text-[14px] font-bold">{o.email || "No email"}</p>
                      <div className="mt-1 flex items-center gap-3">
                        <span className={`mono text-[11px] uppercase tracking-[0.12em] px-2 py-1 ${statusColors[o.status ?? "pending"] ?? statusColors.pending}`}>
                          {o.status ?? "pending"}
                        </span>
                        <span className="display text-lg">{o.total} {o.currency}</span>
                      </div>
                      {o.trackingCode && (
                        <p className="mono mt-1 text-[12px] text-blue-600">
                          Tracking: {o.trackingCode}
                        </p>
                      )}
                    </div>
                    <div className="flex-shrink-0">
                      {editingId === o.orderId ? (
                        <div className="space-y-2">
                          <input
                            type="text"
                            placeholder="Tracking code"
                            value={trackingCode}
                            onChange={(e) => setTrackingCode(e.target.value)}
                            className="w-full border border-line bg-midnight px-3 py-2 text-[13px] placeholder:text-ink/40 focus:outline-none sm:w-48"
                          />
                          <input
                            type="url"
                            placeholder="Tracking URL"
                            value={trackingUrl}
                            onChange={(e) => setTrackingUrl(e.target.value)}
                            className="w-full border border-line bg-midnight px-3 py-2 text-[13px] placeholder:text-ink/40 focus:outline-none sm:w-48"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleSave(o.orderId)}
                              disabled={saving || !trackingCode.trim()}
                              className="press border border-brand bg-brand px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-paper hover:opacity-90 disabled:opacity-50"
                            >
                              {saving ? "Saving..." : "Save"}
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="press border border-line bg-cream px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-ink/50 hover:border-ink hover:text-ink transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setEditingId(o.orderId);
                            setTrackingCode(o.trackingCode || "");
                            setTrackingUrl(o.trackingUrl || "");
                          }}
                          className="press border border-2 border-ink bg-brand px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.14em] text-paper hover:opacity-90"
                        >
                          {o.trackingCode ? "Update tracking" : "Add tracking"}
                        </button>
                      )}
                    </div>
                  </div>
                  {saved === o.orderId && (
                    <p className="mt-2 text-[12px] text-term">Tracking info saved!</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </Shell>
  );
}
