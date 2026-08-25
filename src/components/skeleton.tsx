const BAR = "animate-pulse bg-cream border border-line";

export function SkeletonLine({ w = "w-3/4" }: { w?: string }) {
  return <div className={`h-4 ${w} ${BAR}`} />;
}

export function SkeletonCard() {
  return (
    <div className={`flex flex-col gap-3 p-6 ${BAR}`}>
      <div className="flex gap-2">
        <div className={`h-4 w-16 ${BAR}`} />
        <div className={`h-4 w-12 ${BAR}`} />
      </div>
      <div className={`h-5 w-2/3 ${BAR}`} />
      <div className={`h-3 w-full ${BAR}`} />
      <div className={`h-3 w-5/6 ${BAR}`} />
      <div className="mt-2 border-t border-line pt-3">
        <div className={`h-8 w-24 ${BAR}`} />
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 3 }: { count?: number }) {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: count }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
}
