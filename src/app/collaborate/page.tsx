import type { Metadata } from "next";
import Link from "next/link";
import { Building2, FlaskConical, GitPullRequest, Globe2, Handshake, ScrollText } from "lucide-react";
import { PageHero } from "@/components/shared/page-hero";
import { Section } from "@/components/shared/section";
import { SectionHeading } from "@/components/shared/section-heading";
import { InquiryForm } from "@/components/forms/inquiry-form";
import { getResearchAreas } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Collaborate",
  description:
    "Partner with STEADI Lab on joint research, university partnerships, industry collaboration, research proposals and open-source work in AI and blockchain.",
  path: "/collaborate",
});

const models = [
  {
    icon: Building2,
    title: "University partnerships",
    body: "Inter-institutional research programmes, shared supervision, visiting researchers and joint seminars with other universities and research centres.",
  },
  {
    icon: FlaskConical,
    title: "Joint research",
    body: "Co-designed studies with a shared research question, from problem framing through evaluation and co-authored publication.",
  },
  {
    icon: Handshake,
    title: "Industry collaboration",
    body: "Applied projects with companies and public-sector teams that have a concrete problem in trustworthy AI, agents, smart contracts or decentralised systems.",
  },
  {
    icon: ScrollText,
    title: "Research proposals",
    body: "Partnering on grant and funding proposals where the lab's expertise complements yours. Early contact helps us scope realistically.",
  },
  {
    icon: GitPullRequest,
    title: "Open-source contributions",
    body: "Contributing to, adopting or co-maintaining the tools and datasets we release — and letting us know how you use them.",
  },
  {
    icon: Globe2,
    title: "Academic collaborations",
    body: "Workshops, special issues, benchmark efforts and reading groups with researchers who share our questions.",
  },
];

const process = [
  {
    step: "Write",
    body: "Tell us what you want to do, why, and what a good outcome looks like. A few paragraphs are enough.",
  },
  {
    step: "Scope",
    body: "We reply to discuss fit, timeline and the people who would be involved on both sides.",
  },
  {
    step: "Agree",
    body: "Formal agreements, data-sharing terms or IP arrangements are handled through the appropriate University channels.",
  },
  {
    step: "Build",
    body: "Work starts small, is measured honestly, and is written up or released in the open where possible.",
  },
];

export default function CollaboratePage() {
  const areas = getResearchAreas();

  return (
    <>
      <PageHero
        eyebrow="Collaborate"
        title={
          <>
            Research is better <span className="text-primary">together</span>.
          </>
        }
        current="Collaborate"
        breadcrumbs={[]}
        description="We work with universities, research groups, companies and open-source communities. If your problem touches artificial intelligence, blockchain or the space between them, we would like to hear about it."
      />

      <Section className="border-t border-border">
        <SectionHeading eyebrow="01 — Models" title="How we collaborate" size="md" />
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {models.map((model, index) => (
            <li key={model.title} className="rounded-md border border-border bg-card p-6">
              <div className="flex items-center justify-between">
                <span className="flex size-10 items-center justify-center rounded-md border border-border bg-background text-primary">
                  <model.icon className="size-5" aria-hidden="true" />
                </span>
                <span className="label-mono text-muted-foreground">{String(index + 1).padStart(2, "0")}</span>
              </div>
              <h3 className="mt-5 text-lg font-extrabold tracking-tight">{model.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{model.body}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section className="border-y border-border bg-card/50">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <SectionHeading eyebrow="02 — Process" title="What happens after you write" size="md" />
            <ol className="mt-8 space-y-6">
              {process.map((item, index) => (
                <li key={item.step} className="flex gap-4">
                  <span className="mt-1 w-6 shrink-0 label-mono text-primary">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-extrabold tracking-tight">{item.step}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-ink-soft">{item.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <div className="lg:col-span-7">
            <SectionHeading eyebrow="03 — Topics" title="Where we can contribute" size="md" />
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {areas.map((area) => (
                <li key={area.slug}>
                  <Link
                    href={`/research/${area.slug}`}
                    className="flex h-full flex-col rounded-md border border-border bg-card p-4 transition-colors hover:border-primary"
                  >
                    <span className="font-semibold">{area.title}</span>
                    <span className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                      {area.summary}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section id="inquiry" className="scroll-mt-24">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <SectionHeading eyebrow="04 — Inquiry" title="Propose a collaboration" size="md" />
            <p className="mt-4 text-sm leading-relaxed text-ink-soft">
              Use the form to describe the collaboration you have in mind. Messages go to the lab team and are
              answered by email. We do not share your details with anyone else — see the{" "}
              <Link href="/privacy" className="text-primary link-underline">
                privacy notice
              </Link>
              .
            </p>
            <p className="mt-4 text-sm leading-relaxed text-ink-soft">
              Formal agreements involving {siteConfig.institution.name} are routed through the
              University&apos;s own offices; the lab will introduce you to the right contact when a proposal
              reaches that stage.
            </p>
          </div>
          <div className="lg:col-span-7">
            <InquiryForm kind="collaborate" />
          </div>
        </div>
      </Section>
    </>
  );
}
