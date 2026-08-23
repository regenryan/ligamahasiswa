"use client";

import { useZineModal } from "@/components/zine-submit-modal";

export function ZineSubmitButton() {
  const { openModal } = useZineModal();

  return (
    <button
      type="button"
      onClick={() => openModal()}
      className="group flex w-full items-center justify-between border border-line bg-cream px-5 py-4 text-left hover:border-brand hover:bg-brand/5 transition-colors"
    >
      <div>
        <p className="text-[15px] font-bold">Submit to zine</p>
        <p className="mono text-[12px] text-ink/50">Contribute an article or artwork</p>
      </div>
      <span className="mono text-[12px] text-ink/30 group-hover:text-brand transition-colors">{"\u2192"}</span>
    </button>
  );
}
