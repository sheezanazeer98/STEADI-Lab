import Link from "next/link";
import { ArrowUpRight, Clock } from "lucide-react";
import { Cover } from "@/components/shared/cover-visual";
import { Tag } from "@/components/shared/tag";
import { formatDate } from "@/lib/format";
import type { NewsPost } from "@/types/content";
import { cn } from "@/lib/utils";

type NewsCardProps = {
  post: NewsPost;
  variant?: "card" | "row";
  className?: string;
};

export function NewsCard({ post, variant = "card", className }: NewsCardProps) {
  const href = `/news/${post.slug}` as const;

  if (variant === "row") {
    return (
      <article
        className={cn(
          "group relative grid gap-3 border-b border-border py-5 transition-colors hover:bg-card/80 sm:grid-cols-[9rem_1fr] sm:gap-6",
          className,
        )}
      >
        <div className="flex items-center gap-2 label-mono text-muted-foreground sm:flex-col sm:items-start sm:gap-1">
          <time dateTime={post.date}>{formatDate(post.date, "short")}</time>
          <span>{post.readingTime} min read</span>
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Tag tone="accent">{post.category}</Tag>
          </div>
          <h3 className="mt-2 text-lg leading-snug font-extrabold tracking-tight">
            <Link
              href={href}
              className="after:absolute after:inset-0 after:content-[''] focus-visible:ring-ring focus-visible:outline-none"
            >
              {post.title}
            </Link>
          </h3>
          <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-ink-soft">{post.excerpt}</p>
          <p className="mt-2 text-xs text-muted-foreground">By {post.author}</p>
        </div>
      </article>
    );
  }

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-md border border-border bg-card transition-all hover:border-primary/70 hover:shadow-(--shadow-card)",
        className,
      )}
    >
      <Cover image={post.image} seed={post.slug} label={post.category} />
      <div className="flex flex-1 flex-col p-6">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 label-mono text-muted-foreground">
          <time dateTime={post.date}>{formatDate(post.date, "short")}</time>
          <span className="inline-flex items-center gap-1">
            <Clock className="size-3" aria-hidden="true" />
            {post.readingTime} min
          </span>
        </div>
        <h3 className="mt-3 text-lg leading-snug font-extrabold tracking-tight">
          <Link
            href={href}
            className="after:absolute after:inset-0 after:content-[''] focus-visible:ring-ring focus-visible:outline-none"
          >
            {post.title}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink-soft">{post.excerpt}</p>
        <div className="mt-auto flex items-center justify-between gap-3 border-t border-border pt-4">
          <span className="truncate text-xs text-muted-foreground">By {post.author}</span>
          <span className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-primary">
            Read
            <ArrowUpRight className="size-3.5" aria-hidden="true" />
          </span>
        </div>
      </div>
    </article>
  );
}
