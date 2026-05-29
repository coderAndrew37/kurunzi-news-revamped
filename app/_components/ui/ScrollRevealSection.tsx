"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { fadeInUpVariants } from "@/lib/animations";

interface ScrollRevealSectionProps {
  children: ReactNode;
}

export default function ScrollRevealSection({ children }: ScrollRevealSectionProps) {
  return (
    <motion.div
      variants={fadeInUpVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ 
        once: true,      // Keeps layout solid once it reveals
        margin: "-80px"  // Triggers slightly before crossing the visible viewport for premium execution
      }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
}