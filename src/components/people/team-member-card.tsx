import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Person } from "@/types/content";
import { cn } from "@/lib/utils";

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

type AvatarProps = {
  person: Person;
  size?: "sm" | "md" | "lg";
  className?: string;
};

export function Avatar({ person, size = "md", className }: AvatarProps) {
  const dimension = { sm: "size-12 text-sm", md: "size-20 text-xl", lg: "size-36 text-4xl" }[size];
  const pixels = { sm: 48, md: 80, lg: 144 }[size];
  return (
    <span
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden rounded-md border border-border bg-muted font-extrabold text-foreground",
        dimension,
        className,
      )}
    >
      {person.photo ? (
        <Image
          src={person.photo.src}
          alt={person.photo.alt}
          width={pixels}
          height={pixels}
          className="size-full object-cover"
        />
      ) : (
        <>
          <span aria-hidden="true" className="absolute inset-0 blueprint-grid-sm opacity-70" />
          <span className="relative">{initials(person.name)}</span>
        </>
      )}
    </span>
  );
}

type TeamMemberCardProps = {
  person: Person;
  className?: string;
};

export function TeamMemberCard({ person, className }: TeamMemberCardProps) {
  return (
    <article
      className={cn(
        "group relative flex h-full gap-5 rounded-md border border-border bg-card p-5 transition-all hover:border-primary/70 hover:shadow-(--shadow-card)",
        className,
      )}
    >
      <Avatar person={person} />
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-base leading-snug font-extrabold tracking-tight">
            <Link
              href={`/people/${person.slug}`}
              className="after:absolute after:inset-0 after:content-[''] focus-visible:ring-ring focus-visible:outline-none"
            >
              {person.name}
            </Link>
          </h3>
        </div>
        {person.title ? <p className="mt-1 text-sm text-ink-soft">{person.title}</p> : null}
        <p className="mt-1.5 label-mono text-muted-foreground">{person.affiliation}</p>
        {person.interests.length ? (
          <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-ink-soft">
            {person.interests.join(" · ")}
          </p>
        ) : null}
        <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary">
          Profile
          <ArrowUpRight
            className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            aria-hidden="true"
          />
        </span>
      </div>
    </article>
  );
}
