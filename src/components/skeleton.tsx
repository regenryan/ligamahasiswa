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

export function SkeletonSectionHead() {
  return (
    <div className="mb-8">
      <div className={`h-3 w-20 ${BAR}`} />
      <div className={`mt-3 h-6 w-48 ${BAR}`} />
      <div className={`mt-2 h-4 w-72 ${BAR}`} />
    </div>
  );
}

export function SkeletonStats() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className={`px-4 py-5 sm:px-6 ${BAR}`}>
            <div className={`h-8 w-12 ${BAR}`} style={{ border: "none" }} />
            <div className={`mt-2 h-3 w-16 ${BAR}`} style={{ border: "none" }} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonDetail() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
      <div className={`mb-8 h-3 w-32 ${BAR}`} />
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2 space-y-3">
          <div className={`h-4 w-full ${BAR}`} />
          <div className={`h-4 w-5/6 ${BAR}`} />
          <div className={`h-4 w-4/6 ${BAR}`} />
        </div>
        <div className={`p-5 ${BAR}`}>
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i}>
                <div className={`h-3 w-12 ${BAR}`} style={{ border: "none" }} />
                <div className={`mt-1 h-4 w-24 ${BAR}`} style={{ border: "none" }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function SkeletonForm() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-lg space-y-6">
        <div className={`h-6 w-48 ${BAR}`} />
        <div className={`h-4 w-72 ${BAR}`} />
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i}>
            <div className={`mb-2 h-3 w-20 ${BAR}`} />
            <div className={`h-10 w-full ${BAR}`} />
          </div>
        ))}
        <div className={`h-10 w-32 ${BAR}`} />
      </div>
    </div>
  );
}
