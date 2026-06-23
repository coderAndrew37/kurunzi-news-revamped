"use client";

// app/HomepageClient.tsx
// Same stagger/fade-in-on-scroll pattern as before — just two new fixed slots
// (liveScores, topAd) added alongside ticker/hero, and "sections" now carries
// whatever ordered mix of category grids, the media band, and ad slots
// page.tsx decided on. This component doesn't need to know which is which.

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { staggerContainerVariants, fadeInUpVariants } from "@/lib/animations";

interface HomePageClientProps {
  ticker: ReactNode;
  hero: ReactNode;
  liveScores: ReactNode;
  topAd?: ReactNode;
  sections: Array<{
    slug: string;
    render: ReactNode;
  }>;
}

export default function HomePageClient({
  ticker,
  hero,
  liveScores,
  topAd,
  sections,
}: HomePageClientProps) {
  return (
    <main
      className="flex flex-col gap-0 pb-20 overflow-x-hidden"
      style={{ background: "var(--paper)" }}
    >
      {/* Structural headers fit directly into the frame */}
      {ticker}
      {hero}
      {liveScores}
      {topAd}

      {/* Feed blocks stream down dynamically with scroll viewport triggers */}
      <motion.div
        variants={staggerContainerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col gap-0"
      >
        {sections.map((section) => (
          <motion.div
            key={section.slug}
            variants={fadeInUpVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true, // Keeps the DOM structure stable once rendered
              margin: "-60px", // Fires right before crossing layout rows for a premium look
            }}
            className="w-full"
          >
            {section.render}
          </motion.div>
        ))}
      </motion.div>
    </main>
  );
}