"use client";

import { useState } from "react";

export function ShareKit({
  title,
  url,
  hashtags = ["LigaMahasiswa", "MansuhAUKU"],
}: {
  title: string;
  url: string;
  hashtags?: string[];
}) {
  const [copied, setCopied] = useState(false);
  const hashtagStr = hashtags.map((h) => `#${h}`).join(" ");
  const text = `${title} ${hashtagStr}`;
  const encodedText = encodeURIComponent(text);
  const encodedUrl = encodeURIComponent(url);

  const shareLinks = [
    {
      name: "X / Twitter",
      href: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
    },
    {
      name: "WhatsApp",
      href: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
    },
    {
      name: "Telegram",
      href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
    },
  ];

  const copyCaption = async () => {
    try {
      await navigator.clipboard.writeText(`${text} ${url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="border border-line bg-cream p-4">
      <p className="mono text-[11px] uppercase tracking-[0.14em] text-ink/50">
        Share this
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {shareLinks.map((link) => (
          <a
            key={link.name}
            href={link.href}
            target="_blank"
            rel="noreferrer"
            className="press border border-line px-3 py-2 text-[12px] font-bold uppercase tracking-[0.1em] text-ink/70 hover:border-ink hover:text-brand transition-colors"
          >
            {link.name}
          </a>
        ))}
        <button
          type="button"
          onClick={copyCaption}
          className="press border border-line px-3 py-2 text-[12px] font-bold uppercase tracking-[0.1em] text-ink/70 hover:border-ink hover:text-brand transition-colors"
        >
          {copied ? "Copied!" : "Copy caption"}
        </button>
      </div>
    </div>
  );
}
