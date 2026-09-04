import type { Metadata } from "next";
import { Shell } from "@/components/shells";
import { PageHead, JoinBand } from "@/components/sections";
import { dbGetEvents, type EventData } from "@/lib/queries";
import { EventsClient } from "./events-client";

const DIR = 27;

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ligamahasiswa.vercel.app";

export const metadata: Metadata = {
  title: "Events",
  description:
    "Gatherings, rallies, and dialogues from the Malaysian student movement.",
  openGraph: {
    title: "Events | Liga Mahasiswa Malaysia",
    description:
      "Gatherings, rallies, and dialogues from the Malaysian student movement.",
    url: `${siteUrl}/events`,
    siteName: "Liga Mahasiswa Malaysia",
    locale: "en_MY",
    type: "website",
  },
  alternates: { canonical: `${siteUrl}/events` },
};

export default async function EventsPage() {
  const events: EventData[] = await dbGetEvents();

  return (
    <Shell dir={DIR}>
      <PageHead
        kicker="Events"
        title="Events"
        sub="Gatherings, rallies, and dialogues."
      />
      <EventsClient events={events} />
      <JoinBand />
    </Shell>
  );
}
