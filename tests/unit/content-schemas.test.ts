import { describe, expect, it } from "vitest";
import { eventSchema, openingSchema, personSchema, projectSchema, publicationSchema } from "@/types/content";

describe("content schemas", () => {
  it("accepts a minimal publication and applies defaults", () => {
    const parsed = publicationSchema.parse({
      title: "A paper",
      authors: ["Someone"],
      abstract: "Abstract",
      year: 2025,
      type: "Preprint",
    });
    expect(parsed.status).toBe("Published");
    expect(parsed.keywords).toEqual([]);
    expect(parsed.sample).toBe(false);
    expect(parsed.featured).toBe(false);
  });

  it("rejects publications without authors or with an unknown type", () => {
    expect(() =>
      publicationSchema.parse({ title: "x", authors: [], abstract: "a", year: 2025, type: "Preprint" }),
    ).toThrow();
    expect(() =>
      publicationSchema.parse({ title: "x", authors: ["a"], abstract: "a", year: 2025, type: "Blog" }),
    ).toThrow();
  });

  it("validates slugs used for cross-references", () => {
    expect(() =>
      projectSchema.parse({
        title: "P",
        summary: "S",
        category: "Blockchain",
        status: "Ongoing",
        researchAreas: ["Not A Slug"],
      }),
    ).toThrow(/Slugs must be lowercase/);
  });

  it("requires valid URLs and emails on person profiles", () => {
    expect(() =>
      personSchema.parse({ name: "N", role: "Alumni", affiliation: "A", email: "not-an-email" }),
    ).toThrow();
    expect(() =>
      personSchema.parse({ name: "N", role: "Alumni", affiliation: "A", github: "github.com/x" }),
    ).toThrow();
    expect(
      personSchema.parse({ name: "N", role: "Alumni", affiliation: "A", github: "https://github.com/x" })
        .github,
    ).toBe("https://github.com/x");
  });

  it("accepts ISO dates with offsets for events and defaults the timezone", () => {
    const event = eventSchema.parse({
      title: "E",
      summary: "S",
      type: "Workshop",
      start: "2026-09-01T14:00:00-04:00",
      location: "Scranton, PA",
    });
    expect(event.timezone).toBe("America/New_York");
    expect(event.status).toBe("Scheduled");
    expect(() => eventSchema.parse({ ...event, start: "September 1st" })).toThrow();
  });

  it("keeps funding optional on openings so nothing is implied", () => {
    const opening = openingSchema.parse({ title: "O", summary: "S", type: "Graduate Research" });
    expect(opening.funding).toBeUndefined();
    expect(opening.status).toBe("Open");
  });
});
