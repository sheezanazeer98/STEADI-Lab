import type { ReactNode } from "react";
import { Backdrop } from "@/components/shared/backdrop";
import { Breadcrumbs, type Crumb } from "@/components/shared/breadcrumbs";
import { cn } from "@/lib/utils";

type PageHeroProps = {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  breadcrumbs?: Crumb[];
  /** Current page name for the breadcrumb trail. Defaults to the string title. */
  current?: string;
  actions?: ReactNode;
  /** Extra content rendered under the description (e.g. meta rows). */
  children?: ReactNode;
  align?: "left" | "center";
  size?: "md" | "lg";
  className?: string;
};

export function PageHero({
  eyebrow,
  title,
  description,
  breadcrumbs,
  current,
  actions,
  children,
  align = "left",
  size = "lg",
  className,
}: PageHeroProps) {
  const currentName = current ?? (typeof title === "string" ? title : "");
  return (
    <section className={cn("relative overflow-hidden", className)}>
      <Backdrop density="low" />
      <div
        className={cn(
          "relative container-wide pt-14 pb-12 sm:pt-20 sm:pb-16",
          align === "center" && "text-center",
        )}
      >
        {breadcrumbs ? (
          <Breadcrumbs
            items={breadcrumbs}
            current={currentName}
            className={cn("mb-8", align === "center" && "justify-center [&_ol]:justify-center")}
          />
        ) : null}
        {eyebrow ? <p className="mb-4 label-mono text-primary">{eyebrow}</p> : null}
        <h1
          className={cn(
            "max-w-4xl display-text",
            size === "lg" ? "text-4xl sm:text-5xl lg:text-[4.25rem]" : "text-3xl sm:text-4xl lg:text-5xl",
            align === "center" && "mx-auto",
          )}
        >
          {title}
        </h1>
        {description ? (
          <div
            className={cn(
              "mt-6 max-w-2xl text-base leading-relaxed text-ink-soft sm:text-lg",
              align === "center" && "mx-auto",
            )}
          >
            {description}
          </div>
        ) : null}
        {actions ? (
          <div className={cn("mt-8 flex flex-wrap gap-3", align === "center" && "justify-center")}>
            {actions}
          </div>
        ) : null}
        {children}
      </div>
    </section>
  );
}
