import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ResearchIcon } from "@/components/research/research-icon";
import { StatusTag } from "@/components/shared/tag";
import { padIndex } from "@/lib/format";
import type { ResearchArea } from "@/types/content";
import { cn } from "@/lib/utils";

type ResearchAreaCardProps = {
  area: ResearchArea;
  index: number;
  /** Optional counts shown in the card footer. */
  counts?: { projects: number; publications: number };
  className?: string;
};

export function ResearchAreaCard({ area, index, counts, className }: ResearchAreaCardProps) {
  return (
    <Link
      href={`/research/${area.slug}`}
      className={cn(
        "group relative flex h-full flex-col rounded-md border border-border bg-card p-6 transition-all hover:border-primary hover:shadow-(--shadow-card) focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <span className="flex size-11 items-center justify-center rounded-md border border-border bg-background text-primary transition-colors group-hover:border-primary">
          <ResearchIcon name={area.icon} />
        </span>
        <span className="label-mono text-muted-foreground">{padIndex(index)}</span>
      </div>
      <h3 className="mt-5 text-lg leading-snug font-extrabold tracking-tight">{area.title}</h3>
      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink-soft">{area.summary}</p>
      {area.keywords.length ? (
        <p className="mt-4 label-mono tracking-normal text-muted-foreground normal-case">
          {area.keywords.slice(0, 3).join(" · ")}
        </p>
      ) : null}
      <div className="mt-auto flex items-center justify-between gap-3 border-t border-border pt-4">
        <StatusTag status={area.status} />
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary">
          {counts ? `${counts.projects} proj · ${counts.publications} pub` : "Explore"}
          <ArrowUpRight
            className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            aria-hidden="true"
          />
        </span>
      </div>
    </Link>
  );
}
