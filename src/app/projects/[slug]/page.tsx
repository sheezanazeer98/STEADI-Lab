import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookOpen, Code2, PlayCircle } from "lucide-react";
import { PageHero } from "@/components/shared/page-hero";
import { Section } from "@/components/shared/section";
import { SectionHeading } from "@/components/shared/section-heading";
import { BulletList, MetaList } from "@/components/shared/meta-list";
import { ExternalLink } from "@/components/shared/external-link";
import { JsonLd } from "@/components/shared/json-ld";
import { Cover } from "@/components/shared/cover-visual";
import { StatusTag, Tag } from "@/components/shared/tag";
import { PublicationCard } from "@/components/publications/publication-card";
import { ProductCard } from "@/components/products/product-card";
import { TeamMemberCard } from "@/components/people/team-member-card";
import { MdxContent } from "@/lib/content/mdx";
import {
  getProductsForProject,
  getProject,
  getProjects,
  getPublicationsForProject,
  resolvePeople,
  resolveResearchAreas,
} from "@/lib/content";
import { toStaticParams } from "@/lib/content/static-params";
import { buildMetadata } from "@/lib/seo";
import { absoluteUrl, siteConfig } from "@/lib/site";

export function generateStaticParams() {
  return toStaticParams(getProjects());
}

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return buildMetadata({
    title: project.title,
    description: project.summary,
    path: `/projects/${project.slug}`,
    keywords: [project.category, ...project.tags],
    image: project.cover?.src,
  });
}

function timelineLabel(timeline: { start: string; end?: string } | undefined, status: string) {
  if (!timeline) return undefined;
  if (timeline.end) return `${timeline.start} – ${timeline.end}`;
  return status === "Completed" ? timeline.start : `${timeline.start} – present`;
}

export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const areas = resolveResearchAreas(project.researchAreas);
  const people = resolvePeople(project.people);
  const publications = getPublicationsForProject(project);
  const products = getProductsForProject(project.slug);
  const areaTitles = Object.fromEntries(areas.map((area) => [area.slug, area.title]));
  const timeline = timelineLabel(project.timeline, project.status);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ResearchProject",
    name: project.title,
    description: project.summary,
    url: absoluteUrl(`/projects/${project.slug}`),
    keywords: [project.category, ...project.tags].join(", "),
    parentOrganization: { "@type": "ResearchOrganization", name: siteConfig.name, url: siteConfig.url },
    ...(project.timeline ? { foundingDate: project.timeline.start } : {}),
    ...(project.repoUrl ? { sameAs: project.repoUrl } : {}),
  };

  return (
    <>
      <PageHero
        eyebrow={project.category}
        title={project.title}
        breadcrumbs={[{ name: "Projects", href: "/projects" }]}
        description={project.summary}
        actions={
          <>
            {project.repoUrl ? (
              <ExternalLink href={project.repoUrl} icon={Code2} variant="button">
                Repository
              </ExternalLink>
            ) : null}
            {project.demoUrl ? (
              <ExternalLink href={project.demoUrl} icon={PlayCircle}>
                Live demo
              </ExternalLink>
            ) : null}
            {project.docsUrl ? (
              <ExternalLink href={project.docsUrl} icon={BookOpen}>
                Documentation
              </ExternalLink>
            ) : null}
          </>
        }
      >
        <div className="mt-8 flex flex-wrap items-center gap-2">
          <StatusTag status={project.status} />
          {timeline ? <span className="label-mono text-muted-foreground">{timeline}</span> : null}
        </div>
      </PageHero>

      <div className="container-wide">
        <Cover
          image={project.cover}
          seed={project.slug}
          label={project.category}
          priority
          sizes="(min-width: 1280px) 1200px, 100vw"
          className="aspect-[21/9] rounded-md border border-border shadow-(--shadow-card)"
        />
      </div>

      <Section spacing="md">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            {project.objectives.length ? (
              <div className="mb-10">
                <h2 className="label-mono text-primary">Research objectives</h2>
                <BulletList items={project.objectives} numbered className="mt-5" />
              </div>
            ) : null}
            {project.hasBody ? (
              <>
                <p className="label-mono text-primary">Project details</p>
                <MdxContent source={project.body} className="mt-4" />
              </>
            ) : (
              <>
                <h2 className="label-mono text-primary">Technical approach</h2>
                <p className="mt-4 leading-relaxed text-ink-soft">
                  A detailed technical write-up has not been added for this project yet.
                </p>
              </>
            )}
          </div>

          <aside className="space-y-8 lg:col-span-5">
            <MetaList
              items={[
                { label: "Category", value: project.category },
                { label: "Status", value: project.status },
                timeline && { label: "Timeline", value: timeline },
                project.techStack.length > 0 && {
                  label: "Stack",
                  value: (
                    <ul className="flex flex-wrap gap-1.5">
                      {project.techStack.map((tech) => (
                        <li key={tech}>
                          <Tag>{tech}</Tag>
                        </li>
                      ))}
                    </ul>
                  ),
                },
                project.tags.length > 0 && {
                  label: "Tags",
                  value: (
                    <ul className="flex flex-wrap gap-1.5">
                      {project.tags.map((tag) => (
                        <li key={tag}>
                          <Tag tone="outline" mono={false}>
                            {tag}
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
            {project.cover?.caption ? (
              <p className="text-xs text-muted-foreground">{project.cover.caption}</p>
            ) : null}
          </aside>
        </div>
      </Section>

      {people.length ? (
        <Section className="border-y border-border bg-card/50">
          <SectionHeading eyebrow="Team" title="Researchers on this project" size="md" />
          <ul className="mt-10 grid gap-5 sm:grid-cols-2">
            {people.map((person) => (
              <li key={person.slug}>
                <TeamMemberCard person={person} />
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {publications.length ? (
        <Section>
          <SectionHeading eyebrow="Publications" title="Papers from this project" size="md" />
          <div className="mt-8 border-t border-border">
            {publications.map((publication) => (
              <PublicationCard
                key={publication.slug}
                publication={publication}
                areaTitles={areaTitles}
                variant="row"
              />
            ))}
          </div>
        </Section>
      ) : null}

      {products.length ? (
        <Section className="border-y border-border bg-card/50">
          <SectionHeading eyebrow="Software" title="Tools built in this project" size="md" />
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <li key={product.slug}>
                <ProductCard product={product} />
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      <JsonLd data={jsonLd} />
    </>
  );
}
