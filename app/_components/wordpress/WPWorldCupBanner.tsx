"use client";

// app/_components/wordpress/WPWorldCupBanner.tsx
// Editorial promo strip on the homepage linking to /world-cup.
// Bold, stadium-atmosphere aesthetic: dark pitch background, diagonal
// stripe accents, countdown to the tournament, and a strong CTA.

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Trophy } from "lucide-react";

// FIFA World Cup 2026 kicks off June 11, 2026 (USA/Canada/Mexico)
const WORLD_CUP_DATE = new Date("2026-06-11T00:00:00Z");

function useCountdown(target: Date) {
  const calc = () => {
    const diff = target.getTime() - Date.now();
    if (diff <= 0)
      return { days: 0, hours: 0, minutes: 0, seconds: 0, started: true };
    return {
      days: Math.floor(diff / 86_400_000),
      hours: Math.floor((diff % 86_400_000) / 3_600_000),
      minutes: Math.floor((diff % 3_600_000) / 60_000),
      seconds: Math.floor((diff % 60_000) / 1_000),
      started: false,
    };
  };

  const [time, setTime] = useState(calc);

  useEffect(() => {
    const id = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(id);
  }, []);

  return time;
}

function Pad(n: number) {
  return String(n).padStart(2, "0");
}

export default function WorldCupBanner() {
  const { days, hours, minutes, seconds, started } =
    useCountdown(WORLD_CUP_DATE);

  return (
    <Link href="/world-cup" className="block group focus:outline-none">
      <div
        className="relative w-full overflow-hidden"
        style={{ background: "#0a0f1a" }}
      >
        {/* ── Pitch texture: subtle green diagonal stripes ──────────────────── */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: `repeating-linear-gradient(
              -55deg,
              #22c55e 0px,
              #22c55e 24px,
              transparent 24px,
              transparent 48px
            )`,
          }}
          aria-hidden
        />

        {/* ── Red accent bar top ────────────────────────────────────────────── */}
        <div
          className="absolute top-0 left-0 right-0 h-[3px] bg-[#dc2626]"
          aria-hidden
        />

        {/* ── Globe grid overlay ────────────────────────────────────────────── */}
        <div
          className="absolute right-0 top-0 bottom-0 w-1/2 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 70% 50%, #ffffff 0%, transparent 70%)`,
          }}
          aria-hidden
        />

        {/* ── Content ───────────────────────────────────────────────────────── */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Left: Identity */}
            <div className="flex items-center gap-4">
              {/* Trophy icon with glow */}
              <div className="relative flex-shrink-0">
                <div
                  className="absolute inset-0 bg-yellow-400 blur-xl opacity-30 rounded-full"
                  aria-hidden
                />
                <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 flex items-center justify-center shadow-lg">
                  <Trophy size={20} className="text-yellow-900" />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#dc2626] font-['Barlow_Condensed']">
                    FIFA
                  </span>
                  <span className="w-px h-3 bg-white/20" aria-hidden />
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-white/40 font-['Barlow_Condensed']">
                    USA · Canada · Mexico
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-black uppercase tracking-tight text-white font-['Barlow_Condensed'] leading-none">
                  World Cup <span className="text-[#dc2626]">2026</span>
                </h2>
                <p className="text-[12px] text-white/50 mt-1 font-['Source_Serif_4'] italic">
                  {started
                    ? "The tournament is underway — follow every match"
                    : "The biggest football event on the planet is coming"}
                </p>
              </div>
            </div>

            {/* Right: Countdown + CTA */}
            <div className="flex items-center gap-5 sm:gap-6">
              {/* Countdown */}
              {!started ? (
                <div className="flex items-end gap-2">
                  {[
                    { value: days, label: "Days" },
                    { value: hours, label: "Hrs" },
                    { value: minutes, label: "Min" },
                    { value: seconds, label: "Sec" },
                  ].map(({ value, label }, i) => (
                    <div key={label} className="flex items-end gap-2">
                      {i > 0 && (
                        <span
                          className="text-white/20 text-lg font-black leading-none mb-3"
                          aria-hidden
                        >
                          :
                        </span>
                      )}
                      <div className="flex flex-col items-center">
                        <span className="text-2xl sm:text-3xl font-black tabular-nums text-white font-['Barlow_Condensed'] leading-none">
                          {Pad(value)}
                        </span>
                        <span className="text-[8px] font-bold uppercase tracking-widest text-white/30 font-['Barlow_Condensed'] mt-0.5">
                          {label}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <span className="text-sm font-bold text-green-400 font-['Barlow_Condensed'] uppercase tracking-widest animate-pulse">
                  Live Now
                </span>
              )}

              {/* CTA button */}
              <div className="flex-shrink-0">
                <span className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#dc2626] text-white text-[12px] font-black uppercase tracking-widest font-['Barlow_Condensed'] group-hover:bg-red-500 transition-colors rounded-sm shadow-lg shadow-red-900/30">
                  Full Coverage
                  <ArrowRight
                    size={13}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Bottom accent ──────────────────────────────────────────────────── */}
        <div
          className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
          aria-hidden
        />
      </div>
    </Link>
  );
}
