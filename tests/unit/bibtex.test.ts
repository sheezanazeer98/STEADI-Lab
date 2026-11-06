import { describe, expect, it } from "vitest";
import { doiUrl, makeCiteKey, toBibtex, toPlainCitation } from "@/lib/bibtex";
import type { Publication } from "@/types/content";

const base: Publication = {
  slug: "test-paper",
  title: "Verifiable & Trustworthy Pipelines for Research Data",
  authors: ["Ada Lovelace", "Alan M. Turing"],
  abstract: "An abstract.",
  year: 2026,
  month: 3,
  venue: "Journal of Example Systems",
  type: "Journal Article",
  status: "Published",
  doi: "10.1234/example.2026",
  keywords: [],
  researchAreas: [],
  projects: [],
  people: [],
  sample: false,
  draft: false,
  featured: false,
  body: "",
  hasBody: false,
};

describe("bibtex", () => {
  it("builds a stable cite key from surname, year and first long title word", () => {
    expect(makeCiteKey(base)).toBe("lovelace2026verifiable");
  });

  it("generates an article entry with escaped fields", () => {
    const bibtex = toBibtex(base);
    expect(bibtex.startsWith("@article{lovelace2026verifiable,")).toBe(true);
    expect(bibtex).toContain("title = {Verifiable \\& Trustworthy Pipelines for Research Data}");
    expect(bibtex).toContain("author = {Ada Lovelace and Alan M. Turing}");
    expect(bibtex).toContain("journal = {Journal of Example Systems}");
    expect(bibtex).toContain("doi = {10.1234/example.2026}");
    expect(bibtex.trim().endsWith("}")).toBe(true);
  });

  it("uses the right entry type and venue field per publication type", () => {
    expect(toBibtex({ ...base, type: "Conference Paper" })).toMatch(/^@inproceedings\{/);
    expect(toBibtex({ ...base, type: "Conference Paper" })).toContain("booktitle = {");
    expect(toBibtex({ ...base, type: "Technical Report" })).toContain("institution = {");
    expect(toBibtex({ ...base, type: "Preprint", status: "Preprint" })).toContain("note = {Preprint}");
  });

  it("prefers a stored bibtex record when present", () => {
    expect(toBibtex({ ...base, bibtex: "@misc{custom, title={x}}\n" })).toBe("@misc{custom, title={x}}");
  });

  it("formats a plain citation", () => {
    expect(toPlainCitation(base)).toBe(
      "Ada Lovelace, Alan M. Turing (2026). Verifiable & Trustworthy Pipelines for Research Data. Journal of Example Systems. https://doi.org/10.1234/example.2026",
    );
  });

  it("resolves DOI URLs", () => {
    expect(doiUrl("10.1/abc")).toBe("https://doi.org/10.1/abc");
    expect(doiUrl("https://doi.org/10.1/abc")).toBe("https://doi.org/10.1/abc");
  });
});
