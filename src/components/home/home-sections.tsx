import type { ReactNode } from "react";
import Link from "next/link";
import type { Route } from "next";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { Reveal } from "@/components/shared/reveal";
import { Section } from "@/components/shared/section";
import { SectionHeading } from "@/components/shared/section-heading";
import { ResearchAreaCard } from "@/components/research/research-area-card";
import { PublicationCard } from "@/components/publications/publication-card";
import { ProjectCard } from "@/components/projects/project-card";
import { ProductCard } from "@/components/products/product-card";
import { TeamMemberCard } from "@/components/people/team-member-card";
import { NewsCard } from "@/components/news/news-card";
import { TerminalPanel } from "@/components/home/terminal-panel";
import { siteConfig } from "@/lib/site";
import type { NewsPost, Person, Product, Project, Publication, ResearchArea } from "@/types/content";

const viewAllClass =
  "label-mono text-primary inline-flex items-center gap-1.5 hover:underline underline-offset-4";

function ViewAll({ href, children }: { href: Route; children: ReactNode }) {
  return (
    <Link href={href} className={viewAllClass}>
      {children}
      <ArrowRight className="size-3.5" aria-hidden="true" />
    </Link>
  );
}

/* -------------------------------------------------------------------------- */
/* Thesis                                                                      */
/* -------------------------------------------------------------------------- */

export function ThesisSection() {
  return (
    <Section spacing="lg">
      <Reveal>
        <p className="max-w-5xl display-text text-3xl leading-[1.08] sm:text-4xl lg:text-[3.4rem]">
          <span className="text-primary">Our thesis:</span> trustworthy computing isn&apos;t a single model or
          a single chain. It is a composable system where intelligence is verifiable, decisions are
          accountable, and every component can be checked by someone other than its author.
        </p>
      </Reveal>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/* About                                                                       */
/* -------------------------------------------------------------------------- */

export function AboutSection() {
  const facts = [
    { label: "Institution", value: siteConfig.institution.name },
    {
      label: "Location",
      value: `${siteConfig.institution.city}, ${siteConfig.institution.region}, ${siteConfig.institution.country}`,
    },
    { label: "Focus", value: "Artificial intelligence × blockchain technology" },
    { label: "Approach", value: "Research → build → verify → share" },
  ];
  return (
    <Section id="about" aria-labelledby="about-heading">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <SectionHeading
            eyebrow="01 — About STEADI Lab"
            title={<span id="about-heading">A research lab where intelligence meets verification.</span>}
          />
          <p className="mt-6 text-base leading-relaxed text-ink-soft sm:text-lg">{siteConfig.description}</p>
          <p className="mt-4 text-base leading-relaxed text-ink-soft sm:text-lg">
            We research and build practical systems at the intersection of learning and distributed ledgers —
            from provenance and smart-contract verification to bounded autonomous agents — and we share what
            we learn through publications, open-source software and collaboration.
          </p>
          <Link
            href="/about"
            className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
          >
            More about the lab
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
        <dl className="divide-y divide-border self-start rounded-md border border-border lg:col-span-5">
          {facts.map((fact) => (
            <div key={fact.label} className="px-5 py-4">
              <dt className="label-mono text-primary">{fact.label}</dt>
              <dd className="mt-1 text-base font-semibold">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/* Research areas                                                              */
/* -------------------------------------------------------------------------- */

export function ResearchAreasSection({
  areas,
  total,
  counts,
}: {
  areas: ResearchArea[];
  total: number;
  counts: Record<string, { projects: number; publications: number }>;
}) {
  return (
    <Section id="research-areas" className="border-y border-border bg-card/50">
      <SectionHeading
        eyebrow="02 — Research areas"
        title="Nine connected lines of inquiry."
        description="From learning systems and explainability to ledgers, smart contracts and governance — each area informs the others."
        action={<ViewAll href="/research">All {total} research areas</ViewAll>}
      />
      <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {areas.map((area, index) => (
          <Reveal key={area.slug} as="li" delay={Math.min(index, 5) * 0.05}>
            <ResearchAreaCard area={area} index={index + 1} counts={counts[area.slug]} />
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/* Projects                                                                    */
/* -------------------------------------------------------------------------- */

export function FeaturedProjectsSection({ projects }: { projects: Project[] }) {
  return (
    <Section id="projects">
      <SectionHeading
        eyebrow="03 — Featured projects"
        title="Research that ships as working systems."
        description="Each project pairs a research question with a prototype, a measurement and, where it holds up, a tool others can use."
        action={<ViewAll href="/projects">All projects</ViewAll>}
      />
      <div className="mt-12">
        {projects.length === 0 ? (
          <EmptyState
            title="Projects will be listed here"
            description="Research projects appear automatically once they are added to the content library."
            hint="src/content/projects/"
          />
        ) : (
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, index) => (
              <Reveal key={project.slug} as="li" delay={index * 0.06}>
                <ProjectCard project={project} />
              </Reveal>
            ))}
          </ul>
        )}
      </div>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/* Publications                                                                */
/* -------------------------------------------------------------------------- */

export function RecentPublicationsSection({
  publications,
  areaTitles,
}: {
  publications: Publication[];
  areaTitles: Record<string, string>;
}) {
  return (
    <Section id="publications" className="border-y border-border bg-card/50">
      <SectionHeading
        eyebrow="04 — Recent publications"
        title="Peer-reviewed and openly shared."
        action={<ViewAll href="/publications">Publication directory</ViewAll>}
      />
      <div className="mt-10">
        {publications.length === 0 ? (
          <EmptyState
            title="Publications will be listed here"
            description="Add verified papers, reports and preprints to populate the directory. Nothing is listed until it has been confirmed."
            hint="src/content/publications/"
          />
        ) : (
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
        )}
      </div>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/* Products                                                                    */
/* -------------------------------------------------------------------------- */

export function ProductsSection({ products }: { products: Product[] }) {
  return (
    <Section id="products">
      <SectionHeading
        eyebrow="05 — AI and blockchain products"
        title="Tools, prototypes and open source."
        description="Software that comes out of the lab — labelled honestly by maturity, from concept to release."
        action={<ViewAll href="/products">All products</ViewAll>}
      />
      <div className="mt-12">
        {products.length === 0 ? (
          <EmptyState
            title="Products will be listed here"
            description="Research software and prototypes appear once they are added to the content library."
            hint="src/content/products/"
          />
        ) : (
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product, index) => (
              <Reveal key={product.slug} as="li" delay={index * 0.06}>
                <ProductCard product={product} />
              </Reveal>
            ))}
          </ul>
        )}
      </div>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/* Pipeline panel                                                              */
/* -------------------------------------------------------------------------- */

export function PipelineSection() {
  return (
    <Section spacing="lg" className="relative overflow-hidden">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="display-text text-4xl sm:text-5xl lg:text-6xl">
          Small lab.
          <br />
          <span className="text-primary">Serious systems.</span>
        </h2>
        <p className="mt-6 text-base leading-relaxed text-ink-soft sm:text-lg">
          We prefer working prototypes to roadmaps. Every idea becomes a prototype, every prototype becomes a
          measurement, and the ones that hold up become systems others can build on.
        </p>
      </div>
      <div className="mx-auto mt-12 max-w-5xl">
        <TerminalPanel />
      </div>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/* Team                                                                        */
/* -------------------------------------------------------------------------- */

export function TeamSection({ people }: { people: Person[] }) {
  return (
    <Section id="team" className="border-y border-border bg-card/50">
      <SectionHeading
        eyebrow="06 — Our research team"
        title="Faculty, students and collaborators."
        action={<ViewAll href="/people">Everyone</ViewAll>}
      />
      <div className="mt-12">
        {people.length === 0 ? (
          <EmptyState
            title="Team profiles are being prepared"
            description="Verified researcher profiles will appear here. If you are interested in joining or collaborating with the lab, see the opportunities page."
            hint="src/content/people/"
            actions={
              <Link
                href="/opportunities"
                className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
              >
                Opportunities
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </Link>
            }
          />
        ) : (
          <ul className="grid gap-5 sm:grid-cols-2">
            {people.map((person, index) => (
              <Reveal key={person.slug} as="li" delay={index * 0.05}>
                <TeamMemberCard person={person} />
              </Reveal>
            ))}
          </ul>
        )}
      </div>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/* News                                                                        */
/* -------------------------------------------------------------------------- */

export function NewsSection({ posts }: { posts: NewsPost[] }) {
  return (
    <Section id="news">
      <SectionHeading
        eyebrow="07 — Latest news and updates"
        title="Notes from the lab."
        action={<ViewAll href="/news">All news</ViewAll>}
      />
      <div className="mt-12">
        {posts.length === 0 ? (
          <EmptyState
            title="No news has been published yet"
            description="Lab updates, research notes and announcements will appear here."
            hint="src/content/news/"
          />
        ) : (
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, index) => (
              <Reveal key={post.slug} as="li" delay={index * 0.06}>
                <NewsCard post={post} />
              </Reveal>
            ))}
          </ul>
        )}
      </div>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/* Collaboration + affiliation                                                 */
/* -------------------------------------------------------------------------- */

export function CollaborationSection() {
  const routes = [
    {
      title: "Research collaboration",
      description:
        "Joint projects, co-authored work and shared infrastructure with universities and industry.",
      href: "/collaborate" as const,
      cta: "Start a conversation",
    },
    {
      title: "Join the lab",
      description: "Student research, graduate opportunities and open-source contribution.",
      href: "/opportunities" as const,
      cta: "See opportunities",
    },
    {
      title: "Use our work",
      description: "Datasets, code, tools and teaching materials released by the lab.",
      href: "/resources" as const,
      cta: "Browse resources",
    },
  ];
  return (
    <Section id="collaborate" className="border-y border-border bg-card/50">
      <SectionHeading
        eyebrow="08 — Research collaboration"
        title="Open to partners, students and builders."
        description="We work with academic groups, industry teams and open-source communities on problems where trustworthy AI and decentralised systems meet."
      />
      <ul className="mt-12 grid gap-5 md:grid-cols-3">
        {routes.map((route) => (
          <li key={route.href}>
            <Link
              href={route.href}
              className="group flex h-full flex-col rounded-md border border-border bg-card p-6 transition-all hover:border-primary hover:shadow-(--shadow-card)"
            >
              <h3 className="text-lg font-extrabold tracking-tight">{route.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{route.description}</p>
              <span className="mt-auto inline-flex items-center gap-1 pt-6 text-sm font-semibold text-primary">
                {route.cta}
                <ArrowRight
                  className="size-4 transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}

export function AffiliationSection() {
  return (
    <Section spacing="sm">
      <div className="relative overflow-hidden rounded-md paper-card px-6 py-8 sm:px-10 sm:py-10">
        <div aria-hidden="true" className="absolute inset-0 blueprint-grid-sm opacity-50" />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="label-mono text-primary">University affiliation</p>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">
              {siteConfig.institution.name}
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-soft">
              STEADI Lab is based at {siteConfig.institution.name} in {siteConfig.institution.city},{" "}
              {siteConfig.institution.region}. This site is maintained by the lab and is not an official
              University publication.
            </p>
          </div>
          <a
            href={siteConfig.institution.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 shrink-0 items-center gap-2 rounded-md border border-border bg-background px-5 text-sm font-semibold transition-colors hover:border-primary hover:text-primary"
          >
            scranton.edu
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </Section>
  );
}
