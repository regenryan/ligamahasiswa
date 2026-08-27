import { Shell } from "@/components/shells";
import { PageHead } from "@/components/sections/head";
import { JoinBand } from "@/components/sections";
import Link from "next/link";

export default async function EventFundraisePage({
  params,
}: {
  params: Promise<{ slug: string; event: string }>;
}) {
  const { slug } = await params;

  return (
    <Shell dir={27}>
      <PageHead kicker="Fundraise" title="Event not found" />
      <section className="border-b border-line">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <Link href={`/chapters/${slug}/events`} className="mono text-[11px] uppercase tracking-[0.14em] text-ink/50 hover:text-brand transition-colors">
            {"\u2190"} Back to events
          </Link>
        </div>
      </section>
      <JoinBand />
    </Shell>
  );
}
