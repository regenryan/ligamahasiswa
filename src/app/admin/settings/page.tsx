import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { config } from "@/lib/schema";
import { Shell } from "@/components/shells";
import { PageHead } from "@/components/sections";
import Link from "next/link";
import { SettingsForm } from "./settings-form";

export const metadata = {
  title: "Tetapan | Admin | Liga Mahasiswa Malaysia",
};

export default async function AdminSettingsPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") redirect("/dashboard");

  const rows = await db.select().from(config);
  const configMap = Object.fromEntries(rows.map((c) => [c.key, c.value]));

  return (
    <Shell dir={27}>
      <PageHead kicker="Admin" title="Tetapan" sub="Urus yuran keahlian dan tetapan laman." />
      <section className="border-b border-line">
        <div className="mx-auto w-full max-w-3xl px-4 py-14 sm:px-6">
          <Link href="/admin" className="mono mb-6 inline-block text-[11px] uppercase tracking-[0.14em] text-ink/50 hover:text-brand transition-colors">
            {"\u2190"} Back to admin
          </Link>
          <SettingsForm
            membershipFee={configMap.membership_fee ?? "10"}
            membershipDuration={configMap.membership_duration_days ?? "365"}
            siteName={configMap.site_name ?? "Liga Mahasiswa Malaysia"}
          />
        </div>
      </section>
    </Shell>
  );
}
