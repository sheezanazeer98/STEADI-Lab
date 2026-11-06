import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/shared/page-hero";
import { Section } from "@/components/shared/section";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Notice",
  description:
    "How the STEADI Lab website handles personal data: what the contact forms collect, how messages are delivered, cookies and local storage, and your rights.",
  path: "/privacy",
});

/** Update this date whenever the notice changes. */
const LAST_UPDATED = "2026-11-06";

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Privacy"
        title="Privacy notice"
        current="Privacy"
        breadcrumbs={[]}
        description={
          <>
            This notice explains what personal data the {siteConfig.name} website ({siteConfig.url}) collects,
            why, and how it is handled. It is written in plain language and kept deliberately short.
          </>
        }
        size="md"
      >
        <p className="mt-6 label-mono text-muted-foreground">
          Last updated <time dateTime={LAST_UPDATED}>{LAST_UPDATED}</time>
        </p>
      </PageHero>

      <Section className="border-t border-border" narrow>
        <div className="prose-lab">
          <h2>Who operates this site</h2>
          <p>
            This website is operated by {siteConfig.name}, a research laboratory based at{" "}
            {siteConfig.institution.name} in {siteConfig.institution.city}, {siteConfig.institution.region},{" "}
            {siteConfig.institution.country}. It is not an official publication of the University, and the
            University&apos;s own privacy policies apply to the University&apos;s systems and services.
          </p>

          <h2>What we collect</h2>
          <h3>Messages you send us</h3>
          <p>
            When you use the contact or collaboration form we receive the information you enter: your name,
            email address, organisation (optional), the topic you select and your message. We also record the
            time the form was opened and submitted, which is used only to filter automated spam.
          </p>
          <h3>Technical data</h3>
          <p>
            Like every website, the server that hosts this site processes your IP address and standard request
            headers in order to deliver pages. The contact form uses your network address for short-term rate
            limiting so that the form cannot be abused; this value is held in memory only and is not written
            to a database.
          </p>
          <h3>What we do not collect</h3>
          <p>
            The site has no user accounts, no advertising, no social-media trackers and no third-party
            analytics scripts unless this notice is updated to say otherwise.
          </p>

          <h2>How messages are delivered</h2>
          <p>
            Form submissions are delivered to the lab team by email through a transactional email provider
            configured by the site operator. The provider processes the message content solely to deliver it.
            If delivery is not configured, the form tells you so and no message is stored.
          </p>

          <h2>Why we use your data</h2>
          <p>
            We use the information you send only to reply to you and to follow up on the request you made. We
            do not add you to mailing lists, and we do not share your details with third parties except as
            needed to deliver your message as described above or where required by law.
          </p>

          <h2>Cookies and local storage</h2>
          <p>
            The site sets no tracking cookies. If you change the colour theme, your preference is saved in
            your browser&apos;s local storage so that it is remembered on your next visit; this value never
            leaves your device.
          </p>

          <h2>External links</h2>
          <p>
            Pages link to external sites such as publishers, code repositories, DOI resolvers and the
            University website. Those sites have their own privacy practices, which we do not control.
          </p>

          <h2>Retention</h2>
          <p>
            Emails generated from the forms are retained in the lab&apos;s mailbox for as long as they are
            needed to deal with your request and for a reasonable period afterwards for record-keeping, after
            which they are deleted.
          </p>

          <h2>Your rights</h2>
          <p>
            You may ask us what personal data we hold about you, request a correction, or ask us to delete it.
            Please send such requests through the{" "}
            <Link href="/contact" className="text-primary link-underline">
              contact page
            </Link>
            . Depending on where you live, you may have additional rights under applicable data-protection
            law.
          </p>

          <h2>Changes to this notice</h2>
          <p>
            If the site starts collecting new categories of data — for example if analytics are enabled — this
            notice will be updated and the &ldquo;last updated&rdquo; date above will change.
          </p>
        </div>
      </Section>
    </>
  );
}
