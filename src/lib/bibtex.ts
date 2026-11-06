import type { Publication } from "@/types/content";

const ENTRY_TYPES: Record<Publication["type"], string> = {
  "Journal Article": "article",
  "Conference Paper": "inproceedings",
  "Workshop Paper": "inproceedings",
  Preprint: "misc",
  "Technical Report": "techreport",
  Poster: "misc",
  "Working Paper": "unpublished",
};

function escapeBibtex(value: string): string {
  return value.replace(/[{}]/g, "").replace(/&/g, "\\&").replace(/%/g, "\\%");
}

export function makeCiteKey(publication: Publication): string {
  const surname = publication.authors[0]?.split(" ").filter(Boolean).at(-1) ?? "steadi";
  const word =
    publication.title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .split(/\s+/)
      .find((token) => token.length > 3) ?? "work";
  return `${surname.toLowerCase().replace(/[^a-z0-9]/g, "")}${publication.year}${word}`;
}

/** Returns the stored BibTeX record, or builds one from the metadata. */
export function toBibtex(publication: Publication): string {
  if (publication.bibtex?.trim()) return publication.bibtex.trim();

  const fields: Array<[string, string | number | undefined]> = [
    ["title", escapeBibtex(publication.title)],
    ["author", publication.authors.map(escapeBibtex).join(" and ")],
    ["year", publication.year],
  ];

  const venueField =
    publication.type === "Journal Article"
      ? "journal"
      : publication.type === "Technical Report"
        ? "institution"
        : publication.type === "Conference Paper" || publication.type === "Workshop Paper"
          ? "booktitle"
          : "howpublished";
  if (publication.venue) fields.push([venueField, escapeBibtex(publication.venue)]);
  if (publication.month) fields.push(["month", publication.month]);
  if (publication.doi) fields.push(["doi", publication.doi]);
  if (publication.publisherUrl) fields.push(["url", publication.publisherUrl]);
  else if (publication.pdfUrl?.startsWith("http")) fields.push(["url", publication.pdfUrl]);
  if (publication.status !== "Published") fields.push(["note", publication.status]);

  const body = fields
    .filter(([, value]) => value !== undefined && value !== "")
    .map(([key, value]) => `  ${key} = {${value}}`)
    .join(",\n");

  return `@${ENTRY_TYPES[publication.type]}{${makeCiteKey(publication)},\n${body}\n}`;
}

/** Plain-text citation in a simple author–year style. */
export function toPlainCitation(publication: Publication): string {
  const parts = [
    `${publication.authors.join(", ")} (${publication.year}).`,
    `${publication.title}.`,
    publication.venue ? `${publication.venue}.` : undefined,
    publication.doi ? `https://doi.org/${publication.doi}` : undefined,
  ];
  return parts.filter(Boolean).join(" ");
}

export function doiUrl(doi: string): string {
  return doi.startsWith("http") ? doi : `https://doi.org/${doi}`;
}
