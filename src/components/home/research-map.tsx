import Link from "next/link";
import { TargetMarker } from "@/components/shared/backdrop";

type Stage = {
  index: string;
  title: string;
  descriptors: string;
  /** Slug of the research area this stage links to. */
  area: string;
};

const stages: Stage[] = [
  {
    index: "01",
    title: "Data",
    descriptors: "provenance · integrity · lineage",
    area: "data-integrity-provenance-decision-support",
  },
  {
    index: "02",
    title: "Models",
    descriptors: "learning · reasoning · robustness",
    area: "artificial-intelligence-machine-learning",
  },
  {
    index: "03",
    title: "Agents",
    descriptors: "planning · tools · coordination",
    area: "agentic-ai-multi-agent-systems",
  },
  {
    index: "04",
    title: "Ledger",
    descriptors: "consensus · contracts · verification",
    area: "blockchain-distributed-ledger-technology",
  },
  {
    index: "05",
    title: "Oversight",
    descriptors: "governance · audit · decisions",
    area: "ai-governance-human-oversight",
  },
];

const WIDTH = 1200;
const HEIGHT = 440;

function wavePath(amplitude: number, phase: number): string {
  const points: string[] = [];
  for (let x = 40; x <= WIDTH - 40; x += 8) {
    const t = ((x - 40) / (WIDTH - 80)) * Math.PI * 3 + phase;
    const y = HEIGHT / 2 + Math.sin(t) * amplitude;
    points.push(`${x},${y.toFixed(1)}`);
  }
  return `M${points.join(" L")}`;
}

const binaryTags = [
  { x: 262, y: 206, text: "0101" },
  { x: 570, y: 236, text: "001" },
  { x: 846, y: 250, text: "11010" },
];

/** Blueprint-style map of the lab's research pipeline. */
export function ResearchMap() {
  return (
    <div className="relative overflow-hidden rounded-md paper-card-lg blueprint-grid">
      <p className="pt-6 text-center label-mono text-primary">Research pipeline</p>

      {/* Desktop: wave diagram with positioned stage labels */}
      <div className="relative mx-auto hidden aspect-[1200/440] w-full md:block" aria-hidden="true">
        <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="absolute inset-0 size-full">
          <path
            d={wavePath(118, 0)}
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.45"
            strokeWidth="1.5"
            strokeDasharray="2 6"
            strokeLinecap="round"
            className="text-foreground"
          />
          <path
            d={wavePath(118, Math.PI)}
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.28"
            strokeWidth="1.5"
            strokeDasharray="2 6"
            strokeLinecap="round"
            className="text-foreground"
          />
          <line
            x1="40"
            y1={HEIGHT / 2}
            x2={WIDTH - 40}
            y2={HEIGHT / 2}
            stroke="currentColor"
            strokeOpacity="0.15"
            className="text-foreground"
          />
          {binaryTags.map((tag) => (
            <g key={tag.text}>
              <rect
                x={tag.x}
                y={tag.y}
                width={tag.text.length * 9 + 14}
                height="22"
                fill="var(--card)"
                stroke="var(--primary)"
                strokeWidth="1"
              />
              <text
                x={tag.x + 7}
                y={tag.y + 15}
                fontFamily="var(--font-mono)"
                fontSize="11"
                fill="var(--primary)"
                letterSpacing="1"
              >
                {tag.text}
              </text>
            </g>
          ))}
        </svg>
        {stages.map((stage, index) => {
          const left = 6 + index * 19.5;
          const top = index % 2 === 0 ? 60 : 24;
          return (
            <div key={stage.index} className="absolute w-[17%]" style={{ left: `${left}%`, top: `${top}%` }}>
              <span className="mb-3 block h-px w-full bg-foreground/40" />
              <span className="block label-mono text-primary">{stage.index}</span>
              <span className="mt-1 block font-heading text-base font-extrabold tracking-tight">
                {stage.title}
              </span>
              <span className="mt-1 block label-mono tracking-wide text-muted-foreground normal-case">
                {stage.descriptors}
              </span>
            </div>
          );
        })}
        <TargetMarker pulse className="absolute top-[66%] left-[70.5%] size-9" />
      </div>

      {/* Accessible, link-bearing stage list (visible on small screens; screen-reader available on all) */}
      <ol className="mt-4 divide-y divide-border md:sr-only">
        {stages.map((stage) => (
          <li key={stage.index}>
            <Link
              href={`/research/${stage.area}`}
              className="flex items-baseline gap-4 px-6 py-4 transition-colors hover:bg-muted/60"
            >
              <span className="label-mono text-primary">{stage.index}</span>
              <span>
                <span className="block font-heading text-base font-extrabold tracking-tight">
                  {stage.title}
                </span>
                <span className="label-mono tracking-wide text-muted-foreground normal-case">
                  {stage.descriptors}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ol>

      <div className="hidden items-center justify-between border-t border-border px-6 py-3 md:flex">
        <p className="label-mono text-muted-foreground">Every stage learns from the one before it</p>
        <ul className="flex gap-5">
          {stages.map((stage) => (
            <li key={stage.index}>
              <Link
                href={`/research/${stage.area}`}
                className="label-mono text-foreground/80 hover:text-primary"
              >
                {stage.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
