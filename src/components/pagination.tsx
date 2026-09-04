"use client";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages: (number | "...")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push("...");
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
  }

  return (
    <nav aria-label="Pagination" className="mt-8 flex items-center justify-center gap-1">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 text-[12px] font-bold uppercase tracking-[0.1em] text-ink/50 hover:text-ink disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        aria-label="Previous page"
      >
        {"\u2190"}
      </button>
      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`dots-${i}`} className="px-2 text-[12px] text-ink/30">
            ...
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            aria-current={p === currentPage ? "page" : undefined}
            className={`min-w-[32px] px-3 py-2 text-[12px] font-bold transition-colors ${
              p === currentPage
                ? "border border-brand bg-brand text-paper"
                : "border border-line bg-cream text-ink/60 hover:border-ink hover:text-ink"
            }`}
          >
            {p}
          </button>
        )
      )}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 text-[12px] font-bold uppercase tracking-[0.1em] text-ink/50 hover:text-ink disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        aria-label="Next page"
      >
        {"\u2192"}
      </button>
    </nav>
  );
}

const ITEMS_PER_PAGE = 12;

export function paginate<T>(items: T[], page: number): { items: T[]; totalPages: number } {
  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);
  const start = (page - 1) * ITEMS_PER_PAGE;
  return {
    items: items.slice(start, start + ITEMS_PER_PAGE),
    totalPages,
  };
}
