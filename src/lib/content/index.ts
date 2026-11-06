import {
  eventSchema,
  newsSchema,
  openingSchema,
  personRoleValues,
  personSchema,
  productSchema,
  projectSchema,
  publicationSchema,
  researchAreaSchema,
  resourceSchema,
  type LabEvent,
  type NewsPost,
  type Opening,
  type Person,
  type Product,
  type Project,
  type Publication,
  type ResearchArea,
  type Resource,
} from "@/types/content";
import { estimateReadingTime, loadCollection, samplesEnabled } from "./loader";

export { samplesEnabled };

/* -------------------------------------------------------------------------- */
/* Sorting helpers                                                             */
/* -------------------------------------------------------------------------- */

function byOrderThenTitle<T extends { order?: number; title: string }>(a: T, b: T): number {
  const ao = a.order ?? Number.MAX_SAFE_INTEGER;
  const bo = b.order ?? Number.MAX_SAFE_INTEGER;
  return ao - bo || a.title.localeCompare(b.title);
}

function byDateDesc<T extends { date: string }>(a: T, b: T): number {
  return b.date.localeCompare(a.date);
}

/* -------------------------------------------------------------------------- */
/* Research areas                                                              */
/* -------------------------------------------------------------------------- */

export function getResearchAreas(): ResearchArea[] {
  return loadCollection({ collection: "research", schema: researchAreaSchema }).sort(byOrderThenTitle);
}

export function getResearchArea(slug: string): ResearchArea | undefined {
  return getResearchAreas().find((area) => area.slug === slug);
}

export function getFeaturedResearchAreas(limit = 6): ResearchArea[] {
  const areas = getResearchAreas();
  const featured = areas.filter((area) => area.featured);
  return (featured.length ? featured : areas).slice(0, limit);
}

/* -------------------------------------------------------------------------- */
/* Publications                                                                */
/* -------------------------------------------------------------------------- */

export function getPublications(): Publication[] {
  return loadCollection({ collection: "publications", schema: publicationSchema }).sort(
    (a, b) => b.year - a.year || (b.month ?? 0) - (a.month ?? 0) || a.title.localeCompare(b.title),
  );
}

export function getPublication(slug: string): Publication | undefined {
  return getPublications().find((publication) => publication.slug === slug);
}

export function getRecentPublications(limit = 4): Publication[] {
  const publications = getPublications();
  const featured = publications.filter((publication) => publication.featured);
  return (featured.length ? featured : publications).slice(0, limit);
}

export function getPublicationYears(): number[] {
  return [...new Set(getPublications().map((publication) => publication.year))].sort((a, b) => b - a);
}

/* -------------------------------------------------------------------------- */
/* Projects                                                                    */
/* -------------------------------------------------------------------------- */

export function getProjects(): Project[] {
  return loadCollection({ collection: "projects", schema: projectSchema }).sort(byOrderThenTitle);
}

export function getProject(slug: string): Project | undefined {
  return getProjects().find((project) => project.slug === slug);
}

export function getFeaturedProjects(limit = 3): Project[] {
  const projects = getProjects();
  const featured = projects.filter((project) => project.featured);
  return (featured.length ? featured : projects).slice(0, limit);
}

/* -------------------------------------------------------------------------- */
/* Products                                                                    */
/* -------------------------------------------------------------------------- */

export function getProducts(): Product[] {
  return loadCollection({ collection: "products", schema: productSchema }).sort(
    (a, b) =>
      (a.order ?? Number.MAX_SAFE_INTEGER) - (b.order ?? Number.MAX_SAFE_INTEGER) ||
      a.name.localeCompare(b.name),
  );
}

export function getProduct(slug: string): Product | undefined {
  return getProducts().find((product) => product.slug === slug);
}

export function getFeaturedProducts(limit = 3): Product[] {
  const products = getProducts();
  const featured = products.filter((product) => product.featured);
  return (featured.length ? featured : products).slice(0, limit);
}

/* -------------------------------------------------------------------------- */
/* People                                                                      */
/* -------------------------------------------------------------------------- */

export function getPeople(): Person[] {
  const roleRank = new Map(personRoleValues.map((role, index) => [role, index]));
  return loadCollection({ collection: "people", schema: personSchema }).sort(
    (a, b) =>
      (roleRank.get(a.role) ?? 99) - (roleRank.get(b.role) ?? 99) ||
      (a.order ?? Number.MAX_SAFE_INTEGER) - (b.order ?? Number.MAX_SAFE_INTEGER) ||
      a.name.localeCompare(b.name),
  );
}

export function getPerson(slug: string): Person | undefined {
  return getPeople().find((person) => person.slug === slug);
}

export function getFeaturedPeople(limit = 4): Person[] {
  const people = getPeople().filter((person) => person.role !== "Alumni");
  const featured = people.filter((person) => person.featured);
  return (featured.length ? featured : people).slice(0, limit);
}

/* -------------------------------------------------------------------------- */
/* News                                                                        */
/* -------------------------------------------------------------------------- */

export function getNewsPosts(): NewsPost[] {
  return loadCollection({
    collection: "news",
    schema: newsSchema,
    decorate: (entry) => ({ ...entry, readingTime: estimateReadingTime(entry.body) }),
  })
    .map((entry) => entry as NewsPost)
    .sort(byDateDesc);
}

export function getNewsPost(slug: string): NewsPost | undefined {
  return getNewsPosts().find((post) => post.slug === slug);
}

export function getRecentNews(limit = 3): NewsPost[] {
  return getNewsPosts().slice(0, limit);
}

export function getRelatedNews(post: NewsPost, limit = 3): NewsPost[] {
  const others = getNewsPosts().filter((candidate) => candidate.slug !== post.slug);
  const scored = others
    .map((candidate) => {
      let score = 0;
      if (candidate.category === post.category) score += 2;
      score += candidate.tags.filter((tag) => post.tags.includes(tag)).length;
      score += candidate.researchAreas.filter((area) => post.researchAreas.includes(area)).length;
      return { candidate, score };
    })
    .sort((a, b) => b.score - a.score || byDateDesc(a.candidate, b.candidate));
  return scored.slice(0, limit).map(({ candidate }) => candidate);
}

/* -------------------------------------------------------------------------- */
/* Events                                                                      */
/* -------------------------------------------------------------------------- */

export function getEvents(): LabEvent[] {
  return loadCollection({ collection: "events", schema: eventSchema }).sort((a, b) =>
    b.start.localeCompare(a.start),
  );
}

export function getEvent(slug: string): LabEvent | undefined {
  return getEvents().find((event) => event.slug === slug);
}

/**
 * Split events into upcoming and past relative to a reference date. The
 * reference defaults to build time; the events page passes the current time
 * from a request-scoped component when live accuracy is needed.
 */
export function partitionEvents(events: LabEvent[], now = new Date()) {
  const cutoff = now.getTime();
  const upcoming = events
    .filter((event) => new Date(event.end ?? event.start).getTime() >= cutoff)
    .sort((a, b) => a.start.localeCompare(b.start));
  const past = events.filter((event) => new Date(event.end ?? event.start).getTime() < cutoff);
  return { upcoming, past };
}

/* -------------------------------------------------------------------------- */
/* Resources                                                                   */
/* -------------------------------------------------------------------------- */

export function getResources(): Resource[] {
  return loadCollection({ collection: "resources", schema: resourceSchema }).sort(byOrderThenTitle);
}

/* -------------------------------------------------------------------------- */
/* Opportunities                                                               */
/* -------------------------------------------------------------------------- */

export function getOpenings(): Opening[] {
  return loadCollection({ collection: "opportunities", schema: openingSchema }).sort(byOrderThenTitle);
}

/* -------------------------------------------------------------------------- */
/* Relationship helpers                                                        */
/* -------------------------------------------------------------------------- */

export function getProjectsForResearchArea(slug: string): Project[] {
  return getProjects().filter((project) => project.researchAreas.includes(slug));
}

export function getPublicationsForResearchArea(slug: string): Publication[] {
  return getPublications().filter((publication) => publication.researchAreas.includes(slug));
}

export function getProductsForResearchArea(slug: string): Product[] {
  return getProducts().filter((product) => product.researchAreas.includes(slug));
}

export function getPeopleForResearchArea(area: ResearchArea): Person[] {
  const people = getPeople();
  const explicit = area.people
    .map((slug) => people.find((person) => person.slug === slug))
    .filter((person): person is Person => Boolean(person));
  const implicit = people.filter(
    (person) => person.researchAreas.includes(area.slug) && !explicit.includes(person),
  );
  return [...explicit, ...implicit];
}

export function getPublicationsForPerson(slug: string): Publication[] {
  return getPublications().filter((publication) => publication.people.includes(slug));
}

export function getProjectsForPerson(slug: string): Project[] {
  return getProjects().filter((project) => project.people.includes(slug));
}

export function getProductsForPerson(slug: string): Product[] {
  return getProducts().filter((product) => product.people.includes(slug));
}

export function getPublicationsForProject(project: Project): Publication[] {
  const publications = getPublications();
  const explicit = project.publications
    .map((slug) => publications.find((publication) => publication.slug === slug))
    .filter((publication): publication is Publication => Boolean(publication));
  const implicit = publications.filter(
    (publication) => publication.projects.includes(project.slug) && !explicit.includes(publication),
  );
  return [...explicit, ...implicit];
}

export function getProjectsForPublication(publication: Publication): Project[] {
  const projects = getProjects();
  const explicit = publication.projects
    .map((slug) => projects.find((project) => project.slug === slug))
    .filter((project): project is Project => Boolean(project));
  const implicit = projects.filter(
    (project) => project.publications.includes(publication.slug) && !explicit.includes(project),
  );
  return [...explicit, ...implicit];
}

export function getProjectsForProduct(product: Product): Project[] {
  const projects = getProjects();
  return product.projects
    .map((slug) => projects.find((project) => project.slug === slug))
    .filter((project): project is Project => Boolean(project));
}

export function getProductsForProject(slug: string): Product[] {
  return getProducts().filter((product) => product.projects.includes(slug));
}

export function resolvePeople(slugs: string[]): Person[] {
  const people = getPeople();
  return slugs
    .map((slug) => people.find((person) => person.slug === slug))
    .filter((person): person is Person => Boolean(person));
}

export function resolveResearchAreas(slugs: string[]): ResearchArea[] {
  const areas = getResearchAreas();
  return slugs
    .map((slug) => areas.find((area) => area.slug === slug))
    .filter((area): area is ResearchArea => Boolean(area));
}

/** Aggregate counts used by the homepage and about page. */
export function getContentStats() {
  return {
    researchAreas: getResearchAreas().length,
    publications: getPublications().length,
    projects: getProjects().length,
    products: getProducts().length,
    people: getPeople().length,
  };
}
