import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock } from "lucide-react";
import { Backdrop } from "@/components/shared/backdrop";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { Section } from "@/components/shared/section";
import { SectionHeading } from "@/components/shared/section-heading";
import { JsonLd } from "@/components/shared/json-ld";
import { Tag } from "@/components/shared/tag";
import { NewsCard } from "@/components/news/news-card";
import { MdxContent } from "@/lib/content/mdx";
import { getNewsPost, getNewsPosts, getRelatedNews, resolveResearchAreas } from "@/lib/content";
import { formatDate } from "@/lib/format";
import { toStaticParams } from "@/lib/content/static-params";
import { buildMetadata } from "@/lib/seo";
import { absoluteUrl, siteConfig } from "@/lib/site";

export function generateStaticParams() {
  return toStaticParams(getNewsPosts());
}

export async function generateMetadata({ params }: PageProps<"/news/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = getNewsPost(slug);
  if (!post) return {};
  return buildMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/news/${post.slug}`,
    type: "article",
    publishedTime: post.date,
    modifiedTime: post.updated,
    authors: [post.author],
    keywords: post.tags,
    image: post.image?.src,
  });
}

export default async function NewsArticlePage({ params }: PageProps<"/news/[slug]">) {
  const { slug } = await params;
  const post = getNewsPost(slug);
  if (!post) notFound();

  const related = getRelatedNews(post, 3);
  const areas = resolveResearchAreas(post.researchAreas);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    ...(post.updated ? { dateModified: post.updated } : {}),
    author: { "@type": "Person", name: post.author },
    publisher: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
    mainEntityOfPage: absoluteUrl(`/news/${post.slug}`),
    keywords: post.tags.join(", "),
    articleSection: post.category,
    ...(post.image ? { image: absoluteUrl(post.image.src) } : {}),
  };

  return (
    <>
      <article>
        <header className="relative overflow-hidden">
          <Backdrop density="low" />
          <div className="relative container-narrow pt-14 pb-10 sm:pt-20 sm:pb-12">
            <Breadcrumbs items={[{ name: "News", href: "/news" }]} current={post.title} className="mb-8" />
            <div className="flex flex-wrap items-center gap-2">
              <Tag tone="accent">{post.category}</Tag>
            </div>
            <h1 className="mt-5 display-text text-3xl sm:text-4xl lg:text-5xl">{post.title}</h1>
            <p className="mt-5 text-base leading-relaxed text-ink-soft sm:text-lg">{post.excerpt}</p>
            <dl className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 label-mono text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <dt className="sr-only">Author</dt>
                <dd className="text-foreground">{post.author}</dd>
              </div>
              <div className="flex items-center gap-1.5">
                <dt className="sr-only">Published</dt>
                <dd>
                  <time dateTime={post.date}>{formatDate(post.date)}</time>
                </dd>
              </div>
              {post.updated ? (
                <div className="flex items-center gap-1.5">
                  <dt>Updated</dt>
                  <dd>
                    <time dateTime={post.updated}>{formatDate(post.updated)}</time>
                  </dd>
                </div>
              ) : null}
              <div className="flex items-center gap-1.5">
                <Clock className="size-3" aria-hidden="true" />
                <dt className="sr-only">Reading time</dt>
                <dd>{post.readingTime} min read</dd>
              </div>
            </dl>
          </div>
        </header>

        {post.image ? (
          <figure className="container-narrow">
            <div className="relative aspect-[16/9] overflow-hidden rounded-md border border-border bg-muted shadow-(--shadow-card)">
              <Image
                src={post.image.src}
                alt={post.image.alt}
                fill
                priority
                sizes="(min-width: 1024px) 768px, 100vw"
                className="object-cover"
              />
            </div>
            {post.image.caption ? (
              <figcaption className="mt-2 text-xs text-muted-foreground">{post.image.caption}</figcaption>
            ) : null}
          </figure>
        ) : null}

        <Section spacing="md" narrow>
          <MdxContent source={post.body} />
          {post.tags.length || areas.length ? (
            <footer className="mt-12 space-y-4 border-t border-border pt-6">
              {post.tags.length ? (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="mr-1 label-mono text-muted-foreground">Tags</span>
                  {post.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={{ pathname: "/news", query: { tag } }}
                      className="hover:text-primary"
                    >
                      <Tag tone="outline" mono={false}>
                        #{tag}
                      </Tag>
                    </Link>
                  ))}
                </div>
              ) : null}
              {areas.length ? (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="mr-1 label-mono text-muted-foreground">Research</span>
                  {areas.map((area) => (
                    <Link
                      key={area.slug}
                      href={`/research/${area.slug}`}
                      className="text-sm text-primary link-underline"
                    >
                      {area.title}
                    </Link>
                  ))}
                </div>
              ) : null}
            </footer>
          ) : null}
          <Link
            href="/news"
            className="mt-10 inline-flex items-center gap-2 label-mono text-primary hover:underline"
          >
            <ArrowLeft className="size-3.5" aria-hidden="true" />
            All news
          </Link>
        </Section>
      </article>

      {related.length ? (
        <Section className="border-t border-border bg-card/50">
          <SectionHeading eyebrow="Related" title="Keep reading" size="md" />
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <li key={item.slug}>
                <NewsCard post={item} />
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      <JsonLd data={jsonLd} />
    </>
  );
}
