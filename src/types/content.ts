import { z } from "zod";

/* -------------------------------------------------------------------------- */
/* Shared enumerations                                                         */
/* -------------------------------------------------------------------------- */

export const researchStatusValues = ["Active", "Emerging", "Planned"] as const;

export const projectCategoryValues = [
  "Artificial Intelligence",
  "Blockchain",
  "Agentic AI",
  "Smart Contracts",
  "Web3",
  "Machine Learning",
  "Security",
  "Data Analytics",
] as const;
export const projectStatusValues = ["Ongoing", "Completed", "Proposed"] as const;

export const publicationTypeValues = [
  "Journal Article",
  "Conference Paper",
  "Workshop Paper",
  "Preprint",
  "Technical Report",
  "Poster",
  "Working Paper",
] as const;
export const publicationStatusValues = [
  "Published",
  "Accepted",
  "In Press",
  "Under Review",
  "Preprint",
  "Working Paper",
] as const;

export const productCategoryValues = [
  "AI Application",
  "Blockchain Tool",
  "Research Prototype",
  "Open-Source Software",
  "AI Agent",
  "Smart Contract Analysis Tool",
  "Experimental Platform",
] as const;
export const productStatusValues = ["Concept", "Prototype", "Alpha", "Beta", "Released", "Archived"] as const;

export const personRoleValues = [
  "Lab Director / Principal Investigator",
  "Faculty Researchers",
  "Research Associates",
  "Graduate Researchers",
  "Undergraduate Researchers",
  "Collaborators",
  "Alumni",
] as const;

export const newsCategoryValues = [
  "Lab Updates",
  "AI Research",
  "Blockchain Research",
  "Publications",
  "Conferences",
  "Product Releases",
  "Research Opportunities",
  "Events",
] as const;

export const eventTypeValues = [
  "Research Seminar",
  "Guest Lecture",
  "Workshop",
  "Hackathon",
  "Academic Conference",
  "Research Presentation",
  "Community Discussion",
] as const;
export const eventStatusValues = ["Scheduled", "Completed", "Cancelled", "Postponed"] as const;
export const eventFormatValues = ["In person", "Virtual", "Hybrid"] as const;

export const resourceCategoryValues = [
  "Datasets",
  "Open-Source Code",
  "Research Tools",
  "Technical Documentation",
  "Tutorials",
  "Educational Materials",
  "Research Benchmarks",
  "Presentations",
] as const;

export const openingTypeValues = [
  "Graduate Research",
  "Undergraduate Research",
  "Research Collaboration",
  "Open-Source Contribution",
  "Visiting Researcher",
] as const;
export const openingStatusValues = ["Open", "Closed", "Rolling"] as const;

/* -------------------------------------------------------------------------- */
/* Primitive helpers                                                           */
/* -------------------------------------------------------------------------- */

const slug = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slugs must be lowercase, alphanumeric and hyphenated");
const url = z.url();
const isoDate = z.iso.date().or(z.iso.datetime({ offset: true }));
const stringList = z.array(z.string().min(1)).default([]);
const slugList = z.array(slug).default([]);

/** Fields shared by every collection entry. */
const baseEntry = z.object({
  /** Optional explicit slug; defaults to the file name. */
  slug: slug.optional(),
  /** Marks development-only sample records. Forced to `true` for files under `content/samples`. */
  sample: z.boolean().default(false),
  /** Drafts are never published. */
  draft: z.boolean().default(false),
  featured: z.boolean().default(false),
  /** Lower values sort first when relevant. */
  order: z.number().int().optional(),
});

export const imageSchema = z.object({
  src: z.string().min(1),
  alt: z.string().min(1),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
  caption: z.string().optional(),
});
export type ContentImage = z.infer<typeof imageSchema>;

export const timelineSchema = z.object({
  start: z.string().min(4),
  end: z.string().min(4).optional(),
});

/* -------------------------------------------------------------------------- */
/* Collections                                                                 */
/* -------------------------------------------------------------------------- */

export const researchAreaSchema = baseEntry.extend({
  title: z.string().min(1),
  summary: z.string().min(1),
  icon: z.string().min(1),
  status: z.enum(researchStatusValues).default("Active"),
  keywords: stringList,
  questions: stringList,
  methodologies: stringList,
  people: slugList,
});
export type ResearchAreaFrontmatter = z.infer<typeof researchAreaSchema>;

export const publicationSchema = baseEntry.extend({
  title: z.string().min(1),
  authors: z.array(z.string().min(1)).min(1),
  abstract: z.string().min(1),
  year: z.number().int().min(1900).max(2100),
  month: z.number().int().min(1).max(12).optional(),
  venue: z.string().optional(),
  type: z.enum(publicationTypeValues),
  status: z.enum(publicationStatusValues).default("Published"),
  doi: z.string().optional(),
  pdfUrl: z.string().optional(),
  publisherUrl: url.optional(),
  githubUrl: url.optional(),
  datasetUrl: url.optional(),
  bibtex: z.string().optional(),
  keywords: stringList,
  researchAreas: slugList,
  projects: slugList,
  /** Slugs of lab members who co-authored the work. */
  people: slugList,
});
export type PublicationFrontmatter = z.infer<typeof publicationSchema>;

export const projectSchema = baseEntry.extend({
  title: z.string().min(1),
  summary: z.string().min(1),
  category: z.enum(projectCategoryValues),
  status: z.enum(projectStatusValues),
  tags: stringList,
  techStack: stringList,
  objectives: stringList,
  researchAreas: slugList,
  people: slugList,
  publications: slugList,
  cover: imageSchema.optional(),
  repoUrl: url.optional(),
  demoUrl: url.optional(),
  docsUrl: url.optional(),
  timeline: timelineSchema.optional(),
});
export type ProjectFrontmatter = z.infer<typeof projectSchema>;

export const productSchema = baseEntry.extend({
  name: z.string().min(1),
  summary: z.string().min(1),
  category: z.enum(productCategoryValues),
  status: z.enum(productStatusValues),
  techStack: stringList,
  screenshots: z.array(imageSchema).default([]),
  docsUrl: url.optional(),
  githubUrl: url.optional(),
  demoUrl: url.optional(),
  version: z.string().optional(),
  license: z.string().optional(),
  researchAreas: slugList,
  projects: slugList,
  people: slugList,
});
export type ProductFrontmatter = z.infer<typeof productSchema>;

export const personSchema = baseEntry.extend({
  name: z.string().min(1),
  role: z.enum(personRoleValues),
  /** Set to true for a partner organisation (e.g. a technology partner) instead of an individual. */
  organization: z.boolean().default(false),
  /** Free-text academic title, e.g. "PhD Student". Only use verified titles. */
  title: z.string().optional(),
  affiliation: z.string().min(1),
  interests: stringList,
  photo: imageSchema.optional(),
  email: z.email().optional(),
  website: url.optional(),
  scholar: url.optional(),
  orcid: z.string().optional(),
  github: url.optional(),
  linkedin: url.optional(),
  researchAreas: slugList,
});
export type PersonFrontmatter = z.infer<typeof personSchema>;

export const newsSchema = baseEntry.extend({
  title: z.string().min(1),
  excerpt: z.string().min(1),
  date: isoDate,
  updated: isoDate.optional(),
  /** Display name of the author, or a person slug. */
  author: z.string().min(1),
  category: z.enum(newsCategoryValues),
  tags: stringList,
  image: imageSchema.optional(),
  researchAreas: slugList,
});
export type NewsFrontmatter = z.infer<typeof newsSchema>;

export const speakerSchema = z.object({
  name: z.string().min(1),
  affiliation: z.string().optional(),
  url: url.optional(),
});

export const eventSchema = baseEntry.extend({
  title: z.string().min(1),
  summary: z.string().min(1),
  type: z.enum(eventTypeValues),
  start: isoDate,
  end: isoDate.optional(),
  timezone: z.string().min(1).default("America/New_York"),
  location: z.string().min(1),
  format: z.enum(eventFormatValues).default("In person"),
  speakers: z.array(speakerSchema).default([]),
  registrationUrl: url.optional(),
  status: z.enum(eventStatusValues).default("Scheduled"),
  researchAreas: slugList,
});
export type EventFrontmatter = z.infer<typeof eventSchema>;

export const resourceSchema = baseEntry.extend({
  title: z.string().min(1),
  description: z.string().min(1),
  category: z.enum(resourceCategoryValues),
  url: url.optional(),
  downloadUrl: z.string().optional(),
  repoUrl: url.optional(),
  format: z.string().optional(),
  license: z.string().optional(),
  tags: stringList,
  researchAreas: slugList,
  projects: slugList,
});
export type ResourceFrontmatter = z.infer<typeof resourceSchema>;

export const openingSchema = baseEntry.extend({
  title: z.string().min(1),
  summary: z.string().min(1),
  type: z.enum(openingTypeValues),
  status: z.enum(openingStatusValues).default("Open"),
  /** Describe funding honestly. Omit when unknown. */
  funding: z.string().optional(),
  deadline: isoDate.optional(),
  applyUrl: url.optional(),
  researchAreas: slugList,
});
export type OpeningFrontmatter = z.infer<typeof openingSchema>;

/* -------------------------------------------------------------------------- */
/* Resolved entry types                                                        */
/* -------------------------------------------------------------------------- */

export type Entry<T> = T & {
  slug: string;
  /** Raw MDX body (may be empty). */
  body: string;
  /** Whether the body contains renderable content. */
  hasBody: boolean;
};

export type ResearchArea = Entry<ResearchAreaFrontmatter>;
export type Publication = Entry<PublicationFrontmatter>;
export type Project = Entry<ProjectFrontmatter>;
export type Product = Entry<ProductFrontmatter>;
export type Person = Entry<PersonFrontmatter>;
export type NewsPost = Entry<NewsFrontmatter> & { readingTime: number };
export type LabEvent = Entry<EventFrontmatter>;
export type Resource = Entry<ResourceFrontmatter>;
export type Opening = Entry<OpeningFrontmatter>;

export type ResearchStatus = (typeof researchStatusValues)[number];
export type ProjectCategory = (typeof projectCategoryValues)[number];
export type ProjectStatus = (typeof projectStatusValues)[number];
export type PublicationType = (typeof publicationTypeValues)[number];
export type ProductCategory = (typeof productCategoryValues)[number];
export type ProductStatus = (typeof productStatusValues)[number];
export type PersonRole = (typeof personRoleValues)[number];
export type NewsCategory = (typeof newsCategoryValues)[number];
export type EventType = (typeof eventTypeValues)[number];
export type ResourceCategory = (typeof resourceCategoryValues)[number];
