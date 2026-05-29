"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { staggerContainerVariants, fadeInUpVariants } from "@/lib/animations";

interface HomePageClientProps {
  ticker: ReactNode;
  hero: ReactNode;
  sections: Array<{
    slug: string;
    render: ReactNode;
  }>;
}

export default function HomePageClient({ ticker, hero, sections }: HomePageClientProps) {
  return (
    <main
      className="flex flex-col gap-0 pb-20 overflow-x-hidden"
      style={{ background: "var(--paper)" }}
    >
      {/* Structural Headers fit directly into the frame */}
      {ticker}
      {hero}

      {/* Categories stream down dynamically with scroll viewport triggers */}
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
              once: true,      // Keeps the DOM structure stable once rendered
              margin: "-60px"  // Fires right before crossing layout rows for a premium look
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