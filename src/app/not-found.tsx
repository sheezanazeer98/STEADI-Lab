import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";
import { Backdrop } from "@/components/shared/backdrop";
import { ButtonLink } from "@/components/shared/button-link";
import { primaryNav, isNavGroup } from "@/lib/site";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

const suggestions = primaryNav.flatMap((item) => (isNavGroup(item) ? item.items : [item]));

export default function NotFound() {
  return (
    <section className="relative overflow-hidden">
      <Backdrop density="high" />
      <div className="relative container-wide py-24 sm:py-32">
        <p className="label-mono text-primary">Error 404 — route not found</p>
        <h1 className="mt-4 display-text text-5xl sm:text-6xl lg:text-7xl">
          This page is <span className="text-primary">off the map</span>.
        </h1>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-ink-soft sm:text-lg">
          The address may have changed, the content may have moved to a different collection, or the link may
          have been typed incorrectly.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="/" size="lg">
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back to home
          </ButtonLink>
          <ButtonLink href="/publications" size="lg" variant="secondary">
            <Search className="size-4" aria-hidden="true" />
            Search publications
          </ButtonLink>
        </div>

        <div className="mt-16 max-w-2xl rounded-md bg-panel p-6 font-mono text-xs text-panel-foreground shadow-(--shadow-card-lg) sm:text-sm">
          <p className="label-mono text-panel-muted">steadi router</p>
          <ol className="mt-4 space-y-2 text-panel-foreground">
            <li>
              <span className="mr-3 text-panel-muted">01</span>resolving route…
            </li>
            <li>
              <span className="mr-3 text-panel-muted">02</span>no matching segment ✗
            </li>
            <li className="text-primary">
              <span className="mr-3 text-panel-muted">03</span>try one of the routes below ▌
            </li>
          </ol>
        </div>

        <nav aria-label="Site sections" className="mt-10">
          <ul className="flex flex-wrap gap-2">
            {suggestions.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="rounded-sm border border-border bg-card px-2.5 py-1.5 label-mono text-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
}
