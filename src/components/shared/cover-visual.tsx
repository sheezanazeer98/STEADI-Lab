import Image from "next/image";
import type { ContentImage } from "@/types/content";
import { cn } from "@/lib/utils";

/**
 * Deterministic, generative blueprint covers for entries without artwork.
 * The same slug always yields the same drawing, so server and client agree.
 */

function hashString(input: string): number {
  let hash = 2166136261;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function createRandom(seed: number) {
  let state = seed || 1;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = Math.imul(state ^ (state >>> 15), 1 | state);
    value ^= value + Math.imul(value ^ (value >>> 7), 61 | value);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

type Variant = "network" | "chain" | "wave" | "hex";
const VARIANTS: Variant[] = ["network", "chain", "wave", "hex"];

function NetworkDrawing({ random }: { random: () => number }) {
  const nodes = Array.from({ length: 9 }, () => ({
    x: 30 + random() * 260,
    y: 25 + random() * 130,
    r: 2 + random() * 2.5,
  }));
  const edges: Array<[number, number]> = [];
  nodes.forEach((_, index) => {
    const target = (index + 1 + Math.floor(random() * 3)) % nodes.length;
    edges.push([index, target]);
  });
  return (
    <>
      {edges.map(([a, b], index) => (
        <line
          key={index}
          x1={nodes[a].x}
          y1={nodes[a].y}
          x2={nodes[b].x}
          y2={nodes[b].y}
          stroke="currentColor"
          strokeOpacity="0.45"
          strokeDasharray="3 4"
        />
      ))}
      {nodes.map((node, index) => (
        <circle
          key={index}
          cx={node.x}
          cy={node.y}
          r={node.r}
          fill={index % 3 === 0 ? "var(--primary)" : "currentColor"}
        />
      ))}
    </>
  );
}

function ChainDrawing({ random }: { random: () => number }) {
  const blocks = Array.from({ length: 5 }, (_, index) => ({
    x: 28 + index * 56,
    y: 60 + Math.sin(index + random()) * 18,
  }));
  return (
    <>
      {blocks.map((block, index) => (
        <g key={index}>
          {index < blocks.length - 1 ? (
            <line
              x1={block.x + 36}
              y1={block.y + 18}
              x2={blocks[index + 1].x}
              y2={blocks[index + 1].y + 18}
              stroke="currentColor"
              strokeOpacity="0.5"
            />
          ) : null}
          <rect
            x={block.x}
            y={block.y}
            width="36"
            height="36"
            fill="none"
            stroke={index === 2 ? "var(--primary)" : "currentColor"}
            strokeWidth={index === 2 ? 1.5 : 1}
          />
          <text
            x={block.x + 18}
            y={block.y + 22}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize="7"
            fill={index === 2 ? "var(--primary)" : "currentColor"}
          >
            {index === 2 ? "1011" : (index * 37 + 1010).toString(2).slice(-4)}
          </text>
        </g>
      ))}
    </>
  );
}

function WaveDrawing({ random }: { random: () => number }) {
  const amplitude = 22 + random() * 14;
  const points = Array.from({ length: 60 }, (_, index) => {
    const x = 10 + index * 5;
    const y = 90 + Math.sin(index / 5.2 + random() * 0.2) * amplitude;
    return `${x},${y.toFixed(1)}`;
  });
  return (
    <>
      <polyline
        points={points.join(" ")}
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.55"
        strokeDasharray="2 4"
      />
      <line x1="10" y1="90" x2="310" y2="90" stroke="currentColor" strokeOpacity="0.3" />
      {[60, 160, 260].map((x, index) => (
        <g key={x}>
          <circle cx={x} cy="90" r="9" fill="none" stroke="var(--primary)" />
          <circle cx={x} cy="90" r="2.5" fill="var(--primary)" />
          <text
            x={x}
            y="125"
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize="7"
            fill="currentColor"
          >
            {["0101", "1101", "0011"][index]}
          </text>
        </g>
      ))}
    </>
  );
}

function HexDrawing({ random }: { random: () => number }) {
  const size = 22;
  const hexes: Array<{ x: number; y: number; accent: boolean }> = [];
  for (let row = 0; row < 3; row += 1) {
    for (let col = 0; col < 5; col += 1) {
      hexes.push({
        x: 60 + col * size * 1.75 + (row % 2) * size * 0.875,
        y: 45 + row * size * 1.52,
        accent: random() > 0.78,
      });
    }
  }
  const polygon = (cx: number, cy: number) =>
    Array.from({ length: 6 }, (_, index) => {
      const angle = (Math.PI / 3) * index + Math.PI / 6;
      return `${(cx + size * Math.cos(angle)).toFixed(1)},${(cy + size * Math.sin(angle)).toFixed(1)}`;
    }).join(" ");
  return (
    <>
      {hexes.map((hex, index) => (
        <polygon
          key={index}
          points={polygon(hex.x, hex.y)}
          fill={hex.accent ? "var(--primary)" : "none"}
          fillOpacity={hex.accent ? 0.18 : 1}
          stroke={hex.accent ? "var(--primary)" : "currentColor"}
          strokeOpacity={hex.accent ? 1 : 0.4}
        />
      ))}
    </>
  );
}

type GenerativeCoverProps = {
  seed: string;
  label?: string;
  className?: string;
};

export function GenerativeCover({ seed, label, className }: GenerativeCoverProps) {
  const hash = hashString(seed);
  const random = createRandom(hash);
  const variant = VARIANTS[hash % VARIANTS.length];
  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative aspect-[16/9] w-full overflow-hidden bg-muted/60 blueprint-grid-sm text-foreground/70",
        className,
      )}
    >
      <svg viewBox="0 0 320 180" className="absolute inset-0 size-full" preserveAspectRatio="xMidYMid slice">
        {variant === "network" ? <NetworkDrawing random={random} /> : null}
        {variant === "chain" ? <ChainDrawing random={random} /> : null}
        {variant === "wave" ? <WaveDrawing random={random} /> : null}
        {variant === "hex" ? <HexDrawing random={random} /> : null}
      </svg>
      {label ? <span className="absolute top-3 left-3 label-mono text-primary">{label}</span> : null}
      <span className="absolute right-3 bottom-3 label-mono text-muted-foreground">
        {hash.toString(16).slice(0, 6)}
      </span>
    </div>
  );
}

type CoverProps = {
  image?: ContentImage;
  seed: string;
  label?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
};

/** Renders the entry image when provided, otherwise a generative cover. */
export function Cover({ image, seed, label, className, sizes, priority }: CoverProps) {
  if (image) {
    return (
      <div className={cn("relative aspect-[16/9] w-full overflow-hidden bg-muted", className)}>
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes={sizes ?? "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"}
          className="object-cover"
          priority={priority}
        />
      </div>
    );
  }
  return <GenerativeCover seed={seed} label={label} className={className} />;
}
