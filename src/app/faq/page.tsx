import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/shared/page-hero";
import { Section } from "@/components/shared/section";
import { JsonLd } from "@/components/shared/json-ld";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ButtonLink } from "@/components/shared/button-link";
import { faqGroups } from "@/content/faq";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "FAQ",
  description:
    "Answers to common questions about STEADI Lab: research areas, publications, code and data, joining the lab, collaboration and this website.",
  path: "/faq",
});

export default function FaqPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqGroups.flatMap((group) =>
      group.entries.map((entry) => ({
        "@type": "Question",
        name: entry.question,
        acceptedAnswer: { "@type": "Answer", text: entry.answer },
      })),
    ),
  };

  return (
    <>
      <PageHero
        eyebrow="FAQ"
        title={
          <>
            Questions, <span className="text-primary">answered</span>.
          </>
        }
        current="FAQ"
        breadcrumbs={[]}
        description="Common questions about the lab, our publications, joining us and this website. If yours is not here, the contact page is the fastest route to an answer."
      />

      <Section className="border-t border-border" narrow>
        <div className="space-y-14">
          {faqGroups.map((group, groupIndex) => (
            <section key={group.title} aria-labelledby={`faq-group-${groupIndex}`}>
              <h2
                id={`faq-group-${groupIndex}`}
                className="flex items-baseline gap-3 display-text text-2xl sm:text-3xl"
              >
                <span className="label-mono text-primary">{String(groupIndex + 1).padStart(2, "0")}</span>
                {group.title}
              </h2>
              <Accordion type="multiple" className="mt-6 border-t border-border">
                {group.entries.map((entry) => (
                  <AccordionItem key={entry.id} value={entry.id} className="border-b border-border">
                    <AccordionTrigger className="py-4 text-base font-extrabold tracking-tight hover:no-underline [&>svg]:text-primary">
                      {entry.question}
                    </AccordionTrigger>
                    <AccordionContent className="pb-5 text-sm leading-relaxed text-ink-soft [&_a]:no-underline">
                      <p>{entry.answer}</p>
                      {entry.link ? (
                        <Link
                          href={entry.link.href}
                          className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
                        >
                          {entry.link.label}
                          <ArrowUpRight className="size-3.5" aria-hidden="true" />
                        </Link>
                      ) : null}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>
          ))}
        </div>

        <div className="mt-16 rounded-md border border-border bg-card p-6 sm:p-8">
          <p className="label-mono text-primary">Still have a question?</p>
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight">We read every message.</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            Send us a note and we will reply by email. For partnership proposals, the collaboration page has a
            dedicated form.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <ButtonLink href="/contact">Contact the lab</ButtonLink>
            <ButtonLink href="/collaborate" variant="secondary">
              Propose a collaboration
            </ButtonLink>
          </div>
        </div>
      </Section>

      <JsonLd data={jsonLd} />
    </>
  );
}
