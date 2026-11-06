# STEADI Lab — research laboratory website

Source for [steadi-lab.org](https://steadi-lab.org), the website of STEADI Lab at
The University of Scranton, Pennsylvania, USA. The lab works on artificial intelligence,
blockchain, trustworthy and agentic AI, smart contracts, decentralized systems and
intelligent decision support.

The site is a statically generated Next.js application. All research content (areas,
publications, projects, products, people, news, events, resources, openings) lives in
Markdown/MDX files with validated frontmatter — **no database and no CMS are required**,
and adding a record never requires touching a React component.

## Stack

| Concern    | Choice                                                                  |
| ---------- | ----------------------------------------------------------------------- |
| Framework  | Next.js 16 (App Router, Turbopack, `cacheComponents`, typed routes)     |
| Language   | TypeScript (strict)                                                     |
| UI         | React 19, Tailwind CSS v4, shadcn/ui (Radix), Lucide icons              |
| Motion     | Motion for React (respects `prefers-reduced-motion`)                    |
| Fonts      | Self-hosted variable Manrope (text) and JetBrains Mono (labels, panels) |
| Theme      | next-themes (light / dark / system)                                     |
| Content    | MDX + gray-matter, Zod-validated schemas in `src/types/content.ts`      |
| Forms      | React Hook Form + Zod, Server Action, Resend for delivery               |
| Quality    | ESLint, Prettier (Tailwind plugin), Vitest, Playwright                  |
| Deployment | Vercel                                                                  |

## Getting started

Requirements: Node.js 20.9+ and [pnpm](https://pnpm.io) 10.

```bash
pnpm install
cp .env.example .env.local   # optional — the site runs without any env vars
pnpm dev                     # http://localhost:3000
```

In development the sample records in `src/content/samples/` are displayed so every layout
can be reviewed. They are excluded from production builds.

### Scripts

| Script               | What it does                                                 |
| -------------------- | ------------------------------------------------------------ |
| `pnpm dev`           | Development server                                           |
| `pnpm build`         | Production build (fails on invalid content or type errors)   |
| `pnpm start`         | Serve the production build                                   |
| `pnpm typecheck`     | Generate route types and run `tsc --noEmit`                  |
| `pnpm lint`          | ESLint (`src` and `tests`, warnings are errors)              |
| `pnpm format`        | Prettier write / `pnpm format:check` to verify               |
| `pnpm test`          | Vitest unit tests (`tests/unit`)                             |
| `pnpm test:e2e`      | Playwright end-to-end tests against an existing `pnpm build` |
| `pnpm test:e2e:full` | Production build followed by the Playwright suite            |
| `pnpm check`         | typecheck → lint → unit tests → production build             |

Playwright needs a browser once: `pnpm exec playwright install chromium`. The e2e config
starts `next start` on port 3100 from the current production build (desktop and mobile
projects); set `E2E_BASE_URL` to test an already running server instead.

## Routes

| Route                                             | Content                                                                                                         |
| ------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `/`                                               | Hero, about, research map, projects, publications, products, team, news, collaboration, affiliation             |
| `/about`                                          | Mission, vision, philosophy, objectives, interdisciplinary approach, affiliation                                |
| `/research`, `/research/[slug]`                   | Nine research areas with questions, methodologies, related work and people                                      |
| `/publications`, `/publications/[slug]`           | Searchable, filterable, sortable directory; detail pages with DOI/PDF/code/data links, BibTeX and copy-citation |
| `/projects`, `/projects/[slug]`                   | Filterable portfolio with objectives, approach, stack, timeline, related work                                   |
| `/products`, `/products/[slug]`                   | Software, prototypes and open-source tools with maturity labels                                                 |
| `/people`, `/people/[slug]`                       | Team directory by role; profile pages with publications and projects                                            |
| `/news`, `/news/[slug]`                           | MDX articles with categories, tags, reading time and related posts                                              |
| `/events`                                         | Upcoming and past seminars, workshops, talks                                                                    |
| `/resources`                                      | Datasets, code, tools, documentation, tutorials, benchmarks                                                     |
| `/opportunities`                                  | Research involvement and clearly labelled open positions                                                        |
| `/collaborate`                                    | Collaboration models and inquiry form                                                                           |
| `/contact`                                        | Lab details, location, links and contact form                                                                   |
| `/faq`, `/privacy`                                | FAQ (with `FAQPage` structured data) and privacy notice                                                         |
| `/sitemap.xml`, `/robots.txt`, `/opengraph-image` | Generated from content and site config                                                                          |

Custom `not-found`, `error` and `loading` states are implemented at the app root.

## Editing content

Full guide: [`src/content/README.md`](src/content/README.md). Summary:

```
src/content/
├── research/        → /research/[slug]
├── publications/    → /publications/[slug]
├── projects/        → /projects/[slug]
├── products/        → /products/[slug]
├── people/          → /people/[slug]
├── news/            → /news/[slug]
├── events/          → /events
├── resources/       → /resources
├── opportunities/   → /opportunities
└── samples/         development-only records, same structure
```

- The file name is the URL slug. Slugs must be unique per collection.
- Frontmatter is validated with Zod; an invalid file fails the build with the file and field named.
- `featured: true` promotes a record on the homepage, `draft: true` hides it, `order` sorts it.
- Records reference each other by slug (`researchAreas`, `projects`, `publications`, `people`).

### Add a publication

Create `src/content/publications/<slug>.mdx`:

```mdx
---
title: "Paper title"
authors: [First Author, Second Author]
abstract: >-
  One-paragraph abstract.
year: 2026
venue: "Conference or journal"
type: Conference Paper # Journal Article | Conference Paper | Workshop Paper | Preprint | Technical Report | Poster | Working Paper
status: Published
doi: 10.1234/real-doi # only verified DOIs
pdfUrl: /papers/paper.pdf # file in public/papers/ or a publisher URL
githubUrl: https://github.com/…
datasetUrl: https://…
keywords: [provenance, ledgers]
researchAreas: [ai-blockchain-integration]
projects: [related-project-slug]
people: [member-slug]
featured: true
---
```

BibTeX is generated from the metadata unless a `bibtex` field is supplied.

### Add a project

`src/content/projects/<slug>.mdx` with `title`, `summary`, `category`, `status`
(Ongoing | Completed | Proposed) and optional `tags`, `techStack`, `objectives`,
`researchAreas`, `people`, `publications`, `repoUrl`, `demoUrl`, `docsUrl`,
`timeline: { start, end }`, `cover`. The Markdown body is the technical approach.

### Add a team member

`src/content/people/<slug>.mdx` with `name`, `role` (Lab Director / Principal Investigator,
Faculty Researchers, Research Associates, Graduate Researchers, Undergraduate Researchers,
Collaborators, Alumni), `affiliation` and optional `title`, `interests`, `photo`, `email`
(only when authorised), `website`, `scholar`, `orcid`, `github`, `linkedin`. The body is the
biography; publications and projects are linked automatically through their `people` fields.

### Content integrity

Publish only verified records: real papers, real people with their consent, real events.
Do not invent DOIs, venues, funding, titles or affiliations. Sample records stay in
`src/content/samples/` and are never built for production unless `SHOW_SAMPLE_CONTENT=true`
is set explicitly (useful for a preview deployment).

Site-wide copy — lab description, institution, navigation, social links — is in
`src/lib/site.ts`. FAQ entries are in `src/content/faq.ts`.

## Environment variables

See [`.env.example`](.env.example). Everything is optional; the site builds with none set.

| Variable                                                                                                                        | Purpose                                                                                                     |
| ------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`                                                                                                          | Canonical origin (default `https://steadi-lab.org`); drives metadata, sitemap, JSON-LD and the www redirect |
| `SHOW_SAMPLE_CONTENT`                                                                                                           | Force sample records on (`true`) or off (`false`)                                                           |
| `NEXT_PUBLIC_CONTACT_EMAIL`                                                                                                     | Public lab email, shown once authorised                                                                     |
| `NEXT_PUBLIC_GITHUB_URL`, `NEXT_PUBLIC_LINKEDIN_URL`, `NEXT_PUBLIC_X_URL`, `NEXT_PUBLIC_SCHOLAR_URL`, `NEXT_PUBLIC_YOUTUBE_URL` | Social links in header/footer/contact                                                                       |
| `RESEND_API_KEY`                                                                                                                | Server-only. Enables delivery of contact/collaboration messages via Resend                                  |
| `CONTACT_TO_EMAIL`                                                                                                              | Recipient(s) for inquiry messages, comma-separated                                                          |
| `CONTACT_FROM_EMAIL`                                                                                                            | Verified sender for Resend                                                                                  |

Inquiry forms validate on client and server (Zod), include a honeypot field and a
per-IP rate limit, and fall back to a clear "delivery not configured" message when the
Resend variables are absent.

## Deployment (Vercel)

1. Push the repository to GitHub/GitLab/Bitbucket and import it in Vercel. The framework
   preset is detected automatically; build command `pnpm build`, output handled by Next.js.
2. Add the environment variables above under _Settings → Environment Variables_
   (`RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL` for the forms).
3. **Domain:** add `steadi-lab.org` and `www.steadi-lab.org` under _Settings → Domains_.
   Point the apex to Vercel (`A 76.76.21.21`) and `www` to `cname.vercel-dns.com`, or use
   Vercel nameservers. The app redirects `www` → apex permanently (`next.config.ts`);
   set `NEXT_PUBLIC_SITE_URL=https://www.steadi-lab.org` to flip the direction.
4. Deploy. Preview deployments can set `SHOW_SAMPLE_CONTENT=true` to showcase layouts.

Security headers (CSP, HSTS, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`)
are configured in `next.config.ts`.

### SEO verification

- `https://steadi-lab.org/sitemap.xml` lists every static and content route.
- `https://steadi-lab.org/robots.txt` references the sitemap.
- Every route has a unique title/description, canonical URL, Open Graph and Twitter
  metadata; the default social image is generated at `/opengraph-image`.
- Structured data: `ResearchOrganization` + `WebSite` (site), `ScholarlyArticle`
  (publications), `ResearchProject` (projects), `SoftwareSourceCode` (products), `Person`
  (people), `BlogPosting` (news), `Event` (events), `FAQPage` (FAQ), `ContactPage`
  (contact) and `BreadcrumbList` (detail pages). Validate with Google's Rich Results test.
- Submit the sitemap in Google Search Console after the domain is verified.

### Images

Place images under `public/images/<collection>/` and reference them as `/images/...`
with `width`/`height` in frontmatter. `next/image` serves AVIF/WebP and lazy-loads below
the fold. Add external hosts to `images.remotePatterns` in `next.config.ts` if content
links to remote images. Records without a cover get a deterministic generated blueprint
cover.

## Project structure

```
src/
├── app/            Routes (App Router), metadata, sitemap, robots, OG image, error states
├── components/
│   ├── layout/     Header, navigation, footer, theme toggle, back-to-top
│   ├── home/       Homepage sections (hero, research map, pipeline panel…)
│   ├── research/ publications/ projects/ products/ people/ news/ events/
│   ├── forms/      Inquiry form (React Hook Form + Zod, Server Action)
│   ├── shared/     Page hero, section heading, cards, filters, empty state, breadcrumbs…
│   └── ui/         shadcn/ui primitives
├── content/        Markdown/MDX collections (see src/content/README.md)
├── lib/
│   ├── content/    File-system loaders, Zod validation, MDX rendering
│   ├── site.ts     Site config, navigation, social links
│   ├── fonts.ts    Self-hosted fonts (licences in src/fonts/)
│   ├── bibtex.ts   Citation generation
│   ├── search.ts   Tokenised search helpers
│   └── time.ts     Cached time primitives for static rendering
├── types/          Zod schemas and inferred content types
└── hooks/          Client hooks
tests/
├── unit/           Vitest
└── e2e/            Playwright
```

## Verified checks

`pnpm typecheck`, `pnpm lint`, `pnpm format:check`, `pnpm test` (35 unit tests),
`pnpm test:e2e` (18 scenarios across desktop and mobile) and `pnpm build` all pass.

## Limitations and next steps

- The production content collections are empty by design until verified records are
  supplied; every list renders an editable empty state. Sample records demonstrate layouts
  in development. While a collection is empty its detail route prerenders a single
  `__placeholder__` param (resolved as 404) because Cache Components requires
  `generateStaticParams` to return at least one entry.
- Detail routes are prerendered for every known slug. A slug that does not exist renders
  the not-found page with `noindex`, but — as with any partially prerendered Next.js route —
  the HTTP status is 200 rather than 404. Unmatched paths such as `/does-not-exist` return a
  real 404.
- Inquiry delivery requires Resend credentials. Rate limiting is in-memory per server
  instance, which is appropriate for Vercel's serverless runtime but not shared across regions.
- The logo is an original STEADI Lab wordmark; no University of Scranton marks are used.
  Replace `src/components/shared/logo.tsx` when an official lab mark exists.
- A headless CMS can be adopted later by re-implementing the loaders in `src/lib/content/`
  against its API while keeping the Zod schemas as the contract.
