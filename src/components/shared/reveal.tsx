"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

type RevealProps = {
  children: ReactNode;
  /** Delay in seconds. */
  delay?: number;
  /** Distance in pixels the element travels. */
  distance?: number;
  className?: string;
  as?: "div" | "section" | "li" | "article";
};

/**
 * Minimal scroll-reveal wrapper. Animates once when entering the viewport and
 * renders statically for users who prefer reduced motion.
 */
export function Reveal({ children, delay = 0, distance = 18, className, as = "div" }: RevealProps) {
  const reduce = useReducedMotion();
  const Component = motion[as];

  if (reduce) {
    const Static = as;
    return <Static className={className}>{children}</Static>;
  }

  return (
    <Component
      className={className}
      initial={{ opacity: 0, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Component>
  );
}
