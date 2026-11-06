import { describe, expect, it } from "vitest";
import {
  getEvents,
  getNewsPosts,
  getPeople,
  getProducts,
  getProjects,
  getPublication,
  getPublicationYears,
  getPublications,
  getResearchArea,
  getResearchAreas,
  getRelatedNews,
  partitionEvents,
  resolvePeople,
  resolveResearchAreas,
  samplesEnabled,
} from "@/lib/content";
import { estimateReadingTime } from "@/lib/content/loader";
import { PLACEHOLDER_SLUG, toStaticParams } from "@/lib/content/static-params";
import { personRoleValues } from "@/types/content";

describe("content loader", () => {
  it("includes sample records in the test environment", () => {
    expect(samplesEnabled()).toBe(true);
  });

  it("loads the nine verified research areas in order", () => {
    const areas = getResearchAreas();
    expect(areas).toHaveLength(9);
    expect(areas[0]?.title).toBe("Artificial Intelligence & Machine Learning");
    expect(areas.every((area) => area.sample === false)).toBe(true);
    expect(new Set(areas.map((area) => area.slug)).size).toBe(9);
  });

  it("derives slugs from file names and finds entries by slug", () => {
    const area = getResearchArea("ai-blockchain-integration");
    expect(area?.title).toBe("AI and Blockchain Integration");
    expect(getResearchArea("does-not-exist")).toBeUndefined();
  });

  it("flags every record under content/samples as a sample", () => {
    const sampled = [...getPublications(), ...getProjects(), ...getProducts(), ...getPeople()].filter(
      (entry) => entry.slug.startsWith("sample-"),
    );
    expect(sampled.length).toBeGreaterThan(0);
    expect(sampled.every((entry) => entry.sample)).toBe(true);
  });

  it("sorts publications newest first and exposes the year list", () => {
    const publications = getPublications();
    const years = publications.map((publication) => publication.year);
    expect(years).toEqual([...years].sort((a, b) => b - a));
    expect(getPublicationYears()).toEqual([...new Set(years)].sort((a, b) => b - a));
  });

  it("resolves cross-references and ignores unknown slugs", () => {
    const publication = getPublication("sample-ledger-anchored-provenance");
    expect(publication).toBeDefined();
    const areas = resolveResearchAreas([...(publication?.researchAreas ?? []), "unknown-slug"]);
    expect(areas.length).toBe(publication?.researchAreas.length);
    expect(resolvePeople(["nope"])).toEqual([]);
  });

  it("orders people by role rank, then order, then name", () => {
    const ranks = personRoleValues.map((role) => role as string);
    const people = getPeople();
    const positions = people.map((person) => ranks.indexOf(person.role));
    expect(positions.every((position) => position >= 0)).toBe(true);
    expect(positions).toEqual([...positions].sort((a, b) => a - b));
  });

  it("computes reading time for news posts", () => {
    const posts = getNewsPosts();
    expect(posts.length).toBeGreaterThan(0);
    expect(posts.every((post) => post.readingTime >= 1)).toBe(true);
    expect(estimateReadingTime("word ".repeat(440))).toBe(2);
    expect(estimateReadingTime("")).toBe(1);
  });

  it("ranks related news by category, tags and research areas", () => {
    const posts = getNewsPosts();
    const related = getRelatedNews(posts[0]!, 2);
    expect(related).toHaveLength(Math.min(2, posts.length - 1));
    expect(related.some((post) => post.slug === posts[0]!.slug)).toBe(false);
  });

  it("splits events around a reference date", () => {
    const events = getEvents();
    const { upcoming, past } = partitionEvents(events, new Date("2000-01-01T00:00:00Z"));
    expect(upcoming).toHaveLength(events.length);
    expect(past).toHaveLength(0);
    const later = partitionEvents(events, new Date("2100-01-01T00:00:00Z"));
    expect(later.upcoming).toHaveLength(0);
    expect(later.past).toHaveLength(events.length);
  });
});

describe("static params", () => {
  it("maps records to slug params", () => {
    expect(toStaticParams([{ slug: "a" }, { slug: "b" }])).toEqual([{ slug: "a" }, { slug: "b" }]);
  });

  it("returns a placeholder for empty collections so Cache Components builds succeed", () => {
    expect(toStaticParams([])).toEqual([{ slug: PLACEHOLDER_SLUG }]);
    expect(getPublication(PLACEHOLDER_SLUG)).toBeUndefined();
    expect(getResearchArea(PLACEHOLDER_SLUG)).toBeUndefined();
  });
});
