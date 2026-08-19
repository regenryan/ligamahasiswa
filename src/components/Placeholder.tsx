import type { CSSProperties } from "react";

type PlaceholderProps = {
  ratio: string;
  caption: string;
  className?: string;
  label?: string;
  style?: CSSProperties;
};

export function Placeholder({
  ratio,
  caption,
  className = "",
  label = "mock image",
  style,
}: PlaceholderProps) {
  return (
    <figure
      className={`ph relative overflow-hidden border border-ink/15 bg-ink/[0.06] ${className}`}
      style={{ aspectRatio: ratio, ...style }}
    >
      <div aria-hidden="true" className="halftone absolute inset-0 opacity-40" />
      <figcaption className="absolute inset-0 flex items-center justify-center px-5 text-center text-[11px] leading-relaxed text-ink/55">
        {caption}
      </figcaption>
      <span className="absolute left-2 top-2 bg-paper/90 px-2 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-ink/70">
        {label}
      </span>
    </figure>
  );
}
