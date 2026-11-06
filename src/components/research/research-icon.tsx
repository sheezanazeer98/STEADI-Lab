import {
  Blocks,
  Bot,
  BrainCircuit,
  Combine,
  Database,
  FileCode2,
  Globe,
  Network,
  Scale,
  ShieldCheck,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

/** Icon keys available to `icon:` in research-area frontmatter. */
export const researchIcons: Record<string, LucideIcon> = {
  "brain-circuit": BrainCircuit,
  "shield-check": ShieldCheck,
  bot: Bot,
  blocks: Blocks,
  "file-code-2": FileCode2,
  globe: Globe,
  scale: Scale,
  database: Database,
  combine: Combine,
  network: Network,
  sparkles: Sparkles,
};

type ResearchIconProps = {
  name: string;
  className?: string;
};

export function ResearchIcon({ name, className }: ResearchIconProps) {
  const Icon = researchIcons[name] ?? Sparkles;
  return <Icon className={cn("size-5", className)} aria-hidden="true" />;
}
