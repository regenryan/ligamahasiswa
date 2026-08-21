type MarqueeProps = {
  items: string[];
  className?: string;
  sep?: string;
};

export function Marquee({ items, className = "", sep = "\u2022" }: MarqueeProps) {
  const row = (key: string) => (
    <div key={key} className="flex shrink-0 items-center" aria-hidden={key === "b"}>
      {items.map((item, i) => (
        <span key={`${key}-${i}`} className="flex items-center whitespace-nowrap">
          <span className="px-4">{item}</span>
          <span className="text-[0.7em] opacity-60">{sep}</span>
        </span>
      ))}
    </div>
  );
  return (
    <div className={`overflow-hidden ${className}`}>
      <div className="marquee-track">
        {row("a")}
        {row("b")}
      </div>
    </div>
  );
}