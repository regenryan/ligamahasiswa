import { Shell } from "@/components/shells";
import { PageHead } from "@/components/sections/head";
import { readSheet } from "@/lib/sheets-db";
import { getCurrentUser, hasRole } from "@/lib/auth";
import Link from "next/link";

async function getConstitution() {
  try {
    const rows = await readSheet("Constitution");
    return rows.map((r) => ({
      id: r.id ?? "",
      section: r.section ?? "",
      title: r.title ?? "",
      content: r.content ?? "",
      version: r.version ?? r.order ?? "1.0",
    }));
  } catch {
    return [];
  }
}

export default async function ConstitutionPage() {
  const user = await getCurrentUser();
  const isMember = user !== null && hasRole(user.role, "member") && user.status === "active";
  const sections = await getConstitution();

  if (!isMember) {
    return (
      <Shell dir={27}>
        <PageHead
          kicker="Constitution"
          title="Constitution of Liga Mahasiswa Malaysia"
          sub="Members only. Join to access the full constitution."
        />
        <section className="border-b border-line">
          <div className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6">
            <div className="border border-dashed border-line p-8 text-center">
              <p className="display text-2xl">This document is for members only.</p>
              <p className="mt-3 text-[14px] text-ink/60">
                Liga Mahasiswa Malaysia is a member-governed organisation. The constitution
                is available to all verified members.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/register"
                  className="press inline-flex border border-2 border-ink bg-brand px-5 py-3 text-[13px] font-extrabold uppercase tracking-[0.12em] text-white hover:opacity-90 transition-opacity duration-150"
                >
                  Join now
                </Link>
                <Link
                  href="/login"
                  className="press inline-flex border border-line px-5 py-3 text-[13px] font-extrabold uppercase tracking-[0.12em] text-ink hover:border-ink hover:text-brand transition-colors"
                >
                  Log in
                </Link>
              </div>
            </div>
          </div>
        </section>
      </Shell>
    );
  }

  return (
    <Shell dir={27}>
      <PageHead
        kicker="Constitution"
        title="Constitution of Liga Mahasiswa Malaysia"
        sub="The governing document of our movement."
      />
      <section className="border-b border-line">
        <div className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6">
          {sections.length === 0 ? (
            <p className="text-[14px] text-ink/50">
              Constitution text coming soon.
            </p>
          ) : (
            <div className="space-y-8">
              {sections.map((s) => (
                <article key={s.id} className="border-b border-line pb-6">
                  <h2 className="display text-xl">{s.title}</h2>
                  <p className="mt-3 text-[15px] leading-relaxed text-ink/80">{s.content}</p>
                </article>
              ))}
            </div>
          )}
          <p className="mono mt-8 text-[11px] uppercase tracking-[0.14em] text-ink/40">
            Version {sections[0]?.version ?? "1.0"}
          </p>
        </div>
      </section>
    </Shell>
  );
}
