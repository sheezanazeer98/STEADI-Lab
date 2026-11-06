import type { ReactNode } from "react";
import { ArrowUpRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type ExternalLinkProps = {
  href: string;
  children: ReactNode;
  icon?: LucideIcon;
  variant?: "chip" | "button" | "inline";
  className?: string;
};

export function ExternalLink({
  href,
  children,
  icon: Icon = ArrowUpRight,
  variant = "chip",
  className,
}: ExternalLinkProps) {
  const styles = {
    chip: "border-border bg-card text-foreground hover:border-primary hover:text-primary inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-semibold transition-colors",
    button:
      "bg-foreground text-background hover:bg-primary hover:text-primary-foreground inline-flex h-11 items-center gap-2 rounded-md px-5 text-sm font-semibold transition-colors",
    inline: "text-primary link-underline inline-flex items-center gap-1 font-medium",
  }[variant];
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        styles,
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
        className,
      )}
    >
      <Icon className="size-3.5" aria-hidden="true" />
      {children}
    </a>
  );
}
