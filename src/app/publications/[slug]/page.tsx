import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Code2, Database, Download, ExternalLink as ExternalLinkIcon } from "lucide-react";
import { PageHero } from "@/components/shared/page-hero";
import { Section } from "@/components/shared/section";
import { SectionHeading } from "@/components/shared/section-heading";
import { MetaList } from "@/components/shared/meta-list";
import { ExternalLink } from "@/components/shared/external-link";
import { JsonLd } from "@/components/shared/json-ld";
import { StatusTag, Tag } from "@/components/shared/tag";
import { CitationActions } from "@/components/publications/citation-actions";
import { ProjectCard } from "@/components/projects/project-card";
import { TeamMemberCard } from "@/components/people/team-member-card";
import { MdxContent } from "@/lib/content/mdx";
import {
  getProjectsForPublication,
  getPublication,
  getPublications,
  resolvePeople,
  resolveResearchAreas,
} from "@/lib/content";
import { doiUrl, toBibtex, toPlainCitation } from "@/lib/bibtex";
import { formatAuthors } from "@/lib/format";
import { toStaticParams } from "@/lib/content/static-params";
import { buildMetadata } from "@/lib/seo";
import { absoluteUrl, siteConfig } from "@/lib/site";

export function generateStaticParams() {
  return toStaticParams(getPublications());
}

export async function generateMetadata({ params }: PageProps<"/publications/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const publication = getPublication(slug);
  if (!publication) return {};
  return buildMetadata({
    title: publication.title,
    description: publication.abstract.slice(0, 200),
    path: `/publications/${publication.slug}`,
    type: "article",
    authors: publication.authors,
    keywords: publication.keywords,
    publishedTime: `${publication.year}-${String(publication.month ?? 1).padStart(2, "0")}-01`,
  });
}

export default async function PublicationPage({ params }: PageProps<"/publications/[slug]">) {
  const { slug } = await params;
  const publication = getPublication(slug);
  if (!publication) notFound();

  const areas = resolveResearchAreas(publication.researchAreas);
  const projects = getProjectsForPublication(publication);
  const people = resolvePeople(publication.people);
  const bibtex = toBibtex(publication);
  const citation = toPlainCitation(publication);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ScholarlyArticle",
    headline: publication.title,
    abstract: publication.abstract,
    author: publication.authors.map((name) => ({ "@type": "Person", name })),
    datePublished: String(publication.year),
    keywords: publication.keywords.join(", "),
    url: absoluteUrl(`/publications/${publication.slug}`),
    ...(publication.doi ? { sameAs: doiUrl(publication.doi), identifier: publication.doi } : {}),
    ...(publication.venue ? { isPartOf: { "@type": "Periodical", name: publication.venue } } : {}),
    publisher: { "@type": "Organization", name: siteConfig.name },
  };

  return (
    <>
      <PageHero
        size="md"
        title={publication.title}
        breadcrumbs={[{ name: "Publications", href: "/publications" }]}
        current={publication.title}
        description={
          <>
            <span className="font-medium text-foreground">{formatAuthors(publication.authors, 12)}</span>
            {publication.venue ? <span className="block italic">{publication.venue}</span> : null}
          </>
        }
      >
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <Tag tone="accent">{publication.type}</Tag>
          <span className="label-mono text-muted-foreground">{publication.year}</span>
          <StatusTag status={publication.status} />
        </div>
      </PageHero>

      <Section spacing="md" className="border-t border-border">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <h2 className="label-mono text-primary">Abstract</h2>
            <p className="mt-4 text-base leading-relaxed text-ink-soft sm:text-lg">{publication.abstract}</p>
            {publication.hasBody ? <MdxContent source={publication.body} className="mt-8" /> : null}

            <div className="mt-10 flex flex-wrap gap-2">
              {publication.pdfUrl ? (
                <ExternalLink href={publication.pdfUrl} icon={Download} variant="button">
                  Download PDF
                </ExternalLink>
              ) : null}
              {publication.doi ? (
                <ExternalLink href={doiUrl(publication.doi)} icon={ExternalLinkIcon}>
                  DOI
                </ExternalLink>
              ) : null}
              {publication.publisherUrl ? (
                <ExternalLink href={publication.publisherUrl} icon={ExternalLinkIcon}>
                  Publisher
                </ExternalLink>
              ) : null}
              {publication.githubUrl ? (
                <ExternalLink href={publication.githubUrl} icon={Code2}>
                  Code
                </ExternalLink>
              ) : null}
              {publication.datasetUrl ? (
                <ExternalLink href={publication.datasetUrl} icon={Database}>
                  Dataset
                </ExternalLink>
              ) : null}
            </div>
            {!publication.pdfUrl ? (
              <p className="mt-4 text-xs text-muted-foreground">
                A PDF has not been attached to this record.
              </p>
            ) : null}

            <div className="mt-12">
              <h2 className="label-mono text-primary">Cite this work</h2>
              <CitationActions bibtex={bibtex} citation={citation} className="mt-4" />
            </div>
          </div>

          <aside className="lg:col-span-5">
            <MetaList
              items={[
                { label: "Type", value: publication.type },
                { label: "Status", value: publication.status },
                { label: "Year", value: publication.year },
                publication.venue && { label: "Venue", value: publication.venue },
                publication.doi && {
                  label: "DOI",
                  value: (
                    <a
                      href={doiUrl(publication.doi)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="break-all text-primary link-underline"
                    >
                      {publication.doi}
                    </a>
                  ),
                },
                publication.keywords.length > 0 && {
                  label: "Keywords",
                  value: (
                    <ul className="flex flex-wrap gap-1.5">
                      {publication.keywords.map((keyword) => (
                        <li key={keyword}>
                          <Tag tone="outline" mono={false}>
                            {keyword}
                          </Tag>
                        </li>
                      ))}
                    </ul>
                  ),
                },
                areas.length > 0 && {
                  label: "Research areas",
                  value: (
                    <ul className="space-y-1">
                      {areas.map((area) => (
                        <li key={area.slug}>
                          <Link href={`/research/${area.slug}`} className="text-primary link-underline">
                            {area.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ),
                },
              ]}
            />
          </aside>
        </div>
      </Section>

      {projects.length ? (
        <Section className="border-y border-border bg-card/50">
          <SectionHeading eyebrow="Related projects" title="Projects behind this work" size="md" />
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <li key={project.slug}>
                <ProjectCard project={project} />
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {people.length ? (
        <Section>
          <SectionHeading eyebrow="Lab authors" title="STEADI Lab members on this paper" size="md" />
          <ul className="mt-10 grid gap-5 sm:grid-cols-2">
            {people.map((person) => (
              <li key={person.slug}>
                <TeamMemberCard person={person} />
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      <JsonLd data={jsonLd} />
    </>
  );
}
