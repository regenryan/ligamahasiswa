import { Shell } from "@/components/shells";
import { PageHead, JoinBand, NewsletterBand } from "@/components/sections";
import { readSheet } from "@/lib/sheets-db";
import { events as mockEvents, type EventItem } from "@/lib/mock";
import { EventsClient } from "./events-client";

const DIR = 27;

async function getEvents(): Promise<EventItem[]> {
  try {
    const rows = await readSheet("Events");
    if (rows.length === 0) return mockEvents;
    return rows.map((r) => ({
      slug: r.slug ?? "",
      chapterSlug: r.chapter_slug ?? "",
      title: r.title ?? "",
      date: r.date ?? "",
      time: r.time ?? "",
      place: r.place ?? r.location ?? "",
      type: (r.type as EventItem["type"]) ?? "Forum",
      blurb: r.blurb ?? r.description ?? "",
    }));
  } catch {
    return mockEvents;
  }
}

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <Shell dir={DIR}>
      <PageHead
        kicker="Events"
        title="Events"
        sub="Gatherings, rallies, and dialogues."
      />
      <EventsClient events={events} />
      <JoinBand />
      <NewsletterBand />
    </Shell>
  );
}
