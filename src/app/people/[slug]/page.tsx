import type { ComponentType } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Globe, Mail } from "lucide-react";
import { Backdrop } from "@/components/shared/backdrop";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { Section } from "@/components/shared/section";
import { SectionHeading } from "@/components/shared/section-heading";
import { MetaList } from "@/components/shared/meta-list";
import { JsonLd } from "@/components/shared/json-ld";
import { Tag } from "@/components/shared/tag";
import { GitHubIcon, LinkedInIcon, OrcidIcon, ScholarIcon } from "@/components/shared/brand-icons";
import { Avatar } from "@/components/people/team-member-card";
import { PublicationCard } from "@/components/publications/publication-card";
import { ProjectCard } from "@/components/projects/project-card";
import { ProductCard } from "@/components/products/product-card";
import { MdxContent } from "@/lib/content/mdx";
import {
  getPeople,
  getPerson,
  getProductsForPerson,
  getProjectsForPerson,
  getPublicationsForPerson,
  getResearchAreas,
  resolveResearchAreas,
} from "@/lib/content";
import { toStaticParams } from "@/lib/content/static-params";
import { buildMetadata } from "@/lib/seo";
import { absoluteUrl, siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

export function generateStaticParams() {
  return toStaticParams(getPeople());
}

export async function generateMetadata({ params }: PageProps<"/people/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const person = getPerson(slug);
  if (!person) return {};
  return buildMetadata({
    title: person.name,
    description:
      `${person.name} — ${person.title ?? person.role}, ${person.affiliation}. ${person.interests.join(", ")}`.trim(),
    path: `/people/${person.slug}`,
    type: "profile",
    image: person.photo?.src,
  });
}

function orcidUrl(orcid: string): string {
  return orcid.startsWith("http") ? orcid : `https://orcid.org/${orcid}`;
}

type ProfileLink = { label: string; href: string; icon: ComponentType<{ className?: string }> };

export default async function PersonPage({ params }: PageProps<"/people/[slug]">) {
  const { slug } = await params;
  const person = getPerson(slug);
  if (!person) notFound();

  const areas = resolveResearchAreas(person.researchAreas);
  const publications = getPublicationsForPerson(person.slug);
  const projects = getProjectsForPerson(person.slug);
  const products = getProductsForPerson(person.slug);
  const areaTitles = Object.fromEntries(getResearchAreas().map((area) => [area.slug, area.title]));

  const candidates: Array<ProfileLink | "" | undefined> = [
    person.website && { label: "Website", href: person.website, icon: Globe },
    person.scholar && { label: "Google Scholar", href: person.scholar, icon: ScholarIcon },
    person.orcid && { label: "ORCID", href: orcidUrl(person.orcid), icon: OrcidIcon },
    person.github && { label: "GitHub", href: person.github, icon: GitHubIcon },
    person.linkedin && { label: "LinkedIn", href: person.linkedin, icon: LinkedInIcon },
  ];
  const links = candidates.filter((link): link is ProfileLink => Boolean(link));

  const jsonLd = person.organization
    ? {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: person.name,
        url: absoluteUrl(`/people/${person.slug}`),
        ...(person.title ? { description: person.title } : {}),
        ...(person.email ? { email: person.email } : {}),
        ...(person.photo ? { logo: absoluteUrl(person.photo.src) } : {}),
        ...(links.length ? { sameAs: links.map((link) => link.href) } : {}),
      }
    : {
        "@context": "https://schema.org",
        "@type": "Person",
        name: person.name,
        url: absoluteUrl(`/people/${person.slug}`),
        ...(person.title ? { jobTitle: person.title } : {}),
        affiliation: { "@type": "CollegeOrUniversity", name: person.affiliation },
        memberOf: { "@type": "ResearchOrganization", name: siteConfig.name, url: siteConfig.url },
        ...(person.email ? { email: person.email } : {}),
        ...(person.photo ? { image: absoluteUrl(person.photo.src) } : {}),
        knowsAbout: person.interests,
        ...(links.length ? { sameAs: links.map((link) => link.href) } : {}),
      };

  return (
    <>
      <section className="relative overflow-hidden">
        <Backdrop density="low" />
        <div className="relative container-wide pt-14 pb-12 sm:pt-20 sm:pb-16">
          <Breadcrumbs items={[{ name: "People", href: "/people" }]} current={person.name} className="mb-8" />
          <div className="flex flex-col gap-8 sm:flex-row sm:items-start">
            <Avatar person={person} size="lg" className="shadow-(--shadow-card)" />
            <div className="min-w-0">
              <p className="mb-3 label-mono text-primary">{person.role}</p>
              <h1 className="display-text text-3xl sm:text-4xl lg:text-5xl">{person.name}</h1>
              <div className="mt-4 max-w-2xl text-base leading-relaxed text-ink-soft sm:text-lg">
                {person.title ? (
                  <span className="block font-medium text-foreground">{person.title}</span>
                ) : null}
                <span className="block">{person.affiliation}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Section spacing="md" className="border-t border-border">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <h2 className="label-mono text-primary">Biography</h2>
            {person.hasBody ? (
              <MdxContent source={person.body} className="mt-4 [&>h2]:text-xl" />
            ) : (
              <p className="mt-4 leading-relaxed text-ink-soft">
                A biography has not been added for this profile yet.
              </p>
            )}
          </div>
          <aside className="space-y-8 lg:col-span-5">
            <MetaList
              items={[
                { label: "Role", value: person.role },
                { label: "Affiliation", value: person.affiliation },
                person.email && {
                  label: "Email",
                  value: (
                    <a
                      href={`mailto:${person.email}`}
                      className="inline-flex items-center gap-1.5 break-all text-primary link-underline"
                    >
                      <Mail className="size-3.5" aria-hidden="true" />
                      {person.email}
                    </a>
                  ),
                },
                person.interests.length > 0 && {
                  label: "Interests",
                  value: (
                    <ul className="flex flex-wrap gap-1.5">
                      {person.interests.map((interest) => (
                        <li key={interest}>
                          <Tag tone="outline" mono={false}>
                            {interest}
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
            {links.length ? (
              <div>
                <h2 className="label-mono text-muted-foreground">Profiles</h2>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer me"
                        className={cn(
                          "inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:border-primary hover:text-primary",
                          "focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                        )}
                      >
                        <link.icon className="size-3.5" />
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </aside>
        </div>
      </Section>

      <Section className="border-y border-border bg-card/50">
        <SectionHeading
          eyebrow="Publications"
          title="Selected publications"
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
            <p className="text-sm text-muted-foreground">No publications are linked to this profile yet.</p>
          )}
        </div>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="Projects"
          title="Projects"
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
            <p className="text-sm text-muted-foreground">No projects are linked to this profile yet.</p>
          )}
        </div>
      </Section>

      {products.length ? (
        <Section className="border-y border-border bg-card/50">
          <SectionHeading eyebrow="Software" title="Products and tools" size="md" />
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
