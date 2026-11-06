import type { Metadata } from "next";
import Link from "next/link";
import { Building2, Mail, MapPin } from "lucide-react";
import { GitHubIcon, LinkedInIcon, ScholarIcon, XIcon, YouTubeIcon } from "@/components/shared/brand-icons";
import { PageHero } from "@/components/shared/page-hero";
import { Section } from "@/components/shared/section";
import { SectionHeading } from "@/components/shared/section-heading";
import { JsonLd } from "@/components/shared/json-ld";
import { InquiryForm } from "@/components/forms/inquiry-form";
import { buildMetadata } from "@/lib/seo";
import { absoluteUrl, siteConfig } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Contact",
  description:
    "Get in touch with STEADI Lab at The University of Scranton, Pennsylvania. Send a message about research, collaboration, student opportunities or media requests.",
  path: "/contact",
});

const socialLinks = [
  { label: "GitHub", href: siteConfig.social.github, Icon: GitHubIcon },
  { label: "LinkedIn", href: siteConfig.social.linkedin, Icon: LinkedInIcon },
  { label: "X", href: siteConfig.social.x, Icon: XIcon },
  { label: "YouTube", href: siteConfig.social.youtube, Icon: YouTubeIcon },
  { label: "Google Scholar", href: siteConfig.social.scholar, Icon: ScholarIcon },
].filter((link): link is typeof link & { href: string } => Boolean(link.href));

const externalLinks = [
  {
    label: siteConfig.institution.name,
    href: siteConfig.institution.url,
    note: "Official university website",
  },
];

export default function ContactPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: `Contact ${siteConfig.name}`,
    url: absoluteUrl("/contact"),
    mainEntity: {
      "@type": "ResearchOrganization",
      name: siteConfig.name,
      url: siteConfig.url,
      ...(siteConfig.contactEmail ? { email: siteConfig.contactEmail } : {}),
      address: {
        "@type": "PostalAddress",
        addressLocality: siteConfig.institution.city,
        addressRegion: siteConfig.institution.region,
        addressCountry: "US",
      },
    },
  };

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title={
          <>
            Say <span className="text-primary">hello</span>.
          </>
        }
        current="Contact"
        breadcrumbs={[]}
        description="Questions about our research, student involvement, collaboration or media requests — send a message and we will reply by email."
      />

      <Section className="border-t border-border">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <aside className="space-y-8 lg:col-span-5">
            <div className="rounded-md border border-border bg-card p-6">
              <h2 className="label-mono text-primary">Lab</h2>
              <dl className="mt-4 space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <Building2 className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                  <div>
                    <dt className="label-mono text-muted-foreground">Name</dt>
                    <dd className="mt-0.5 font-semibold">{siteConfig.name}</dd>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Building2 className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                  <div>
                    <dt className="label-mono text-muted-foreground">Affiliation</dt>
                    <dd className="mt-0.5">
                      <a
                        href={siteConfig.institution.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold link-underline"
                      >
                        {siteConfig.institution.name}
                      </a>
                    </dd>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                  <div>
                    <dt className="label-mono text-muted-foreground">Location</dt>
                    <dd className="mt-0.5">
                      {siteConfig.institution.city}, {siteConfig.institution.region},{" "}
                      {siteConfig.institution.country}
                    </dd>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                  <div>
                    <dt className="label-mono text-muted-foreground">Email</dt>
                    <dd className="mt-0.5">
                      {siteConfig.contactEmail ? (
                        <a
                          href={`mailto:${siteConfig.contactEmail}`}
                          className="font-semibold break-all link-underline"
                        >
                          {siteConfig.contactEmail}
                        </a>
                      ) : (
                        <span className="text-muted-foreground">
                          Use the form — a public address will be listed once authorised.
                        </span>
                      )}
                    </dd>
                  </div>
                </div>
              </dl>
            </div>

            {socialLinks.length ? (
              <div>
                <h2 className="label-mono text-muted-foreground">Profiles</h2>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {socialLinks.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer me"
                        className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:border-primary hover:text-primary"
                      >
                        <link.Icon className="size-3.5" />
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <div>
              <h2 className="label-mono text-muted-foreground">Related links</h2>
              <ul className="mt-3 space-y-2 text-sm">
                {externalLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold link-underline"
                    >
                      {link.label}
                    </a>
                    <span className="text-muted-foreground"> — {link.note}</span>
                  </li>
                ))}
                <li>
                  <Link href="/collaborate" className="font-semibold link-underline">
                    Collaborate
                  </Link>
                  <span className="text-muted-foreground"> — partnership and joint research inquiries</span>
                </li>
                <li>
                  <Link href="/opportunities" className="font-semibold link-underline">
                    Opportunities
                  </Link>
                  <span className="text-muted-foreground"> — student and researcher involvement</span>
                </li>
                <li>
                  <Link href="/faq" className="font-semibold link-underline">
                    FAQ
                  </Link>
                  <span className="text-muted-foreground"> — answers to common questions</span>
                </li>
              </ul>
            </div>
          </aside>

          <div className="lg:col-span-7">
            <SectionHeading eyebrow="Message" title="Send us a note" size="md" />
            <InquiryForm kind="contact" className="mt-8" />
          </div>
        </div>
      </Section>

      <JsonLd data={jsonLd} />
    </>
  );
}
