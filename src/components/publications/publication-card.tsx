import Link from "next/link";
import { ArrowUpRight, Code2, Database, ExternalLink as ExternalLinkIcon, FileText } from "lucide-react";
import { StatusTag, Tag } from "@/components/shared/tag";
import { doiUrl } from "@/lib/bibtex";
import { formatAuthors } from "@/lib/format";
import type { Publication } from "@/types/content";
import { cn } from "@/lib/utils";

type PublicationLinksProps = {
  publication: Publication;
  className?: string;
  size?: "sm" | "md";
};

/** Inline external resource links (PDF, DOI, code, data). */
export function PublicationLinks({ publication, className, size = "sm" }: PublicationLinksProps) {
  const links = [
    publication.pdfUrl ? { label: "PDF", href: publication.pdfUrl, Icon: FileText } : null,
    publication.doi ? { label: "DOI", href: doiUrl(publication.doi), Icon: ExternalLinkIcon } : null,
    !publication.doi && publication.publisherUrl
      ? { label: "Publisher", href: publication.publisherUrl, Icon: ExternalLinkIcon }
      : null,
    publication.githubUrl ? { label: "Code", href: publication.githubUrl, Icon: Code2 } : null,
    publication.datasetUrl ? { label: "Data", href: publication.datasetUrl, Icon: Database } : null,
  ].filter((link): link is NonNullable<typeof link> => Boolean(link));

  if (links.length === 0) return null;

  return (
    <ul className={cn("flex flex-wrap gap-1.5", className)} aria-label="Publication resources">
      {links.map(({ label, href, Icon }) => (
        <li key={label}>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "inline-flex items-center gap-1 rounded-sm border border-border bg-background font-semibold text-foreground/85 transition-colors hover:border-primary hover:text-primary",
              size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-3 py-1.5 text-xs",
            )}
          >
            <Icon className={size === "sm" ? "size-3" : "size-3.5"} aria-hidden="true" />
            {label}
          </a>
        </li>
      ))}
    </ul>
  );
}

type PublicationCardProps = {
  publication: Publication;
  areaTitles?: Record<string, string>;
  variant?: "card" | "row";
  className?: string;
};

export function PublicationCard({
  publication,
  areaTitles = {},
  variant = "card",
  className,
}: PublicationCardProps) {
  const href = `/publications/${publication.slug}` as const;

  if (variant === "row") {
    return (
      <article
        className={cn(
          "grid gap-3 border-b border-border py-5 transition-colors hover:bg-card/80 sm:grid-cols-[5rem_1fr] sm:gap-6",
          className,
        )}
      >
        <div className="flex items-center gap-2 sm:flex-col sm:items-start">
          <span className="font-heading text-xl font-extrabold">{publication.year}</span>
          <span className="label-mono text-muted-foreground">{publication.type}</span>
        </div>
        <div className="min-w-0">
          <h3 className="text-base leading-snug font-bold tracking-tight">
            <Link href={href} className="transition-colors hover:text-primary">
              {publication.title}
            </Link>
          </h3>
          <p className="mt-1 text-sm text-ink-soft">{formatAuthors(publication.authors)}</p>
          {publication.venue ? (
            <p className="mt-0.5 text-sm text-muted-foreground italic">{publication.venue}</p>
          ) : null}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {publication.status !== "Published" ? <StatusTag status={publication.status} /> : null}
            <PublicationLinks publication={publication} />
          </div>
        </div>
      </article>
    );
  }

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col rounded-md border border-border bg-card p-6 transition-all hover:border-primary/70 hover:shadow-(--shadow-card)",
        className,
      )}
    >
      <div className="flex flex-wrap items-center gap-2">
        <Tag tone="accent">{publication.type}</Tag>
        <span className="label-mono text-muted-foreground">{publication.year}</span>
        {publication.status !== "Published" ? <StatusTag status={publication.status} /> : null}
      </div>
      <h3 className="mt-4 text-lg leading-snug font-extrabold tracking-tight">
        <Link
          href={href}
          className="after:absolute after:inset-0 after:content-[''] focus-visible:ring-ring focus-visible:outline-none"
        >
          {publication.title}
        </Link>
      </h3>
      <p className="mt-2 text-sm text-ink-soft">{formatAuthors(publication.authors)}</p>
      {publication.venue ? (
        <p className="mt-1 text-sm text-muted-foreground italic">{publication.venue}</p>
      ) : null}
      <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-ink-soft">{publication.abstract}</p>
      {publication.researchAreas.length ? (
        <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Research areas">
          {publication.researchAreas.slice(0, 2).map((slug) => (
            <li key={slug}>
              <Tag tone="outline" mono={false}>
                {areaTitles[slug] ?? slug}
              </Tag>
            </li>
          ))}
        </ul>
      ) : null}
      <div className="relative z-10 mt-auto flex items-center justify-between gap-3 border-t border-border pt-4">
        <PublicationLinks publication={publication} />
        <span className="ml-auto inline-flex items-center gap-1 text-xs font-semibold text-primary">
          Details
          <ArrowUpRight className="size-3.5" aria-hidden="true" />
        </span>
      </div>
    </article>
  );
}
