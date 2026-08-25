import { SkeletonStats, SkeletonSectionHead, SkeletonGrid } from "@/components/skeleton";

export default function Loading() {
  return (
    <>
      <SkeletonStats />
      <div className="border-b border-line">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <SkeletonSectionHead />
          <SkeletonGrid count={3} />
        </div>
      </div>
    </>
  );
}
