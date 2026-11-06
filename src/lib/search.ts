/**
 * Lightweight, dependency-free text matching used by the searchable
 * directories (publications, projects, products, people, news, resources).
 */

export function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

export function tokenize(query: string): string[] {
  return normalize(query)
    .split(/\s+/)
    .filter((token) => token.length > 0);
}

/**
 * Returns true when every query token appears in at least one of the fields.
 * Empty queries match everything.
 */
export function matchesQuery(query: string, fields: Array<string | string[] | undefined>): boolean {
  const tokens = tokenize(query);
  if (tokens.length === 0) return true;
  const haystack = normalize(
    fields.flatMap((field) => (Array.isArray(field) ? field : [field ?? ""])).join(" \u0001 "),
  );
  return tokens.every((token) => haystack.includes(token));
}

export function uniqueSorted(values: Iterable<string>): string[] {
  return [...new Set(values)].filter(Boolean).sort((a, b) => a.localeCompare(b));
}

export function toggleValue<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}
