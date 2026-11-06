import type { ComponentType, SVGProps } from "react";
import {
  BookOpen,
  Database,
  Download,
  FileText,
  FlaskConical,
  GraduationCap,
  Presentation,
  Wrench,
} from "lucide-react";
import { GitHubIcon } from "@/components/shared/brand-icons";
import { Tag } from "@/components/shared/tag";
import type { Resource, ResourceCategory } from "@/types/content";
import { cn } from "@/lib/utils";

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

const categoryIcons: Record<ResourceCategory, IconComponent> = {
  Datasets: Database,
  "Open-Source Code": GitHubIcon,
  "Research Tools": Wrench,
  "Technical Documentation": FileText,
  Tutorials: BookOpen,
  "Educational Materials": GraduationCap,
  "Research Benchmarks": FlaskConical,
  Presentations: Presentation,
};

type ResourceCardProps = {
  resource: Resource;
  areaTitles?: Record<string, string>;
  className?: string;
};

export function ResourceCard({ resource, areaTitles = {}, className }: ResourceCardProps) {
  const Icon = categoryIcons[resource.category];
  const links = [
    resource.downloadUrl ? { label: "Download", href: resource.downloadUrl, Icon: Download } : null,
    resource.url ? { label: "Open", href: resource.url, Icon: BookOpen } : null,
    resource.repoUrl ? { label: "Repository", href: resource.repoUrl, Icon: GitHubIcon } : null,
  ].filter((link): link is NonNullable<typeof link> => Boolean(link));

  return (
    <article
      className={cn(
        "flex h-full flex-col rounded-md border border-border bg-card p-6 transition-all hover:border-primary/70 hover:shadow-(--shadow-card)",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="flex size-10 items-center justify-center rounded-md border border-border bg-background text-primary">
          <Icon className="size-4" aria-hidden="true" />
        </span>
        <div className="flex flex-wrap justify-end gap-1.5">
          <Tag tone="accent">{resource.category}</Tag>
        </div>
      </div>
      <h3 className="mt-4 text-base leading-snug font-extrabold tracking-tight">{resource.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-soft">{resource.description}</p>
      <dl className="mt-3 flex flex-wrap gap-x-4 gap-y-1 label-mono text-muted-foreground">
        {resource.format ? (
          <div>
            <dt className="sr-only">Format</dt>
            <dd>{resource.format}</dd>
          </div>
        ) : null}
        {resource.license ? (
          <div>
            <dt className="sr-only">Licence</dt>
            <dd>{resource.license}</dd>
          </div>
        ) : null}
        {resource.researchAreas.slice(0, 1).map((slug) => (
          <div key={slug}>
            <dt className="sr-only">Research area</dt>
            <dd className="tracking-normal normal-case">{areaTitles[slug] ?? slug}</dd>
          </div>
        ))}
      </dl>
      {links.length ? (
        <ul className="mt-auto flex flex-wrap gap-2 border-t border-border pt-4">
          {links.map(({ label, href, Icon: LinkIcon }) => (
            <li key={label}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-semibold transition-colors hover:border-primary hover:text-primary"
              >
                <LinkIcon className="size-3.5" aria-hidden="true" />
                {label}
              </a>
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}
