import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  FlaskConical,
  GitPullRequest,
  GraduationCap,
  Handshake,
  Users,
} from "lucide-react";
import { PageHero } from "@/components/shared/page-hero";
import { Section } from "@/components/shared/section";
import { SectionHeading } from "@/components/shared/section-heading";
import { EmptyState } from "@/components/shared/empty-state";
import { ExternalLink } from "@/components/shared/external-link";
import { StatusTag, Tag } from "@/components/shared/tag";
import { ButtonLink } from "@/components/shared/button-link";
import { MdxContent } from "@/lib/content/mdx";
import { getOpenings, resolveResearchAreas } from "@/lib/content";
import { formatDate } from "@/lib/format";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Opportunities",
  description:
    "How students, researchers and developers can get involved with STEADI Lab: research involvement, student projects, graduate research, open-source contributions and collaboration proposals.",
  path: "/opportunities",
});

const pathways = [
  {
    icon: FlaskConical,
    title: "Research involvement",
    body: "Join an active project as a contributor. Involvement typically starts with a scoped task — reproducing a result, extending a prototype or running an evaluation — and grows from there.",
    cta: { label: "Browse projects", href: "/projects" as const },
  },
  {
    icon: GraduationCap,
    title: "Student research projects",
    body: "University of Scranton students can propose or join semester-long projects in AI, blockchain or their intersection, aligned with one of our research areas.",
    cta: { label: "See research areas", href: "/research" as const },
  },
  {
    icon: Users,
    title: "Graduate research",
    body: "Prospective graduate researchers are welcome to express interest in working with the lab. Admissions and funding are handled through the University's own programmes and processes.",
    cta: { label: "Express interest", href: "/contact" as const },
  },
  {
    icon: GitPullRequest,
    title: "Open-source contributions",
    body: "Our tools are developed in the open. Issues, pull requests, documentation and reproducibility reports are all valued contributions.",
    cta: { label: "View products", href: "/products" as const },
  },
  {
    icon: Handshake,
    title: "Collaboration proposals",
    body: "Faculty, labs and industry teams can propose joint work — from a single study to a longer programme. We respond to every serious proposal.",
    cta: { label: "Propose a collaboration", href: "/collaborate" as const },
  },
];

export default function OpportunitiesPage() {
  const openings = getOpenings();
  const open = openings.filter((opening) => opening.status !== "Closed");
  const closed = openings.filter((opening) => opening.status === "Closed");

  return (
    <>
      <PageHero
        eyebrow="Opportunities"
        title={
          <>
            Work <span className="text-primary">with</span> us.
          </>
        }
        current="Opportunities"
        breadcrumbs={[]}
        description="Ways to get involved with the lab — as a student, a researcher, a developer or a partner. Listed openings are kept separate from general expressions of interest so you always know which is which."
        actions={
          <>
            <ButtonLink href="/opportunities#openings" size="lg">
              Available openings
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </ButtonLink>
            <ButtonLink href="/contact" size="lg" variant="secondary">
              Express interest
            </ButtonLink>
          </>
        }
      />

      <Section className="border-t border-border">
        <SectionHeading
          eyebrow="01 — Pathways"
          title="Ways to get involved"
          size="md"
          description="General pathways open to anyone who fits the description. None of these is a formal position."
        />
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {pathways.map((pathway, index) => (
            <li key={pathway.title} className="flex flex-col rounded-md border border-border bg-card p-6">
              <div className="flex items-center justify-between">
                <span className="flex size-10 items-center justify-center rounded-md border border-border bg-background text-primary">
                  <pathway.icon className="size-5" aria-hidden="true" />
                </span>
                <span className="label-mono text-muted-foreground">{String(index + 1).padStart(2, "0")}</span>
              </div>
              <h3 className="mt-5 text-lg font-extrabold tracking-tight">{pathway.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">{pathway.body}</p>
              <Link
                href={pathway.cta.href}
                className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
              >
                {pathway.cta.label}
                <ArrowUpRight className="size-3.5" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="openings" className="scroll-mt-24 border-y border-border bg-card/50">
        <SectionHeading
          eyebrow="02 — Openings"
          title="Available openings"
          size="md"
          description="Specific openings the lab is currently recruiting for. Funding is described only when it has been confirmed; if an opening does not mention funding, assume none is attached."
        />
        <div className="mt-10 space-y-5">
          {open.length ? (
            open.map((opening) => {
              const areas = resolveResearchAreas(opening.researchAreas);
              return (
                <article
                  key={opening.slug}
                  id={opening.slug}
                  className="rounded-md border border-border bg-card p-6"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <Tag tone="accent">{opening.type}</Tag>
                    <StatusTag status={opening.status} />
                    {opening.funding ? (
                      <Tag tone="outline">{opening.funding}</Tag>
                    ) : (
                      <Tag tone="muted">Funding not specified</Tag>
                    )}
                  </div>
                  <h3 className="mt-3 text-xl font-extrabold tracking-tight">{opening.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">{opening.summary}</p>
                  {opening.hasBody ? <MdxContent source={opening.body} className="mt-4 text-sm" /> : null}
                  <dl className="mt-5 flex flex-wrap gap-x-6 gap-y-2 label-mono text-muted-foreground">
                    {opening.deadline ? (
                      <div className="flex gap-2">
                        <dt>Deadline</dt>
                        <dd className="text-foreground">
                          <time dateTime={opening.deadline}>{formatDate(opening.deadline)}</time>
                        </dd>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <dt>Deadline</dt>
                        <dd className="text-foreground">Rolling</dd>
                      </div>
                    )}
                    {areas.length ? (
                      <div className="flex gap-2">
                        <dt>Areas</dt>
                        <dd className="text-foreground">
                          {areas.map((area, index) => (
                            <span key={area.slug}>
                              {index > 0 ? ", " : ""}
                              <Link href={`/research/${area.slug}`} className="hover:text-primary">
                                {area.title}
                              </Link>
                            </span>
                          ))}
                        </dd>
                      </div>
                    ) : null}
                  </dl>
                  <div className="mt-5">
                    {opening.applyUrl ? (
                      <ExternalLink href={opening.applyUrl} variant="button" className="h-10">
                        Apply
                      </ExternalLink>
                    ) : (
                      <ButtonLink href="/contact">Express interest</ButtonLink>
                    )}
                  </div>
                </article>
              );
            })
          ) : (
            <EmptyState
              icon={BriefcaseBusiness}
              title="No openings are listed right now"
              description="The lab is not advertising specific positions at the moment. General expressions of interest are always welcome through the contact page."
              hint="src/content/opportunities/"
              actions={<ButtonLink href="/contact">Express interest</ButtonLink>}
            />
          )}
        </div>
        {closed.length ? (
          <details className="mt-8">
            <summary className="cursor-pointer label-mono text-muted-foreground">
              Closed openings ({closed.length})
            </summary>
            <ul className="mt-4 space-y-2">
              {closed.map((opening) => (
                <li key={opening.slug} className="text-sm text-muted-foreground">
                  {opening.title} <span className="label-mono">· {opening.type}</span>
                </li>
              ))}
            </ul>
          </details>
        ) : null}
      </Section>

      <Section narrow>
        <SectionHeading
          eyebrow="03 — Expressions of interest"
          title="Not a position. Still interested?"
          size="md"
        />
        <div className="prose-lab mt-6">
          <p>
            Most collaborations start with a conversation rather than a posting. If your interests overlap
            with one of our research areas, send a short note describing what you would like to work on, your
            background and what you hope to get out of it. A link to prior work — a repository, thesis or
            paper — helps more than a CV.
          </p>
          <p>
            Expressions of interest do not constitute an application to The University of Scranton, and the
            lab cannot make admissions or funding decisions. We will point you to the right programme where
            relevant.
          </p>
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="/contact" size="lg">
            Send a note
          </ButtonLink>
          <ButtonLink href="/faq" size="lg" variant="secondary">
            Read the FAQ
          </ButtonLink>
        </div>
      </Section>
    </>
  );
}
