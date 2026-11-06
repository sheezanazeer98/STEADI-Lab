# Content guide

All site content lives in this folder as Markdown/MDX files with validated frontmatter.
Pages are generated automatically — **you never need to edit a React component to add
a paper, project, person, post, event, resource or opening.**

```
src/content/
├── research/        Research areas            → /research/[slug]
├── publications/    Papers and reports        → /publications/[slug]
├── projects/        Research projects         → /projects/[slug]
├── products/        Software and prototypes   → /products/[slug]
├── people/          Team directory            → /people/[slug]
├── news/            News and insights (MDX)   → /news/[slug]
├── events/          Seminars, workshops…      → /events
├── resources/       Datasets, code, materials → /resources
├── opportunities/   Open positions            → /opportunities
└── samples/         Development-only sample records (same structure)
```

## Verified vs. sample content

- Files in `src/content/<collection>/` are **verified** and always published.
- Files in `src/content/samples/<collection>/` are **samples**: they are shown during
  `pnpm dev` and **excluded from production builds**.
  Set `SHOW_SAMPLE_CONTENT=true` to include them in a build (e.g. for a preview deployment),
  or `SHOW_SAMPLE_CONTENT=false` to hide them in development.
- Delete the `samples` folder once real content exists.

Only publish records that have been verified: real papers, real people (with their consent),
real events. Never invent DOIs, venues, titles, funding or affiliations.

## Rules that apply to every file

- File name = URL slug (`my-paper.mdx` → `/publications/my-paper`). Use lowercase letters,
  digits and hyphens. Set `slug:` in frontmatter only to override.
- Slugs must be unique within a collection — the build fails on duplicates.
- `draft: true` hides an entry everywhere. `featured: true` promotes it on the homepage.
  `order: 1` controls manual ordering where it applies.
- Cross-references use slugs: `researchAreas`, `projects`, `publications`, `people`.
  Unknown slugs are ignored, so check spelling.
- The Markdown body under the frontmatter is optional for most collections and rendered as
  rich text (GitHub-flavoured Markdown + MDX).
- Frontmatter is validated by Zod schemas in `src/types/content.ts`; invalid files fail the
  build with a message naming the file and field.

## Adding a publication

Create `src/content/publications/<slug>.mdx`:

```mdx
---
title: "Paper title"
authors:
  - First Author
  - Second Author
abstract: >-
  One-paragraph abstract.
year: 2026
month: 5 # optional
venue: "Conference or journal" # optional
type: Conference Paper # Journal Article | Conference Paper | Workshop Paper | Preprint | Technical Report | Poster | Working Paper
status: Published # Published | Accepted | In Press | Under Review | Preprint | Working Paper
doi: 10.1234/example # optional — only real DOIs
pdfUrl: /papers/paper.pdf # optional — put the file in public/papers/ or link to the publisher
publisherUrl: https://… # optional
githubUrl: https://github.com/… # optional
datasetUrl: https://… # optional
bibtex: | # optional — generated from metadata when omitted
  @inproceedings{key, …}
keywords: [provenance, ledgers]
researchAreas: [ai-blockchain-integration]
projects: [provenance-ledger]
people: [jane-doe] # slugs of lab members who are authors
featured: true
---

Optional notes rendered below the abstract.
```

## Adding a project

`src/content/projects/<slug>.mdx` — required: `title`, `summary`, `category`
(Artificial Intelligence | Blockchain | Agentic AI | Smart Contracts | Web3 | Machine Learning |
Security | Data Analytics), `status` (Ongoing | Completed | Proposed). Optional: `tags`,
`techStack`, `objectives`, `researchAreas`, `people`, `publications`, `repoUrl`, `demoUrl`,
`docsUrl`, `timeline: { start, end }`, `cover: { src, alt, width, height }`. The body holds the
technical approach and any long-form detail. Without a `cover`, a generative blueprint cover is
drawn from the slug.

## Adding a team member

`src/content/people/<slug>.mdx` — required: `name`, `role` (Lab Director / Principal
Investigator | Faculty Researchers | Research Associates | Graduate Researchers | Undergraduate
Researchers | Collaborators | Alumni), `affiliation`. Optional: `title`, `interests`,
`photo: { src, alt }` (place files in `public/images/people/`), `email` (only when authorised),
`website`, `scholar`, `orcid`, `github`, `linkedin`, `researchAreas`. The body is the biography.
Publications and projects are linked automatically through their `people` fields.

## Adding a research area

`src/content/research/<slug>.mdx` — required: `title`, `summary`, `icon` (a key from
`src/components/research/research-icon.tsx`). Optional: `status` (Active | Emerging | Planned),
`keywords`, `questions`, `methodologies`, `people`, `order`, `featured`. Related projects,
publications and products are discovered through their `researchAreas` fields.

## Adding news, events, resources and openings

- **News** — `title`, `excerpt`, `date` (YYYY-MM-DD), `author`, `category`, optional `tags`,
  `image`, `researchAreas`. Body is the article (MDX). Reading time is computed.
- **Events** — `title`, `summary`, `type`, `start` (ISO date-time with offset), optional `end`,
  `timezone` (IANA, default America/New_York), `location`, `format`, `speakers`,
  `registrationUrl`, `status`.
- **Resources** — `title`, `description`, `category`, plus `url`, `downloadUrl` and/or `repoUrl`,
  optional `format`, `license`, `tags`.
- **Openings** — `title`, `summary`, `type`, `status` (Open | Closed | Rolling), optional
  `funding` (describe honestly; omit when not confirmed), `deadline`, `applyUrl`.

## Images

Put images under `public/images/<collection>/` and reference them as `/images/...`. Provide
`width` and `height` where you can; `next/image` optimises and lazy-loads them. Prefer modern
formats (AVIF/WebP) or let Next.js convert at request time.

## Moving to a CMS later

The loaders in `src/lib/content/` are the only code that reads the file system. To adopt a CMS
(e.g. Sanity), implement the same functions against the CMS API and keep the Zod schemas as the
contract.
