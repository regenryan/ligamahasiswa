"use client";

import { useTransition } from "react";
import { Shell } from "@/components/shells";
import { PageHead } from "@/components/sections";
import Link from "next/link";
import { deleteAccount, exportData } from "@/app/actions/account";

export function SettingsClient() {
  const [pending, startTransition] = useTransition();

  const handleExport = async () => {
    const res = await exportData();
    if (res.ok) {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(res.data, null, 2));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", "my_data.json");
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
    } else {
      alert("Failed to export data: " + res.error);
    }
  };

  const handleDelete = () => {
    if (window.confirm("Are you absolutely sure you want to delete your account? This will anonymize your personal data. This action cannot be undone.")) {
      startTransition(() => {
        deleteAccount();
      });
    }
  };

  return (
    <Shell dir={27}>
      <PageHead kicker="Dashboard" title="Account Settings" sub="Manage your data and account." />
      <section className="border-b border-line">
        <div className="mx-auto w-full max-w-4xl px-4 py-16 sm:px-6">
          <Link href="/dashboard" className="mono mb-6 inline-block text-[11px] uppercase tracking-[0.14em] text-ink/50 hover:text-brand transition-colors">
            {"\u2190"} Back to dashboard
          </Link>

          <div className="space-y-8">
            <div className="border border-line bg-cream p-6">
              <h3 className="display text-xl mb-2">Export Data</h3>
              <p className="text-[14px] text-ink/70 mb-4">Download a JSON copy of your personal data.</p>
              <button 
                onClick={handleExport}
                className="press border border-ink px-4 py-2 text-[12px] font-bold uppercase tracking-[0.1em] hover:bg-ink hover:text-paper transition-colors"
              >
                Export Data
              </button>
            </div>

            <div className="border border-brand/40 bg-brand/5 p-6">
              <h3 className="display text-xl mb-2 text-brand-text">Delete Account</h3>
              <p className="text-[14px] text-ink/70 mb-4">
                Permanently delete your account. This will anonymize your personal details but keep your order history intact.
              </p>
              <button 
                onClick={handleDelete}
                disabled={pending}
                className="press border border-brand bg-brand px-4 py-2 text-[12px] font-bold uppercase tracking-[0.1em] text-paper hover:opacity-90 disabled:opacity-50"
              >
                {pending ? "Deleting..." : "Delete Account"}
              </button>
            </div>
          </div>
        </div>
      </section>
    </Shell>
  );
}