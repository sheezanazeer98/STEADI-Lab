import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { FolderOpen } from "lucide-react";
import { cn } from "@/lib/utils";

type EmptyStateProps = {
  title: string;
  description?: ReactNode;
  icon?: LucideIcon;
  /** Call-to-action buttons or links. */
  actions?: ReactNode;
  /** Technical hint for maintainers, e.g. the folder to add content to. */
  hint?: string;
  className?: string;
};

export function EmptyState({
  title,
  description,
  icon: Icon = FolderOpen,
  actions,
  hint,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-md border border-dashed border-border bg-card/60 px-6 py-14 text-center sm:px-10",
        className,
      )}
    >
      <div aria-hidden="true" className="absolute inset-0 blueprint-grid-sm opacity-60" />
      <div className="relative mx-auto max-w-md">
        <span className="mx-auto flex size-12 items-center justify-center rounded-md border border-primary/40 bg-background text-primary">
          <Icon className="size-5" aria-hidden="true" />
        </span>
        <h3 className="mt-5 text-xl font-extrabold tracking-tight">{title}</h3>
        {description ? <p className="mt-2 text-sm leading-relaxed text-ink-soft">{description}</p> : null}
        {actions ? <div className="mt-6 flex flex-wrap justify-center gap-3">{actions}</div> : null}
        {hint ? (
          <p className="mt-6 label-mono text-muted-foreground normal-case">
            Add entries in <code className="text-foreground">{hint}</code>
          </p>
        ) : null}
      </div>
    </div>
  );
}
