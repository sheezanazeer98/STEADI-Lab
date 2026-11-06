import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookOpen, Code2, PlayCircle } from "lucide-react";
import { PageHero } from "@/components/shared/page-hero";
import { Section } from "@/components/shared/section";
import { SectionHeading } from "@/components/shared/section-heading";
import { MetaList } from "@/components/shared/meta-list";
import { ExternalLink } from "@/components/shared/external-link";
import { JsonLd } from "@/components/shared/json-ld";
import { GenerativeCover } from "@/components/shared/cover-visual";
import { StatusTag, Tag } from "@/components/shared/tag";
import { ProjectCard } from "@/components/projects/project-card";
import { TeamMemberCard } from "@/components/people/team-member-card";
import { MdxContent } from "@/lib/content/mdx";
import {
  getProduct,
  getProducts,
  getProjectsForProduct,
  resolvePeople,
  resolveResearchAreas,
} from "@/lib/content";
import { toStaticParams } from "@/lib/content/static-params";
import { buildMetadata } from "@/lib/seo";
import { absoluteUrl, siteConfig } from "@/lib/site";

export function generateStaticParams() {
  return toStaticParams(getProducts());
}

export async function generateMetadata({ params }: PageProps<"/products/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};
  return buildMetadata({
    title: product.name,
    description: product.summary,
    path: `/products/${product.slug}`,
    keywords: [product.category, ...product.techStack],
    image: product.screenshots[0]?.src,
  });
}

const statusNotes: Record<string, string> = {
  Concept: "This is a design-stage concept. No software is available yet.",
  Prototype: "Research prototype. Expect rough edges and breaking changes.",
  Alpha: "Early alpha. Functional but incomplete and not yet suitable for production use.",
  Beta: "Beta release. Feature-complete for its scope; feedback is welcome.",
  Released: "Released software with a stable interface.",
  Archived: "No longer maintained. Kept available for reference and reproducibility.",
};

export default async function ProductPage({ params }: PageProps<"/products/[slug]">) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const areas = resolveResearchAreas(product.researchAreas);
  const projects = getProjectsForProduct(product);
  const people = resolvePeople(product.people);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: product.name,
    description: product.summary,
    url: absoluteUrl(`/products/${product.slug}`),
    applicationCategory: product.category,
    ...(product.githubUrl ? { codeRepository: product.githubUrl } : {}),
    ...(product.license ? { license: product.license } : {}),
    ...(product.version ? { version: product.version } : {}),
    programmingLanguage: product.techStack,
    author: { "@type": "ResearchOrganization", name: siteConfig.name, url: siteConfig.url },
  };

  return (
    <>
      <PageHero
        eyebrow={product.category}
        title={product.name}
        breadcrumbs={[{ name: "Products", href: "/products" }]}
        description={product.summary}
        actions={
          <>
            {product.githubUrl ? (
              <ExternalLink href={product.githubUrl} icon={Code2} variant="button">
                GitHub repository
              </ExternalLink>
            ) : null}
            {product.demoUrl ? (
              <ExternalLink href={product.demoUrl} icon={PlayCircle}>
                Live demo
              </ExternalLink>
            ) : null}
            {product.docsUrl ? (
              <ExternalLink href={product.docsUrl} icon={BookOpen}>
                Documentation
              </ExternalLink>
            ) : null}
          </>
        }
      >
        <div className="mt-8 flex flex-wrap items-center gap-2">
          <StatusTag status={product.status} />
          {product.version ? (
            <span className="label-mono text-muted-foreground">v{product.version}</span>
          ) : null}
          {product.license ? (
            <span className="label-mono text-muted-foreground">{product.license}</span>
          ) : null}
        </div>
      </PageHero>

      <div className="container-wide">
        {product.screenshots.length ? (
          <ul className={product.screenshots.length > 1 ? "grid gap-4 sm:grid-cols-2" : undefined}>
            {product.screenshots.map((shot) => (
              <li
                key={shot.src}
                className="relative overflow-hidden rounded-md border border-border bg-muted shadow-(--shadow-card)"
              >
                <Image
                  src={shot.src}
                  alt={shot.alt}
                  width={shot.width ?? 1600}
                  height={shot.height ?? 900}
                  sizes="(min-width: 1280px) 600px, 100vw"
                  className="h-auto w-full"
                />
                {shot.caption ? (
                  <p className="border-t border-border px-4 py-2 text-xs text-muted-foreground">
                    {shot.caption}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        ) : (
          <GenerativeCover
            seed={product.slug}
            label={product.category}
            className="aspect-[21/9] rounded-md border border-border shadow-(--shadow-card)"
          />
        )}
      </div>

      <Section spacing="md">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <div className="mb-8 rounded-md border border-dashed border-primary/40 bg-primary/5 px-4 py-3 text-sm">
              <span className="mr-2 label-mono text-primary">Status</span>
              {statusNotes[product.status]}
            </div>
            {product.hasBody ? (
              <>
                <p className="label-mono text-primary">Overview</p>
                <MdxContent source={product.body} className="mt-4" />
              </>
            ) : (
              <>
                <h2 className="label-mono text-primary">Overview</h2>
                <p className="mt-4 leading-relaxed text-ink-soft">{product.summary}</p>
              </>
            )}
          </div>
          <aside className="lg:col-span-5">
            <MetaList
              items={[
                { label: "Category", value: product.category },
                { label: "Status", value: product.status },
                product.version && { label: "Version", value: product.version },
                product.license && { label: "License", value: product.license },
                product.techStack.length > 0 && {
                  label: "Stack",
                  value: (
                    <ul className="flex flex-wrap gap-1.5">
                      {product.techStack.map((tech) => (
                        <li key={tech}>
                          <Tag>{tech}</Tag>
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
          <SectionHeading eyebrow="Associated research" title="Projects behind this software" size="md" />
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
          <SectionHeading eyebrow="Maintainers" title="People behind this work" size="md" />
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
