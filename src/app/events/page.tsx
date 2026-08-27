import { Shell } from "@/components/shells";
import { PageHead, JoinBand } from "@/components/sections";
import { dbGetEvents, type EventData } from "@/lib/queries";
import { EventsClient } from "./events-client";

const DIR = 27;

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
