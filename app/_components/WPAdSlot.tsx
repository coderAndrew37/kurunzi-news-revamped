"use client";

import { useEffect, useRef, useState } from "react";

const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

interface AdSlotProps {
  slotId: string;
  className?: string;
  format?: "auto" | "fluid" | "rectangle" | "horizontal";
}

export default function AdSlot({ slotId, className = "", format = "auto" }: AdSlotProps) {
  const insRef = useRef<HTMLModElement>(null);
  const [filled, setFilled] = useState(true);
  const canRender = Boolean(ADSENSE_CLIENT) && Boolean(slotId);

  useEffect(() => {
    if (!canRender) return;

    try {
      // adsbygoogle is injected globally by the AdSense loader script in layout.tsx.
      (window as unknown as { adsbygoogle: unknown[] }).adsbygoogle =
        (window as unknown as { adsbygoogle: unknown[] }).adsbygoogle || [];
      (window as unknown as { adsbygoogle: unknown[] }).adsbygoogle.push({});
    } catch {
      // Defer the state change to the next event loop tick to avoid cascading renders
      setTimeout(() => {
        setFilled(false);
      }, 0);
      return;
    }

    const el = insRef.current;
    // Google sets data-ad-status="unfilled" on the <ins> tag asynchronously,
    // once it determines there is no ad to serve. Give it a moment, then check.
    const timer = setTimeout(() => {
      if (el?.getAttribute("data-ad-status") === "unfilled") {
        setFilled(false);
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [canRender, slotId]);

  if (!canRender || !filled) return null;

  return (
    <div className={`w-full overflow-hidden ${className}`}>
      <span className="block text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-1.5">
        Advertisement
      </span>
      <ins
        ref={insRef}
        className="adsbygoogle block"
        style={{ display: "block" }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slotId}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}