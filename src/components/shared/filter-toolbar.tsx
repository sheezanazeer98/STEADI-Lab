"use client";

import { useId, type ReactNode } from "react";
import { ChevronDown, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/* Toolbar shell                                                               */
/* -------------------------------------------------------------------------- */

type FilterToolbarProps = {
  /** Primary controls (search input, selects). */
  children: ReactNode;
  /** Secondary row (chips). */
  secondary?: ReactNode;
  resultCount: number;
  resultLabel: string;
  isFiltered: boolean;
  onReset: () => void;
  className?: string;
};

export function FilterToolbar({
  children,
  secondary,
  resultCount,
  resultLabel,
  isFiltered,
  onReset,
  className,
}: FilterToolbarProps) {
  return (
    <div className={cn("rounded-md border border-border bg-card/70 p-4 sm:p-5", className)}>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">{children}</div>
      {secondary ? <div className="mt-4">{secondary}</div> : null}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3">
        <p className="label-mono text-muted-foreground" role="status" aria-live="polite">
          {resultCount} {resultLabel}
          {isFiltered ? " · filtered" : ""}
        </p>
        {isFiltered ? (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1.5 label-mono text-primary hover:underline"
          >
            <RotateCcw className="size-3" aria-hidden="true" />
            Clear filters
          </button>
        ) : null}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Select                                                                      */
/* -------------------------------------------------------------------------- */

type FilterSelectProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  allLabel?: string;
  className?: string;
};

export function FilterSelect({
  label,
  value,
  onChange,
  options,
  allLabel = `All ${label.toLowerCase()}`,
  className,
}: FilterSelectProps) {
  const id = useId();
  return (
    <div className={cn("relative", className)}>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full appearance-none rounded-md border border-input bg-card pr-9 pl-3.5 text-sm text-foreground focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:outline-none"
      >
        <option value="">{allLabel}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown
        className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Chips                                                                       */
/* -------------------------------------------------------------------------- */

type FilterChipsProps = {
  label: string;
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
  className?: string;
};

export function FilterChips({ label, options, selected, onToggle, className }: FilterChipsProps) {
  if (options.length === 0) return null;
  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)} role="group" aria-label={label}>
      <span className="mr-1 label-mono text-muted-foreground">{label}</span>
      {options.map((option) => {
        const active = selected.includes(option);
        return (
          <button
            key={option}
            type="button"
            aria-pressed={active}
            onClick={() => onToggle(option)}
            className={cn(
              "rounded-md border px-2.5 py-1 text-xs font-medium transition-colors",
              active
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background text-foreground/80 hover:border-primary/60 hover:text-foreground",
            )}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Segmented control (sort / view)                                             */
/* -------------------------------------------------------------------------- */

type SegmentedProps<T extends string> = {
  label: string;
  value: T;
  onChange: (value: T) => void;
  options: Array<{ value: T; label: ReactNode; title?: string }>;
  className?: string;
};

export function Segmented<T extends string>({
  label,
  value,
  onChange,
  options,
  className,
}: SegmentedProps<T>) {
  return (
    <div
      role="group"
      aria-label={label}
      className={cn("inline-flex h-11 shrink-0 rounded-md border border-input bg-card p-1", className)}
    >
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            title={option.title}
            onClick={() => onChange(option.value)}
            className={cn(
              "inline-flex min-w-9 items-center justify-center gap-1.5 rounded-sm px-3 text-xs font-semibold transition-colors",
              active ? "bg-foreground text-background" : "text-foreground/75 hover:text-foreground",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
