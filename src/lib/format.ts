const LONG_DATE = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: "UTC",
});

const SHORT_DATE = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

/** Formats an ISO date (date-only values are treated as UTC to avoid off-by-one shifts). */
export function formatDate(iso: string, style: "long" | "short" = "long"): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return (style === "long" ? LONG_DATE : SHORT_DATE).format(date);
}

/** Formats an event date-time in the event's own timezone. */
export function formatEventDate(iso: string, timeZone: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  const hasTime = iso.includes("T");
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    year: "numeric",
    month: "long",
    day: "numeric",
    ...(hasTime ? { hour: "numeric", minute: "2-digit", timeZoneName: "short" } : {}),
    timeZone: hasTime ? timeZone : "UTC",
  }).format(date);
}

export function formatAuthors(authors: string[], max = 6): string {
  if (authors.length <= max) return authors.join(", ");
  return `${authors.slice(0, max).join(", ")}, et al.`;
}

export function pluralize(count: number, singular: string, plural = `${singular}s`): string {
  return `${count} ${count === 1 ? singular : plural}`;
}

export function padIndex(index: number): string {
  return String(index).padStart(2, "0");
}

export function truncate(text: string, max = 160): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1).trimEnd()}…`;
}
