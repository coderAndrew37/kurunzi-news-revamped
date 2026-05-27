"use client"
export default function AdPlaceholder({ label }: { label: string }) {
  return (
    <div className="w-full border-y" style={{ borderColor: "var(--rule)", background: "var(--paper-warm)" }}>
      <div className="max-w-[1140px] mx-auto px-4 sm:px-6 py-3">
        {/* Subtle, uppercase label */}
        <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-center mb-2 animate-pulse" style={{ color: "var(--ink-faint)" }}>
          {label || "Advertisement"}
        </p>
        
        {/* Clean, borderless shimmering slot that matches your screenshot layout */}
        <div
          className="relative w-full h-[90px] rounded overflow-hidden"
          style={{ background: "var(--paper)" }}
        >
          {/* Shimmer overlay element */}
          <div 
            className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite]
                       bg-gradient-to-r from-transparent via-white/20 to-transparent"
          />
        </div>
      </div>
    </div>
  );
}