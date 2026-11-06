import type { Metadata } from "next";
import { Newspaper } from "lucide-react";
import { PageHero } from "@/components/shared/page-hero";
import { Section } from "@/components/shared/section";
import { EmptyState } from "@/components/shared/empty-state";
import { NewsDirectory } from "@/components/news/news-directory";
import { getNewsPosts } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { newsCategoryValues } from "@/types/content";

export const metadata: Metadata = buildMetadata({
  title: "News & Insights",
  description:
    "Lab updates, research notes, publication announcements, conference reports and opportunities from STEADI Lab.",
  path: "/news",
});

export default function NewsPage() {
  const posts = getNewsPosts();

  return (
    <>
      <PageHero
        eyebrow="News & insights"
        title={
          <>
            Notes from the <span className="text-primary">lab</span>.
          </>
        }
        current="News"
        breadcrumbs={[]}
        description="Research updates, explainers, publication news and opportunities. Written by lab members, published as they happen."
      >
        <ul className="mt-8 flex flex-wrap gap-2" aria-label="News categories">
          {newsCategoryValues.map((category) => (
            <li
              key={category}
              className="rounded-sm border border-border px-2 py-1 label-mono text-muted-foreground"
            >
              {category}
            </li>
          ))}
        </ul>
      </PageHero>
      <Section spacing="sm" className="border-t border-border pt-10">
        {posts.length ? (
          <NewsDirectory posts={posts} />
        ) : (
          <EmptyState
            icon={Newspaper}
            title="No articles have been published yet"
            description="News posts are written in MDX with an author, date, category, tags and optional featured image. The first post will appear here with search and filtering."
            hint="src/content/news/"
          />
        )}
      </Section>
    </>
  );
}
