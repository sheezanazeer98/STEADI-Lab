import type { ComponentProps } from "react";
import Link from "next/link";
import { evaluateSync } from "@mdx-js/mdx";
import type { MDXComponents } from "mdx/types";
import * as runtime from "react/jsx-runtime";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

/**
 * Renders trusted, locally authored MDX. Compilation is synchronous so the
 * output is part of the static shell. Raw HTML inside MDX is not supported
 * (MDX treats it as JSX), and only the components mapped below are exposed.
 */

function isExternal(href: string): boolean {
  return /^(https?:)?\/\//.test(href) || href.startsWith("mailto:");
}

function MdxLink({ href = "", children, ...rest }: ComponentProps<"a">) {
  if (isExternal(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...rest}>
        {children}
      </a>
    );
  }
  if (href.startsWith("/")) {
    return (
      <Link href={href as never} {...rest}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} {...rest}>
      {children}
    </a>
  );
}

function MdxImage({ alt = "", src, width, height, ...rest }: ComponentProps<"img">) {
  if (typeof src !== "string") return null;
  // Content images ship with explicit dimensions where possible; otherwise fall back to a native tag.
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} width={width} height={height} loading="lazy" decoding="async" {...rest} />;
}

export const mdxComponents: MDXComponents = {
  a: MdxLink,
  img: MdxImage,
};

/** Compiled documents are cached per source string; content is static per build. */
const cache = new Map<string, ReturnType<typeof evaluateSync>["default"]>();

export function compileMdx(source: string) {
  const cached = cache.get(source);
  if (cached) return cached;
  const { default: content } = evaluateSync(source, {
    ...runtime,
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeSlug],
    development: false,
  });
  cache.set(source, content);
  return content;
}

/**
 * Renders MDX to React elements. The compiled document is a plain function
 * (no hooks), so it is invoked directly rather than mounted as a component;
 * this keeps the element tree stable across renders.
 */
export function renderMdx(source: string) {
  return compileMdx(source)({ components: mdxComponents });
}

type MdxContentProps = {
  source: string;
  className?: string;
};

export function MdxContent({ source, className }: MdxContentProps) {
  if (!source.trim()) return null;
  return <div className={cn("prose-lab", className)}>{renderMdx(source)}</div>;
}
