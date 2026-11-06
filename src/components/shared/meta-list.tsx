import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type MetaItem = {
  label: string;
  value: ReactNode;
};

type MetaListProps = {
  /** Falsy entries are skipped, so items can be written as `value && { … }`. */
  items: Array<MetaItem | null | undefined | false | "" | 0>;
  className?: string;
  /** Lay items out as columns on wide screens. */
  columns?: 1 | 2;
};

/** Definition list for metadata blocks (publication details, project facts…). */
export function MetaList({ items, className, columns = 1 }: MetaListProps) {
  const visible = items.filter((item): item is MetaItem => Boolean(item));
  if (visible.length === 0) return null;
  return (
    <dl
      className={cn(
        "divide-y divide-border rounded-md border border-border",
        columns === 2 && "sm:grid sm:grid-cols-2 sm:divide-y-0",
        className,
      )}
    >
      {visible.map((item) => (
        <div
          key={item.label}
          className={cn(
            "flex flex-col gap-1 px-4 py-3 sm:flex-row sm:gap-4",
            columns === 2 && "sm:flex-col sm:gap-1 sm:border-b sm:border-border sm:odd:border-r",
          )}
        >
          <dt className="shrink-0 label-mono text-muted-foreground sm:w-32 sm:pt-0.5">{item.label}</dt>
          <dd className="min-w-0 text-sm leading-relaxed break-words text-foreground">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

type BulletListProps = {
  items: string[];
  className?: string;
  numbered?: boolean;
};

export function BulletList({ items, className, numbered = false }: BulletListProps) {
  if (items.length === 0) return null;
  return (
    <ul className={cn("space-y-3", className)}>
      {items.map((item, index) => (
        <li key={item} className="flex gap-3 text-sm leading-relaxed">
          <span className="mt-1 w-6 shrink-0 label-mono text-primary">
            {numbered ? String(index + 1).padStart(2, "0") : "—"}
          </span>
          <span className="text-ink-soft">{item}</span>
        </li>
      ))}
    </ul>
  );
}
