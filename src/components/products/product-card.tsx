import Link from "next/link";
import { ArrowUpRight, BookOpen, Play } from "lucide-react";
import { GitHubIcon } from "@/components/shared/brand-icons";
import { Cover } from "@/components/shared/cover-visual";
import { StatusTag, Tag } from "@/components/shared/tag";
import type { Product } from "@/types/content";
import { cn } from "@/lib/utils";

type ProductCardProps = {
  product: Product;
  className?: string;
};

export function ProductCard({ product, className }: ProductCardProps) {
  const links = [
    product.githubUrl ? { label: "GitHub", href: product.githubUrl, Icon: GitHubIcon } : null,
    product.docsUrl ? { label: "Docs", href: product.docsUrl, Icon: BookOpen } : null,
    product.demoUrl ? { label: "Demo", href: product.demoUrl, Icon: Play } : null,
  ].filter((link): link is NonNullable<typeof link> => Boolean(link));

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-md border border-border bg-card transition-all hover:border-primary/70 hover:shadow-(--shadow-card)",
        className,
      )}
    >
      <Cover
        image={product.screenshots[0]}
        seed={product.slug}
        label={product.category}
        className="aspect-[16/9]"
      />
      <div className="flex flex-1 flex-col p-6">
        <div className="flex flex-wrap items-center gap-2">
          <StatusTag status={product.status} />
          {product.version ? (
            <span className="label-mono text-muted-foreground">v{product.version}</span>
          ) : null}
        </div>
        <h3 className="mt-4 text-lg leading-snug font-extrabold tracking-tight">
          <Link
            href={`/products/${product.slug}`}
            className="after:absolute after:inset-0 after:content-[''] focus-visible:ring-ring focus-visible:outline-none"
          >
            {product.name}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink-soft">{product.summary}</p>
        {product.techStack.length ? (
          <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Technology stack">
            {product.techStack.slice(0, 4).map((tech) => (
              <li key={tech}>
                <Tag tone="outline" mono={false}>
                  {tech}
                </Tag>
              </li>
            ))}
          </ul>
        ) : null}
        <div className="relative z-10 mt-auto flex items-center justify-between gap-3 border-t border-border pt-4">
          <ul className="flex flex-wrap gap-1.5">
            {links.map(({ label, href, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-sm border border-border bg-background px-2 py-0.5 text-[11px] font-semibold text-foreground/85 transition-colors hover:border-primary hover:text-primary"
                >
                  <Icon className="size-3" aria-hidden="true" />
                  {label}
                </a>
              </li>
            ))}
          </ul>
          <span className="ml-auto inline-flex items-center gap-1 text-xs font-semibold text-primary">
            Details
            <ArrowUpRight className="size-3.5" aria-hidden="true" />
          </span>
        </div>
      </div>
    </article>
  );
}
