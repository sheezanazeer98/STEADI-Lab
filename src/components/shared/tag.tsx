import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Tone = "neutral" | "accent" | "outline" | "success" | "warning" | "muted";

const tones: Record<Tone, string> = {
  neutral: "border-border bg-muted text-foreground",
  accent: "border-primary/50 bg-primary/10 text-primary",
  outline: "border-border bg-transparent text-foreground/80",
  success: "border-emerald-700/30 bg-emerald-600/10 text-emerald-800 dark:text-emerald-300",
  warning: "border-amber-700/30 bg-amber-500/10 text-amber-800 dark:text-amber-300",
  muted: "border-transparent bg-transparent text-muted-foreground",
};

type TagProps = {
  children: ReactNode;
  tone?: Tone;
  mono?: boolean;
  className?: string;
};

export function Tag({ children, tone = "neutral", mono = true, className }: TagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-sm border px-2 py-0.5 whitespace-nowrap",
        mono ? "label-mono" : "text-xs font-medium",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Maps content statuses to a consistent tone. */
export function statusTone(status: string): Tone {
  switch (status) {
    case "Ongoing":
    case "Active":
    case "Released":
    case "Published":
    case "Open":
    case "Scheduled":
      return "success";
    case "Proposed":
    case "Planned":
    case "Concept":
    case "Under Review":
    case "Working Paper":
    case "Postponed":
    case "Rolling":
      return "warning";
    case "Completed":
    case "Archived":
    case "Closed":
    case "Cancelled":
      return "muted";
    default:
      return "neutral";
  }
}

export function StatusTag({ status, className }: { status: string; className?: string }) {
  return (
    <Tag tone={statusTone(status)} className={className}>
      <span
        aria-hidden="true"
        className={cn(
          "size-1.5 rounded-full",
          statusTone(status) === "success"
            ? "bg-emerald-600"
            : statusTone(status) === "warning"
              ? "bg-amber-500"
              : "bg-current opacity-60",
        )}
      />
      {status}
    </Tag>
  );
}
