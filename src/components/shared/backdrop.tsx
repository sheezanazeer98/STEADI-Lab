import { cn } from "@/lib/utils";

/**
 * Decorative "blueprint" backdrop: faint grid, scattered binary digits and
 * crosshair marks. Purely presentational and hidden from assistive technology.
 * Positions are fixed so the server and client render identical markup.
 */

const DIGITS: Array<{ x: number; y: number; char: string; size: number }> = [
  { x: 4, y: 12, char: "1", size: 11 },
  { x: 12, y: 44, char: "0", size: 10 },
  { x: 22, y: 8, char: "0", size: 12 },
  { x: 31, y: 72, char: "1", size: 10 },
  { x: 44, y: 24, char: "1", size: 11 },
  { x: 53, y: 88, char: "0", size: 12 },
  { x: 61, y: 15, char: "1", size: 10 },
  { x: 70, y: 56, char: "0", size: 11 },
  { x: 79, y: 10, char: "1", size: 12 },
  { x: 86, y: 68, char: "0", size: 10 },
  { x: 93, y: 32, char: "1", size: 11 },
  { x: 97, y: 82, char: "0", size: 12 },
  { x: 8, y: 92, char: "1", size: 10 },
  { x: 38, y: 50, char: "0", size: 10 },
  { x: 66, y: 94, char: "1", size: 11 },
];

const CROSSES: Array<{ x: number; y: number }> = [
  { x: 2, y: 28 },
  { x: 18, y: 86 },
  { x: 49, y: 6 },
  { x: 76, y: 40 },
  { x: 98, y: 58 },
  { x: 58, y: 70 },
];

type BackdropProps = {
  className?: string;
  grid?: boolean;
  density?: "low" | "high";
};

export function Backdrop({ className, grid = true, density = "high" }: BackdropProps) {
  const digits = density === "high" ? DIGITS : DIGITS.filter((_, index) => index % 2 === 0);
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden select-none",
        grid && "blueprint-grid",
        className,
      )}
    >
      {digits.map((digit, index) => (
        <span
          key={`d-${index}`}
          className="absolute font-mono text-foreground/25"
          style={{ left: `${digit.x}%`, top: `${digit.y}%`, fontSize: digit.size }}
        >
          {digit.char}
        </span>
      ))}
      {CROSSES.map((cross, index) => (
        <span
          key={`c-${index}`}
          className="absolute font-mono text-[10px] text-foreground/30"
          style={{ left: `${cross.x}%`, top: `${cross.y}%` }}
        >
          +
        </span>
      ))}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
}

/** Concentric target marker used as an accent in hero panels. */
export function TargetMarker({ className, pulse = false }: { className?: string; pulse?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={cn("relative inline-flex size-7 items-center justify-center", className)}
    >
      {pulse ? (
        <span className="absolute inset-0 animate-pulse-ring rounded-full border border-primary/60 motion-reduce:hidden" />
      ) : null}
      <span className="absolute inset-0 rounded-full border border-primary" />
      <span className="size-1.5 rounded-full bg-primary" />
    </span>
  );
}
