import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SectionProps = {
  children: ReactNode;
  id?: string;
  className?: string;
  /** Tighter vertical rhythm for stacked sections. */
  spacing?: "sm" | "md" | "lg";
  /** Render with the narrow reading container. */
  narrow?: boolean;
  bleed?: boolean;
  "aria-labelledby"?: string;
};

const spacings = {
  sm: "py-10 sm:py-14",
  md: "py-16 sm:py-20",
  lg: "py-20 sm:py-28",
};

export function Section({
  children,
  id,
  className,
  spacing = "md",
  narrow = false,
  bleed = false,
  ...rest
}: SectionProps) {
  return (
    <section id={id} className={cn(spacings[spacing], className)} {...rest}>
      {bleed ? children : <div className={narrow ? "container-narrow" : "container-wide"}>{children}</div>}
    </section>
  );
}
