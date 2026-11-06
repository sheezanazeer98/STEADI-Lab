import type { Metadata } from "next";
import { Library } from "lucide-react";
import { PageHero } from "@/components/shared/page-hero";
import { Section } from "@/components/shared/section";
import { EmptyState } from "@/components/shared/empty-state";
import { ResourceLibrary } from "@/components/resources/resource-library";
import { getResearchAreas, getResources } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { resourceCategoryValues } from "@/types/content";

export const metadata: Metadata = buildMetadata({
  title: "Resources",
  description:
    "Datasets, open-source code, research tools, documentation, tutorials, educational materials, benchmarks and presentations from STEADI Lab.",
  path: "/resources",
});

export default function ResourcesPage() {
  const resources = getResources();
  const areas = Object.fromEntries(getResearchAreas().map((area) => [area.slug, area.title]));

  return (
    <>
      <PageHero
        eyebrow="Resources"
        title={
          <>
            A library for <span className="text-primary">reproducible</span> research.
          </>
        }
        current="Resources"
        breadcrumbs={[]}
        description="Datasets, code, tools, documentation and teaching material released by the lab. Each entry links to its repository or download, and states its format and license where known."
      >
        <ul className="mt-8 flex flex-wrap gap-2" aria-label="Resource categories">
          {resourceCategoryValues.map((category) => (
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
        {resources.length ? (
          <ResourceLibrary resources={resources} areas={areas} />
        ) : (
          <EmptyState
            icon={Library}
            title="No resources have been released yet"
            description="Datasets, code and materials will be listed here with search and filters once they are published."
            hint="src/content/resources/"
          />
        )}
      </Section>
    </>
  );
}
