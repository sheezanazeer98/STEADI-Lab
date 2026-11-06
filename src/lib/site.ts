import type { Route } from "next";

/**
 * Site-wide configuration. Everything that identifies the lab lives here so it
 * can be updated without touching page components.
 *
 * Content-integrity note: only add contact details, social profiles or
 * affiliations that have been authorised for publication.
 */

export const siteConfig = {
  name: "STEADI Lab",
  shortName: "STEADI",
  tagline: "Advancing Research in Artificial Intelligence and Blockchain",
  description:
    "STEADI Lab explores the intersection of artificial intelligence, blockchain technology, and intelligent systems. Our research focuses on building trustworthy, transparent, secure, and reliable computational solutions that connect academic research with practical applications.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://steadi-lab.org",
  locale: "en_US",
  institution: {
    name: "The University of Scranton",
    shortName: "University of Scranton",
    url: "https://www.scranton.edu",
    city: "Scranton",
    region: "Pennsylvania",
    country: "USA",
  },
  /** Authorised public email address. Leave undefined until one is approved. */
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || undefined,
  /** Public profiles. Leave empty until the lab's official accounts exist. */
  social: {
    github: process.env.NEXT_PUBLIC_GITHUB_URL || undefined,
    linkedin: process.env.NEXT_PUBLIC_LINKEDIN_URL || undefined,
    x: process.env.NEXT_PUBLIC_X_URL || undefined,
    scholar: process.env.NEXT_PUBLIC_SCHOLAR_URL || undefined,
    youtube: process.env.NEXT_PUBLIC_YOUTUBE_URL || undefined,
  },
  /** Used in the footer copyright notice. */
  copyrightHolder: "STEADI Lab",
} as const;

export type NavItem = {
  label: string;
  href: Route;
  description?: string;
};

export type NavGroup = {
  label: string;
  items: NavItem[];
};

export const primaryNav: Array<NavItem | NavGroup> = [
  { label: "About", href: "/about" },
  { label: "Research", href: "/research" },
  { label: "Publications", href: "/publications" },
  { label: "Projects", href: "/projects" },
  { label: "Products", href: "/products" },
  { label: "People", href: "/people" },
  {
    label: "More",
    items: [
      { label: "News & Insights", href: "/news", description: "Lab updates and research notes" },
      { label: "Events", href: "/events", description: "Seminars, workshops and talks" },
      { label: "Resources", href: "/resources", description: "Datasets, code and materials" },
      {
        label: "Opportunities",
        href: "/opportunities",
        description: "Get involved with the lab",
      },
      { label: "Collaborate", href: "/collaborate", description: "Partnership and joint research" },
      { label: "FAQ", href: "/faq", description: "Common questions" },
    ],
  },
  { label: "Contact", href: "/contact" },
];

export const footerNav: NavGroup[] = [
  {
    label: "Lab",
    items: [
      { label: "About", href: "/about" },
      { label: "People", href: "/people" },
      { label: "News & Insights", href: "/news" },
      { label: "Events", href: "/events" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    label: "Work",
    items: [
      { label: "Research Areas", href: "/research" },
      { label: "Publications", href: "/publications" },
      { label: "Projects", href: "/projects" },
      { label: "Products & Open Source", href: "/products" },
      { label: "Resources", href: "/resources" },
    ],
  },
  {
    label: "Engage",
    items: [
      { label: "Opportunities", href: "/opportunities" },
      { label: "Collaborate", href: "/collaborate" },
      { label: "FAQ", href: "/faq" },
      { label: "Privacy", href: "/privacy" },
    ],
  },
];

export function isNavGroup(item: NavItem | NavGroup): item is NavGroup {
  return "items" in item;
}

export function absoluteUrl(path = "/"): string {
  return new URL(path, siteConfig.url).toString();
}
