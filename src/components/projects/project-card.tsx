import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Cover } from "@/components/shared/cover-visual";
import { StatusTag, Tag } from "@/components/shared/tag";
import type { Project } from "@/types/content";
import { cn } from "@/lib/utils";

type ProjectCardProps = {
  project: Project;
  className?: string;
  priority?: boolean;
};

export function ProjectCard({ project, className, priority }: ProjectCardProps) {
  return (
    <article
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-md border border-border bg-card transition-all hover:border-primary/70 hover:shadow-(--shadow-card)",
        className,
      )}
    >
      <Cover image={project.cover} seed={project.slug} label={project.category} priority={priority} />
      <div className="flex flex-1 flex-col p-6">
        <div className="flex flex-wrap items-center gap-2">
          <StatusTag status={project.status} />
          {project.timeline ? (
            <span className="label-mono text-muted-foreground">
              {project.timeline.start}
              {project.timeline.end ? ` – ${project.timeline.end}` : " – present"}
            </span>
          ) : null}
        </div>
        <h3 className="mt-4 text-lg leading-snug font-extrabold tracking-tight">
          <Link
            href={`/projects/${project.slug}`}
            className="after:absolute after:inset-0 after:content-[''] focus-visible:ring-ring focus-visible:outline-none"
          >
            {project.title}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink-soft">{project.summary}</p>
        {project.techStack.length ? (
          <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Technology stack">
            {project.techStack.slice(0, 4).map((tech) => (
              <li key={tech}>
                <Tag tone="outline" mono={false}>
                  {tech}
                </Tag>
              </li>
            ))}
          </ul>
        ) : null}
        <div className="mt-auto flex items-center justify-between border-t border-border pt-4">
          <span className="label-mono text-muted-foreground">{project.category}</span>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary">
            View project
            <ArrowUpRight
              className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              aria-hidden="true"
            />
          </span>
        </div>
      </div>
    </article>
  );
}
