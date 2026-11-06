import type { ComponentProps, ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const buttonLinkStyles = {
  base: "focus-visible:ring-ring inline-flex items-center justify-center gap-2 rounded-md text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:outline-none",
  variant: {
    primary: "bg-foreground text-background hover:bg-primary hover:text-primary-foreground",
    accent: "bg-primary text-primary-foreground hover:bg-primary/85",
    secondary: "border-border bg-card/80 text-foreground hover:border-primary hover:text-primary border",
    ghost: "text-foreground hover:bg-muted",
  },
  size: {
    md: "h-11 px-5",
    lg: "h-12 px-6",
  },
} as const;

type ButtonLinkProps = ComponentProps<typeof Link> & {
  variant?: keyof typeof buttonLinkStyles.variant;
  size?: keyof typeof buttonLinkStyles.size;
  children: ReactNode;
};

/** Link styled as a call-to-action button, sized for page-level CTAs. */
export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      className={cn(
        buttonLinkStyles.base,
        buttonLinkStyles.variant[variant],
        buttonLinkStyles.size[size],
        className,
      )}
      {...props}
    >
      {children}
    </Link>
  );
}

type ButtonProps = ComponentProps<"button"> & {
  variant?: keyof typeof buttonLinkStyles.variant;
  size?: keyof typeof buttonLinkStyles.size;
};

/** Native button sharing the same visual language as ButtonLink. */
export function ActionButton({
  variant = "primary",
  size = "md",
  className,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        buttonLinkStyles.base,
        buttonLinkStyles.variant[variant],
        buttonLinkStyles.size[size],
        "disabled:pointer-events-none disabled:opacity-60",
        className,
      )}
      {...props}
    />
  );
}
