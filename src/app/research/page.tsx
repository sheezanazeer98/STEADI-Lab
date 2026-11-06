import type { Metadata } from "next";
import { PageHero } from "@/components/shared/page-hero";
import { Section } from "@/components/shared/section";
import { Reveal } from "@/components/shared/reveal";
import { ResearchAreaCard } from "@/components/research/research-area-card";
import { getProjectsForResearchArea, getPublicationsForResearchArea, getResearchAreas } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Research",
  description:
    "Research areas at STEADI Lab: artificial intelligence, trustworthy and explainable AI, agentic systems, blockchain, smart-contract security, Web3, AI governance, data provenance and AI–blockchain integration.",
  path: "/research",
});

export default function ResearchPage() {
  const areas = getResearchAreas();

  return (
    <>
      <PageHero
        eyebrow="Research"
        title={
          <>
            Nine areas, <span className="text-primary">one connected</span> programme.
          </>
        }
        current="Research"
        breadcrumbs={[]}
        description="Each research area has its own questions and methods, but they share a common thread: making intelligent systems verifiable, and decentralised systems intelligent."
      />
      <Section spacing="sm" className="border-t border-border pt-12">
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {areas.map((area, index) => (
            <Reveal key={area.slug} as="li" delay={Math.min(index, 6) * 0.04}>
              <ResearchAreaCard
                area={area}
                index={index + 1}
                counts={{
                  projects: getProjectsForResearchArea(area.slug).length,
                  publications: getPublicationsForResearchArea(area.slug).length,
                }}
              />
            </Reveal>
          ))}
        </ul>
      </Section>
    </>
  );
}
