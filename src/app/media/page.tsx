import { Shell } from "@/components/shells";
import { PageHead, JoinBand } from "@/components/sections";
import { MediaClient } from "./media-client";

const DIR = 27;

export default async function MediaPage() {
  return (
    <Shell dir={DIR}>
      <PageHead kicker="Media" title="Media" sub="Stories, coverage, and voices from the movement." />
      <MediaClient data={{ posts: [], zines: [], statements: [], podcasts: [], articles: [] }} />
      <JoinBand />
    </Shell>
  );
}
