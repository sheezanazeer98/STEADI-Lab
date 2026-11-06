import Link from "next/link";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

type LogoMarkProps = {
  className?: string;
};

/**
 * Original STEADI Lab mark: a bounded frame holding three linked nodes, a nod
 * to networks and ledgers. Replace this component (and public/logos) to change
 * the brand without touching layouts.
 */
export function LogoMark({ className }: LogoMarkProps) {
  return (
    <svg viewBox="0 0 32 32" className={cn("size-7", className)} aria-hidden="true" focusable="false">
      <rect x="2" y="2" width="28" height="28" rx="7" fill="none" stroke="currentColor" strokeWidth="2" />
      <path
        d="M10.5 21.5 L16 10.5 L21.5 21.5 Z"
        fill="none"
        stroke="var(--primary)"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <circle cx="16" cy="10.5" r="2.7" fill="var(--primary)" />
      <circle cx="10.5" cy="21.5" r="2.7" fill="currentColor" />
      <circle cx="21.5" cy="21.5" r="2.7" fill="currentColor" />
    </svg>
  );
}

type LogoProps = {
  className?: string;
  /** Render the mark only. */
  compact?: boolean;
};

export function Logo({ className, compact = false }: LogoProps) {
  return (
    <Link
      href="/"
      className={cn(
        "inline-flex items-center gap-2.5 rounded-sm text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
        className,
      )}
      aria-label={`${siteConfig.name} home`}
    >
      <LogoMark />
      {compact ? null : (
        <span className="font-heading text-[1.05rem] leading-none font-extrabold tracking-tight">
          {siteConfig.shortName}
          <span className="text-primary"> Lab</span>
        </span>
      )}
    </Link>
  );
}
