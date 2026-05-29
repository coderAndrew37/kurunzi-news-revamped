// lib/animations.ts
import { Variants } from "framer-motion";

/**
 * Editorial Spring/Easing Curve
 * Starts incredibly fast to maintain high visual performance, 
 * then smooths out gracefully right at the end of the transition track.
 */
export const EDITORIAL_EASE = [0.16, 1, 0.3, 1];

/**
 * 1. Simple Fade In
 * Great for backgrounds, structural borders, or subtle overlays.
 */
export const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: "linear",
    },
  },
};

/**
 * 2. Slide-In Up + Fade (Scroll to Reveal Lead)
 * The definitive standard for news cards and text headlines. 
 * Snaps up slightly from the bottom as it finishes painting.
 */
export const fadeInUpVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: 16 
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: EDITORIAL_EASE,
    },
  },
};

/**
 * 3. Slide-In From Left/Right
 * Perfect for slide-out mobile navigation drawers, clean notification panels, 
 * or off-screen filter trays.
 */
export const slideInLeftVariants: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
      ease: EDITORIAL_EASE,
    },
  },
};

export const slideInRightVariants: Variants = {
  hidden: { opacity: 0, x: 30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
      ease: EDITORIAL_EASE,
    },
  },
};

/**
 * 4. Parent Stagger Orchestration Container
 * Add this to a layout grid or wrapper container. It automatically intercepts 
 * any child elements using 'fadeInUpVariants' or 'slideInVariants' and cascades 
 * their entrances smoothly like a waterfall.
 */
export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05, // Fast 50ms interval drop between consecutive cards
      delayChildren: 0.02,
    },
  },
};

/**
 * 5. Micro Hover Scale for Editorial Images
 * Keeps image container bounds alive when a user focuses a card link track.
 */
export const imageHoverProps = {
  whileHover: { scale: 1.025 },
  transition: { duration: 0.4, ease: EDITORIAL_EASE }
};