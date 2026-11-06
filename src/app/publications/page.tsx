import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/shared/page-hero";
import { Section } from "@/components/shared/section";
import { EmptyState } from "@/components/shared/empty-state";
import { PublicationDirectory } from "@/components/publications/publication-directory";
import { getPublicationYears, getPublications, getResearchAreas } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { publicationTypeValues } from "@/types/content";

export const metadata: Metadata = buildMetadata({
  title: "Publications",
  description:
    "Journal articles, conference and workshop papers, preprints, technical reports and posters from STEADI Lab, with PDFs, DOIs, code, datasets and BibTeX.",
  path: "/publications",
});

export default function PublicationsPage() {
  const publications = getPublications();
  const years = getPublicationYears();
  const areas = Object.fromEntries(getResearchAreas().map((area) => [area.slug, area.title]));

  return (
    <>
      <PageHero
        eyebrow="Publications"
        title={
          <>
            Research <span className="text-primary">output</span>, openly documented.
          </>
        }
        current="Publications"
        breadcrumbs={[]}
        description="Search by title, author or keyword; filter by year, research area and paper type; copy a citation in one click."
      >
        <ul className="mt-8 flex flex-wrap gap-2" aria-label="Publication categories">
          {publicationTypeValues.map((type) => (
            <li
              key={type}
              className="rounded-sm border border-border px-2 py-1 label-mono text-muted-foreground"
            >
              {type}
            </li>
          ))}
        </ul>
      </PageHero>
      <Section spacing="sm" className="border-t border-border pt-10">
        {publications.length ? (
          <PublicationDirectory publications={publications} years={years} areas={areas} />
        ) : (
          <EmptyState
            title="The publication directory is empty"
            description={
              <>
                Only verified publications are listed. Add records to the content library and they will appear
                here with search, filters, metadata and BibTeX export. Browse the{" "}
                <Link href="/research" className="text-primary link-underline">
                  research areas
                </Link>{" "}
                in the meantime.
              </>
            }
            hint="src/content/publications/"
          />
        )}
      </Section>
    </>
  );
}
