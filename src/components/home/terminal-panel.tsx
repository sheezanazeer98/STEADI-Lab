"use client";

import { motion, useReducedMotion } from "motion/react";
import { TargetMarker } from "@/components/shared/backdrop";

type Line = {
  index: string;
  text: string;
  done?: boolean;
  accent?: boolean;
};

const lines: Line[] = [
  { index: "01", text: "initializing trustworthy intelligence..." },
  { index: "02", text: "verifying smart contracts", done: true },
  { index: "03", text: "anchoring provenance on ledger", done: true },
  { index: "04", text: "coordinating bounded agents", done: true },
  { index: "05", text: "research → build → verify → deploy", accent: true },
];

const binaryRows = ["010 011 001 101 110 010 001 111 010", "011 010 101 100 001 110 011 001 110"];

type TerminalPanelProps = {
  title?: string;
  version?: string;
};

export function TerminalPanel({ title = "STEADI pipeline", version = "v0.1" }: TerminalPanelProps) {
  const reduce = useReducedMotion();

  return (
    <div className="relative overflow-hidden rounded-md bg-panel text-panel-foreground shadow-(--shadow-card-lg)">
      <div className="flex items-center justify-between border-b border-panel-muted/30 px-6 py-3.5">
        <span className="label-mono">{title}</span>
        <span className="label-mono text-primary">{version}</span>
      </div>
      <div className="relative min-h-[320px] px-6 py-8 sm:px-10 sm:py-10">
        <TargetMarker pulse className="absolute top-10 right-10 hidden size-8 sm:inline-flex" />
        <ol className="space-y-3 font-mono text-sm sm:text-[15px]">
          {lines.map((line, index) => (
            <motion.li
              key={line.index}
              initial={reduce ? false : { opacity: 0, x: -6 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ delay: reduce ? 0 : 0.25 + index * 0.35, duration: 0.3 }}
              className={line.accent ? "text-primary" : undefined}
            >
              <span className="mr-4 text-panel-muted">{line.index}</span>
              {line.text}
              {line.done ? <span className="ml-2 text-panel-muted">✓</span> : null}
              {line.accent ? (
                <span
                  className="ml-1 inline-block h-[1em] w-[0.55em] translate-y-0.5 animate-blink bg-primary"
                  aria-hidden="true"
                />
              ) : null}
            </motion.li>
          ))}
        </ol>
        <div
          aria-hidden="true"
          className="absolute right-4 bottom-4 hidden space-y-1 text-right label-mono text-primary/70 normal-case sm:block"
        >
          {binaryRows.map((row) => (
            <p key={row}>{row}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
