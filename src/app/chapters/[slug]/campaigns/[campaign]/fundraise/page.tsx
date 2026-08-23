import Link from "next/link";
import { Shell } from "@/components/shells";
import { PageHead } from "@/components/sections/head";
import { JoinBand, NewsletterBand } from "@/components/sections";
import { readSheet } from "@/lib/sheets-db";
import { chapterLabel } from "@/lib/chapters";
import { getCampaign } from "@/lib/mock";

type CampaignInfo = {
  slug: string;
  title: string;
  summary: string;
  status: string;
  paymentUrl: string | null;
};

async function getChapterCampaign(
  chapterSlug: string,
  campaignSlug: string,
): Promise<CampaignInfo | null> {
  try {
    const rows = await readSheet("Campaigns", {
      chapter_slug: chapterSlug,
      campaign_slug: campaignSlug,
    });
    if (rows.length > 0) {
      const r = rows[0];
      return {
        slug: r.slug ?? "",
        title: r.title ?? "",
        summary: r.summary ?? r.description ?? "",
        status: r.status ?? "",
        paymentUrl:
          r.payment_url || r.donate_url || r.hitpay_url || null,
      };
    }
  } catch {
    // fall through
  }
  const mock = getCampaign(chapterSlug, campaignSlug);
  if (mock && mock.slug === campaignSlug) {
    return {
      slug: mock.slug,
      title: mock.title,
      summary: mock.summary,
      status: mock.status,
      paymentUrl: null,
    };
  }
  return null;
}

export default async function CampaignFundraisePage({
  params,
}: {
  params: Promise<{ slug: string; campaign: string }>;
}) {
  const { slug, campaign: campaignSlug } = await params;
  const info = await getChapterCampaign(slug, campaignSlug);

  if (!info) {
    return (
      <Shell dir={27}>
        <PageHead kicker="Fundraise" title="Campaign not found" />
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <Link
            href={`/chapters/${slug}/campaigns`}
            className="press inline-flex border border-line px-5 py-3 text-[13px] font-extrabold uppercase tracking-[0.12em] text-ink hover:border-ink hover:text-brand transition-colors"
          >
            Back to campaigns
          </Link>
        </div>
        <JoinBand />
        <NewsletterBand />
      </Shell>
    );
  }

  return (
    <Shell dir={27}>
      <PageHead
        kicker="Fundraise"
        title={info.title}
        sub={info.summary}
      />
      <section className="border-b border-line">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <div className="grid gap-8 md:grid-cols-[1.2fr_0.8fr] md:items-start">
            <div>
              <span className="mono inline-flex border border-line px-3 py-1.5 text-[11px] uppercase tracking-[0.14em] text-ink/60">
                {chapterLabel(slug)}
              </span>
              <h2 className="mt-6 display text-3xl leading-tight sm:text-4xl">
                {info.title}
              </h2>
              <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ink/70">
                {info.summary}
              </p>
            </div>
            <div className="border border-line bg-cream p-6">
              <p className="mono text-[11px] uppercase tracking-[0.2em] text-ink/50">
                Support this campaign
              </p>
              <p className="mt-3 text-[15px] leading-relaxed text-ink/70">
                Every ringgit goes straight into prints, logistics, and the
                ground work behind this campaign.
              </p>
              {info.paymentUrl ? (
                <a
                  href={info.paymentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="press mt-6 inline-flex w-full items-center justify-center bg-brand px-5 py-3 text-[13px] font-extrabold uppercase tracking-[0.12em] text-white hover:opacity-90 transition-opacity duration-150"
                >
                  Donate via HitPay
                </a>
              ) : (
                <div className="mt-6 border border-dashed border-line p-4 text-center">
                  <p className="text-[13px] font-bold uppercase tracking-[0.12em] text-ink/50">
                    Online donations coming soon
                  </p>
                  <p className="mt-1 text-[13px] text-ink/60">
                    HitPay payments for this campaign are not open yet.
                  </p>
                </div>
              )}
            </div>
          </div>
          <Link
            href={`/chapters/${slug}/campaigns/${campaignSlug}`}
            className="press mt-10 inline-flex border border-line px-5 py-3 text-[13px] font-extrabold uppercase tracking-[0.12em] text-ink hover:border-ink hover:text-brand transition-colors"
          >
            Back to campaign
          </Link>
        </div>
      </section>
      <JoinBand />
      <NewsletterBand />
    </Shell>
  );
}
