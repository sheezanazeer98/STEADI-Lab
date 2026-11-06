import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { PageHero } from "@/components/shared/page-hero";
import { Section } from "@/components/shared/section";
import { SectionHeading } from "@/components/shared/section-heading";
import { BulletList } from "@/components/shared/meta-list";
import { StatusTag, Tag } from "@/components/shared/tag";
import { EmptyState } from "@/components/shared/empty-state";
import { ResearchIcon } from "@/components/research/research-icon";
import { ProjectCard } from "@/components/projects/project-card";
import { ProductCard } from "@/components/products/product-card";
import { PublicationCard } from "@/components/publications/publication-card";
import { TeamMemberCard } from "@/components/people/team-member-card";
import { MdxContent } from "@/lib/content/mdx";
import {
  getPeopleForResearchArea,
  getProductsForResearchArea,
  getProjectsForResearchArea,
  getPublicationsForResearchArea,
  getResearchArea,
  getResearchAreas,
} from "@/lib/content";
import { toStaticParams } from "@/lib/content/static-params";
import { buildMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return toStaticParams(getResearchAreas());
}

export async function generateMetadata({ params }: PageProps<"/research/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const area = getResearchArea(slug);
  if (!area) return {};
  return buildMetadata({
    title: area.title,
    description: area.summary,
    path: `/research/${area.slug}`,
    keywords: area.keywords,
  });
}

export default async function ResearchAreaPage({ params }: PageProps<"/research/[slug]">) {
  const { slug } = await params;
  const area = getResearchArea(slug);
  if (!area) notFound();

  const areas = getResearchAreas();
  const index = areas.findIndex((candidate) => candidate.slug === area.slug);
  const previous = areas[(index - 1 + areas.length) % areas.length];
  const next = areas[(index + 1) % areas.length];
  const areaTitles = Object.fromEntries(areas.map((item) => [item.slug, item.title]));

  const projects = getProjectsForResearchArea(area.slug);
  const publications = getPublicationsForResearchArea(area.slug);
  const products = getProductsForResearchArea(area.slug);
  const people = getPeopleForResearchArea(area);

  return (
    <>
      <PageHero
        eyebrow={`Research area ${String(index + 1).padStart(2, "0")} / ${String(areas.length).padStart(2, "0")}`}
        title={area.title}
        breadcrumbs={[{ name: "Research", href: "/research" }]}
        description={area.summary}
      >
        <div className="mt-8 flex flex-wrap items-center gap-2">
          <span className="flex size-10 items-center justify-center rounded-md border border-border bg-card text-primary">
            <ResearchIcon name={area.icon} />
          </span>
          <StatusTag status={area.status} />
          {area.keywords.map((keyword) => (
            <Tag key={keyword} tone="outline" mono={false}>
              {keyword}
            </Tag>
          ))}
        </div>
      </PageHero>

      <Section spacing="md" className="border-t border-border">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            {area.hasBody ? (
              <MdxContent source={area.body} />
            ) : (
              <p className="leading-relaxed text-ink-soft">{area.summary}</p>
            )}
          </div>
          <aside className="space-y-10 lg:col-span-5">
            {area.questions.length ? (
              <div className="rounded-md border border-border bg-card p-6">
                <h2 className="label-mono text-primary">Research questions</h2>
                <BulletList items={area.questions} numbered className="mt-5" />
              </div>
            ) : null}
            {area.methodologies.length ? (
              <div className="rounded-md border border-border bg-card p-6">
                <h2 className="label-mono text-primary">Methodologies</h2>
                <BulletList items={area.methodologies} className="mt-5" />
              </div>
            ) : null}
            <div className="rounded-md border border-border bg-card p-6">
              <h2 className="label-mono text-primary">At a glance</h2>
              <dl className="mt-4 grid grid-cols-3 gap-4 text-center">
                {[
                  { label: "Projects", value: projects.length },
                  { label: "Papers", value: publications.length },
                  { label: "People", value: people.length },
                ].map((stat) => (
                  <div key={stat.label}>
                    <dd className="font-heading text-3xl font-extrabold">{stat.value}</dd>
                    <dt className="mt-1 label-mono text-muted-foreground">{stat.label}</dt>
                  </div>
                ))}
              </dl>
            </div>
          </aside>
        </div>
      </Section>

      <Section className="border-y border-border bg-card/50">
        <SectionHeading
          eyebrow="Related projects"
          title="Projects in this area"
          size="md"
          action={
            <Link href="/projects" className="label-mono text-primary hover:underline">
              All projects
            </Link>
          }
        />
        <div className="mt-10">
          {projects.length ? (
            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <li key={project.slug}>
                  <ProjectCard project={project} />
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              title="No projects linked yet"
              description="Projects reference research areas through their frontmatter and appear here automatically."
              hint="src/content/projects/"
            />
          )}
        </div>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="Related publications"
          title="Publications in this area"
          size="md"
          action={
            <Link href="/publications" className="label-mono text-primary hover:underline">
              All publications
            </Link>
          }
        />
        <div className="mt-8">
          {publications.length ? (
            <div className="border-t border-border">
              {publications.map((publication) => (
                <PublicationCard
                  key={publication.slug}
                  publication={publication}
                  areaTitles={areaTitles}
                  variant="row"
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No publications linked yet"
              description="Verified publications tagged with this research area will be listed here."
              hint="src/content/publications/"
            />
          )}
        </div>
      </Section>

      {products.length ? (
        <Section className="border-y border-border bg-card/50">
          <SectionHeading eyebrow="Related products" title="Software from this area" size="md" />
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <li key={product.slug}>
                <ProductCard product={product} />
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      <Section>
        <SectionHeading
          eyebrow="Research team"
          title="People working in this area"
          size="md"
          action={
            <Link href="/people" className="label-mono text-primary hover:underline">
              Everyone
            </Link>
          }
        />
        <div className="mt-10">
          {people.length ? (
            <ul className="grid gap-5 sm:grid-cols-2">
              {people.map((person) => (
                <li key={person.slug}>
                  <TeamMemberCard person={person} />
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              title="Team members will be listed here"
              description="Verified profiles that reference this research area appear automatically."
              hint="src/content/people/"
            />
          )}
        </div>
      </Section>

      <nav
        aria-label="Research area navigation"
        className="container-wide grid gap-4 border-t border-border py-10 sm:grid-cols-2"
      >
        <Link
          href={`/research/${previous.slug}`}
          className="group flex items-center gap-4 rounded-md border border-border bg-card p-5 transition-colors hover:border-primary"
        >
          <ArrowLeft className="size-5 shrink-0 text-primary" aria-hidden="true" />
          <span>
            <span className="block label-mono text-muted-foreground">Previous</span>
            <span className="font-semibold">{previous.title}</span>
          </span>
        </Link>
        <Link
          href={`/research/${next.slug}`}
          className="group flex items-center justify-end gap-4 rounded-md border border-border bg-card p-5 text-right transition-colors hover:border-primary"
        >
          <span>
            <span className="block label-mono text-muted-foreground">Next</span>
            <span className="font-semibold">{next.title}</span>
          </span>
          <ArrowRight className="size-5 shrink-0 text-primary" aria-hidden="true" />
        </Link>
      </nav>
    </>
  );
}
