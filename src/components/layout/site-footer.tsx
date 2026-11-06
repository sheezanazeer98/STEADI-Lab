import Link from "next/link";
import { GitHubIcon, LinkedInIcon, ScholarIcon, XIcon, YouTubeIcon } from "@/components/shared/brand-icons";
import { LogoMark } from "@/components/shared/logo";
import { getResearchAreas } from "@/lib/content";
import { footerNav, siteConfig } from "@/lib/site";
import { getCachedYear } from "@/lib/time";

const socialLinks = [
  { key: "github", label: "GitHub", href: siteConfig.social.github, Icon: GitHubIcon },
  { key: "linkedin", label: "LinkedIn", href: siteConfig.social.linkedin, Icon: LinkedInIcon },
  { key: "youtube", label: "YouTube", href: siteConfig.social.youtube, Icon: YouTubeIcon },
  { key: "x", label: "X", href: siteConfig.social.x, Icon: XIcon },
  { key: "scholar", label: "Google Scholar", href: siteConfig.social.scholar, Icon: ScholarIcon },
].filter((link): link is typeof link & { href: string } => Boolean(link.href));

export async function SiteFooter() {
  const researchAreas = getResearchAreas();
  const year = await getCachedYear();

  return (
    <footer className="mt-24 border-t border-border bg-card/60">
      <div className="container-wide py-14">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="flex items-center gap-2.5">
              <LogoMark className="size-8" />
              <span className="font-heading text-xl font-extrabold tracking-tight">
                {siteConfig.shortName}
                <span className="text-primary"> Lab</span>
              </span>
            </div>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-ink-soft">{siteConfig.description}</p>
            <dl className="mt-6 space-y-1.5 text-sm">
              <div className="flex gap-3">
                <dt className="w-20 shrink-0 pt-0.5 label-mono text-muted-foreground">Institution</dt>
                <dd>
                  <a
                    href={siteConfig.institution.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-underline"
                  >
                    {siteConfig.institution.name}
                  </a>
                </dd>
              </div>
              <div className="flex gap-3">
                <dt className="w-20 shrink-0 pt-0.5 label-mono text-muted-foreground">Location</dt>
                <dd>
                  {siteConfig.institution.city}, {siteConfig.institution.region},{" "}
                  {siteConfig.institution.country}
                </dd>
              </div>
              {siteConfig.contactEmail ? (
                <div className="flex gap-3">
                  <dt className="w-20 shrink-0 pt-0.5 label-mono text-muted-foreground">Email</dt>
                  <dd>
                    <a href={`mailto:${siteConfig.contactEmail}`} className="link-underline">
                      {siteConfig.contactEmail}
                    </a>
                  </dd>
                </div>
              ) : null}
            </dl>
            {socialLinks.length ? (
              <ul className="mt-6 flex flex-wrap gap-2" aria-label="Social profiles">
                {socialLinks.map(({ key, label, href, Icon }) => (
                  <li key={key}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="inline-flex size-9 items-center justify-center rounded-md border border-border transition-colors hover:border-primary hover:text-primary"
                    >
                      <Icon className="size-4" />
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          <div className="grid gap-10 sm:grid-cols-3 lg:col-span-5">
            {footerNav.map((group) => (
              <nav key={group.label} aria-label={`Footer ${group.label}`}>
                <h2 className="label-mono text-primary">{group.label}</h2>
                <ul className="mt-4 space-y-2.5">
                  {group.items.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="text-sm text-foreground/85 transition-colors hover:text-primary"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>

          <nav aria-label="Footer research areas" className="lg:col-span-3">
            <h2 className="label-mono text-primary">Research</h2>
            <ul className="mt-4 space-y-2.5">
              {researchAreas.map((area) => (
                <li key={area.slug}>
                  <Link
                    href={`/research/${area.slug}`}
                    className="text-sm text-foreground/85 transition-colors hover:text-primary"
                  >
                    {area.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="label-mono text-muted-foreground">
            © {year} {siteConfig.copyrightHolder}. All rights reserved.
          </p>
          <p className="max-w-xl text-xs leading-relaxed text-muted-foreground">
            This website is maintained by {siteConfig.name}, a research lab at {siteConfig.institution.name}.
            It is not an official publication of the University.
          </p>
        </div>
      </div>
    </footer>
  );
}
