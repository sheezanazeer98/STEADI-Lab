"use client";

import { useEffect, useState } from "react";
import { Check, Copy, Quote } from "lucide-react";
import { cn } from "@/lib/utils";

type CitationActionsProps = {
  bibtex: string;
  citation: string;
  className?: string;
};

type CopyState = "idle" | "copied" | "error";

function useCopy(): [CopyState, (text: string) => Promise<void>] {
  const [state, setState] = useState<CopyState>("idle");

  useEffect(() => {
    if (state === "idle") return;
    const timeout = window.setTimeout(() => setState("idle"), 2200);
    return () => window.clearTimeout(timeout);
  }, [state]);

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setState("copied");
    } catch {
      setState("error");
    }
  };

  return [state, copy];
}

function CopyButton({ label, text, icon: Icon }: { label: string; text: string; icon: typeof Copy }) {
  const [state, copy] = useCopy();
  return (
    <button
      type="button"
      onClick={() => copy(text)}
      className={cn(
        "inline-flex h-10 items-center gap-2 rounded-md border border-border bg-card px-4 text-sm font-semibold transition-colors hover:border-primary hover:text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
        state === "copied" && "border-emerald-600/50 text-emerald-700 dark:text-emerald-300",
        state === "error" && "border-destructive text-destructive",
      )}
    >
      {state === "copied" ? (
        <Check className="size-4" aria-hidden="true" />
      ) : (
        <Icon className="size-4" aria-hidden="true" />
      )}
      {state === "copied" ? "Copied" : state === "error" ? "Copy failed" : label}
    </button>
  );
}

export function CitationActions({ bibtex, citation, className }: CitationActionsProps) {
  return (
    <div className={className}>
      <div className="flex flex-wrap gap-2">
        <CopyButton label="Copy BibTeX" text={bibtex} icon={Copy} />
        <CopyButton label="Copy citation" text={citation} icon={Quote} />
      </div>
      <pre
        className="mt-4 overflow-x-auto rounded-md bg-panel p-4 font-mono text-xs leading-relaxed text-panel-foreground"
        tabIndex={0}
        aria-label="BibTeX record"
      >
        {bibtex}
      </pre>
      <p role="status" aria-live="polite" className="sr-only" />
    </div>
  );
}
