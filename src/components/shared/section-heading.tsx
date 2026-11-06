import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  /** Small mono label rendered above the title (e.g. "02 — Research"). */
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  /** Optional element rendered opposite the heading (e.g. a "View all" link). */
  action?: ReactNode;
  as?: "h1" | "h2" | "h3";
  size?: "md" | "lg" | "xl";
  className?: string;
};

const sizes = {
  md: "text-2xl sm:text-3xl",
  lg: "text-3xl sm:text-4xl lg:text-[2.75rem]",
  xl: "text-4xl sm:text-5xl lg:text-6xl",
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  action,
  as: Heading = "h2",
  size = "lg",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between",
        align === "center" && "items-center text-center sm:flex-col sm:items-center",
        className,
      )}
    >
      <div className={cn("max-w-2xl", align === "center" && "mx-auto")}>
        {eyebrow ? <p className="mb-3 label-mono text-primary">{eyebrow}</p> : null}
        <Heading className={cn("display-text", sizes[size])}>{title}</Heading>
        {description ? (
          <div className="mt-4 text-base leading-relaxed text-ink-soft sm:text-lg">{description}</div>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
