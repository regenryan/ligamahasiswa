import { Shell } from "@/components/shells";
import { PageHead, SectionHead, Btn } from "@/components/sections/head";
import { readSheet } from "@/lib/sheets-db";

async function getCampaigns() {
  try {
    const rows = await readSheet("Campaigns", { status: "Active" });
    return rows.map((r) => ({
      slug: r.slug ?? "",
      title: r.title ?? "",
      summary: r.summary ?? "",
      chapterSlug: r.chapter_slug ?? "",
    }));
  } catch {
    return [];
  }
}

export default async function FundraisePage() {
  const activeCampaigns = await getCampaigns();

  return (
    <Shell dir={27}>
      <PageHead
        kicker="Fundraise"
        title="Fund the fight"
        sub="Every ringgit goes to campaigns, prints, and the next assembly."
      />
      <section className="border-b border-line">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <SectionHead index={1} title="Active campaigns" sub="Choose a campaign to fund directly." />
          {activeCampaigns.length === 0 ? (
            <div className="border border-dashed border-line p-8 text-center">
              <p className="text-[14px] text-ink/50">
                No active fundraising campaigns right now.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2">
              {activeCampaigns.map((c) => (
                <article key={c.slug} className="border border-line bg-cream p-6">
                  <span className="mono text-[11px] uppercase tracking-[0.14em] text-ink/50">
                    {c.chapterSlug === "malaysia" ? "National" : c.chapterSlug.toUpperCase()}
                  </span>
                  <h3 className="mt-2 display text-xl">{c.title}</h3>
                  <p className="mt-2 text-[14px] text-ink/60">{c.summary}</p>
                  <Btn kind="join" className="mt-4" href="/shop">
                    Support this campaign
                  </Btn>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
      <section className="border-b border-line bg-midnight">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <SectionHead index={2} title="How to contribute" sub="Multiple ways to support the movement." />
          <div className="grid gap-5 sm:grid-cols-3">
            {[
              { title: "Shop", body: "Buy merch. Every ringgit funds campaigns." },
              { title: "Donate", body: "Direct contribution to any active campaign." },
              { title: "Volunteer", body: "Time and skills. Register and join your chapter." },
            ].map((item) => (
              <article key={item.title} className="border border-fog/20 bg-fog/5 p-6">
                <h3 className="display text-lg text-fog">{item.title}</h3>
                <p className="mt-2 text-[13px] text-fog/60">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </Shell>
  );
}
