import Link from "next/link";
import type { Route } from "next";
import { ChevronRight } from "lucide-react";
import { JsonLd } from "@/components/shared/json-ld";
import { breadcrumbJsonLd } from "@/lib/seo";
import { cn } from "@/lib/utils";

export type Crumb = {
  name: string;
  href: Route;
};

type BreadcrumbsProps = {
  items: Crumb[];
  /** The current page (rendered without a link). */
  current: string;
  className?: string;
};

export function Breadcrumbs({ items, current, className }: BreadcrumbsProps) {
  const trail = [{ name: "Home", href: "/" as Route }, ...items];
  return (
    <nav aria-label="Breadcrumb" className={cn("label-mono", className)}>
      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-muted-foreground">
        {trail.map((crumb) => (
          <li key={crumb.href} className="flex items-center gap-1.5">
            <Link href={crumb.href} className="transition-colors hover:text-primary">
              {crumb.name}
            </Link>
            <ChevronRight className="size-3" aria-hidden="true" />
          </li>
        ))}
        <li aria-current="page" className="truncate text-foreground">
          {current}
        </li>
      </ol>
      <JsonLd data={breadcrumbJsonLd([...trail, { name: current }])} />
    </nav>
  );
}
