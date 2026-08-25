import { Suspense } from "react";
import { MediaSection } from "@/components/sections/media-section";
import { SkeletonMediaGrid } from "@/components/skeleton";

export function MediaSectionAsync() {
  return (
    <Suspense fallback={<SkeletonMediaGrid />}>
      <MediaSection />
    </Suspense>
  );
}
