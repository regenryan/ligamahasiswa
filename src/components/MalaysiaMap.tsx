"use client";

import Link from "next/link";
import { useState } from "react";

const CHAPTERS = [
  { slug: "malaysia", name: "Malaysia (National)", cx: 240, cy: 200, color: "#e85d26" },
  { slug: "um", name: "UM", cx: 255, cy: 210, color: "#ff6b35" },
  { slug: "utm", name: "UTM", cx: 220, cy: 230, color: "#ff6b35" },
  { slug: "usm", name: "USM", cx: 260, cy: 245, color: "#ff6b35" },
  { slug: "unisza", name: "UniSZA", cx: 275, cy: 225, color: "#ff6b35" },
  { slug: "utem", name: "SPARC UTeM", cx: 248, cy: 235, color: "#ff6b35" },
];

export function MalaysiaMap() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="relative mx-auto w-full max-w-lg">
      <svg viewBox="0 0 400 350" className="w-full h-auto">
        {/* Simplified Malaysia outline */}
        <g fill="none" stroke="currentColor" strokeWidth="1.5" className="text-ink/20">
          {/* Peninsular Malaysia */}
          <path d="M200,100 L280,120 L290,160 L285,200 L270,240 L250,260 L230,250 L210,260 L200,240 L195,200 L200,160 Z" />
          {/* East Malaysia (simplified) */}
          <path d="M300,140 L350,120 L380,130 L390,160 L370,180 L340,175 L310,165 Z" />
        </g>

        {/* Chapter markers */}
        {CHAPTERS.map((ch) => (
          <g key={ch.slug}>
            <Link href={`/chapters/${ch.slug}`}>
              <circle
                cx={ch.cx}
                cy={ch.cy}
                r={hovered === ch.slug ? 10 : 7}
                fill={ch.color}
                className="cursor-pointer transition-all duration-200"
                onMouseEnter={() => setHovered(ch.slug)}
                onMouseLeave={() => setHovered(null)}
              />
              <text
                x={ch.cx}
                y={ch.cy - 14}
                textAnchor="middle"
                className="fill-ink text-[10px] font-bold uppercase pointer-events-none"
              >
                {ch.name}
              </text>
            </Link>
          </g>
        ))}
      </svg>

      {/* Tooltip */}
      {hovered ? (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 border border-line bg-paper px-4 py-2 text-[13px] font-bold">
          {CHAPTERS.find((c) => c.slug === hovered)?.name}
        </div>
      ) : null}
    </div>
  );
}
