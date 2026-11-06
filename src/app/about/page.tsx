import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/shared/page-hero";
import { Section } from "@/components/shared/section";
import { SectionHeading } from "@/components/shared/section-heading";
import { BulletList } from "@/components/shared/meta-list";
import { Reveal } from "@/components/shared/reveal";
import { ResearchIcon } from "@/components/research/research-icon";
import { getResearchAreas } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "About",
  description:
    "STEADI Lab is a research lab at The University of Scranton working at the intersection of artificial intelligence, blockchain technology and intelligent systems.",
  path: "/about",
});

const principles = [
  {
    title: "Verifiable over impressive",
    description:
      "A result counts when someone else can check it. We favour reproducible experiments, open artefacts and evidence that survives scrutiny.",
  },
  {
    title: "Systems, not demos",
    description:
      "Prototypes are built to be measured and, when they hold up, to become infrastructure that other researchers and practitioners can use.",
  },
  {
    title: "Humans stay accountable",
    description:
      "Autonomy is extended incrementally and always paired with oversight, audit trails and clear escalation paths.",
  },
  {
    title: "Honest about maturity",
    description:
      "Concepts, prototypes and released tools are labelled as what they are. We do not overstate readiness or results.",
  },
];

const objectives = [
  "Develop methods that make AI systems transparent, robust and auditable in real deployments.",
  "Advance the security and verification of smart contracts and decentralised applications.",
  "Design agentic systems whose actions are bounded, logged and open to human review.",
  "Use distributed ledgers as infrastructure for data provenance, integrity and shared accountability.",
  "Translate research into open-source tools, datasets and educational materials.",
  "Prepare students to build and evaluate trustworthy intelligent systems.",
];

const disciplines = [
  "Machine learning and statistics",
  "Distributed systems and cryptography",
  "Programming languages and formal methods",
  "Human–computer interaction",
  "Security and privacy",
  "Economics, law and policy",
];

export default function AboutPage() {
  const areas = getResearchAreas();

  return (
    <>
      <PageHero
        eyebrow="About the lab"
        title={
          <>
            Research at the intersection of <span className="text-primary">intelligence</span> and{" "}
            <span className="text-primary">verification</span>.
          </>
        }
        current="About"
        breadcrumbs={[]}
        description={siteConfig.description}
      />

      {/* Mission and vision */}
      <Section spacing="md" className="border-t border-border">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <SectionHeading eyebrow="01 — Mission and vision" title="Why the lab exists." size="md" />
          </div>
          <div className="space-y-6 lg:col-span-7">
            <div>
              <h3 className="label-mono text-primary">Mission</h3>
              <p className="mt-2 text-lg leading-relaxed text-ink-soft">
                To build trustworthy, transparent, secure and reliable computational systems by combining
                advances in artificial intelligence with the accountability that distributed ledgers make
                possible — and to connect that research with practical applications.
              </p>
            </div>
            <div>
              <h3 className="label-mono text-primary">Vision</h3>
              <p className="mt-2 text-lg leading-relaxed text-ink-soft">
                An ecosystem of composable, verifiable components in which intelligent systems can be
                inspected, their decisions can be audited, and the people responsible for them remain in
                control.
              </p>
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              These statements are the lab&apos;s working mission and vision and may be refined over time.
            </p>
          </div>
        </div>
      </Section>

      {/* Research philosophy */}
      <Section className="border-y border-border bg-card/50">
        <SectionHeading
          eyebrow="02 — Research philosophy"
          title="Four principles that shape the work."
          size="md"
        />
        <ul className="mt-10 grid gap-5 sm:grid-cols-2">
          {principles.map((principle, index) => (
            <Reveal key={principle.title} as="li" delay={index * 0.05}>
              <div className="h-full rounded-md border border-border bg-card p-6">
                <span className="label-mono text-primary">0{index + 1}</span>
                <h3 className="mt-3 text-lg font-extrabold tracking-tight">{principle.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{principle.description}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </Section>

      {/* Objectives and interdisciplinary approach */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="03 — Research objectives"
              title="What we are working towards."
              size="md"
            />
            <BulletList items={objectives} numbered className="mt-8" />
          </div>
          <div>
            <SectionHeading
              eyebrow="04 — Interdisciplinary approach"
              title="Problems that cross boundaries."
              size="md"
            />
            <p className="mt-6 leading-relaxed text-ink-soft">
              Trustworthy intelligent systems cannot be built from a single discipline. The lab draws on
              several fields and collaborates with researchers who bring complementary expertise:
            </p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {disciplines.map((discipline) => (
                <li
                  key={discipline}
                  className="rounded-md border border-border bg-card px-3 py-1.5 text-sm font-medium"
                >
                  {discipline}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* AI + blockchain focus */}
      <Section className="border-y border-border bg-card/50">
        <SectionHeading
          eyebrow="05 — AI and blockchain focus"
          title="Two technologies that make each other more trustworthy."
          size="md"
          description="Ledgers give learning systems a dependable memory for provenance, versions and decisions. Learning gives decentralised systems better monitoring, analysis and automation. Our nine research areas map that relationship."
        />
        <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {areas.map((area) => (
            <li key={area.slug}>
              <Link
                href={`/research/${area.slug}`}
                className="group flex items-center gap-3 rounded-md border border-border bg-card px-4 py-3 transition-colors hover:border-primary"
              >
                <span className="text-primary">
                  <ResearchIcon name={area.icon} className="size-4" />
                </span>
                <span className="text-sm font-semibold">{area.title}</span>
                <ArrowRight
                  className="ml-auto size-4 text-primary opacity-0 transition-opacity group-hover:opacity-100"
                  aria-hidden="true"
                />
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      {/* Affiliation + collaboration */}
      <Section>
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="rounded-md border border-border bg-card p-8">
            <p className="label-mono text-primary">06 — Academic association</p>
            <h2 className="mt-3 text-2xl font-extrabold tracking-tight">{siteConfig.institution.name}</h2>
            <p className="mt-3 leading-relaxed text-ink-soft">
              STEADI Lab is based at {siteConfig.institution.name} in {siteConfig.institution.city},{" "}
              {siteConfig.institution.region}, {siteConfig.institution.country}. Departmental affiliation,
              leadership and formal appointments will be listed here once confirmed.
            </p>
            <a
              href={siteConfig.institution.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
            >
              University website
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </a>
          </div>
          <div className="rounded-md border border-border bg-card p-8">
            <p className="label-mono text-primary">07 — Collaboration</p>
            <h2 className="mt-3 text-2xl font-extrabold tracking-tight">Work with the lab</h2>
            <p className="mt-3 leading-relaxed text-ink-soft">
              We welcome conversations with academic groups, industry teams, students and open-source
              contributors who share an interest in trustworthy AI and decentralised systems.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/collaborate"
                className="inline-flex h-10 items-center gap-2 rounded-md bg-foreground px-4 text-sm font-semibold text-background transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                Collaborate
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              <Link
                href="/opportunities"
                className="inline-flex h-10 items-center rounded-md border border-border px-4 text-sm font-semibold transition-colors hover:border-primary hover:text-primary"
              >
                Opportunities
              </Link>
            </div>
          </div>
        </div>
        <nav aria-label="Explore" className="mt-12 flex flex-wrap gap-x-8 gap-y-3">
          {[
            { label: "Research areas", href: "/research" as const },
            { label: "Projects", href: "/projects" as const },
            { label: "Publications", href: "/publications" as const },
            { label: "People", href: "/people" as const },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="inline-flex items-center gap-1.5 label-mono text-primary hover:underline"
            >
              {link.label}
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </Link>
          ))}
        </nav>
      </Section>
    </>
  );
}
