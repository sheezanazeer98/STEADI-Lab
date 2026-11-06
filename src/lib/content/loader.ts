import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { z } from "zod";
import type { Entry } from "@/types/content";

/**
 * Generic file-system collection loader.
 *
 * Every collection is a folder of `.mdx` / `.md` files with validated
 * frontmatter. Reads are synchronous so that pages using them are treated as
 * fully static by Next.js Cache Components (no Suspense boundary required).
 *
 * Verified content lives in `src/content/<collection>`.
 * Development-only sample records live in `src/content/samples/<collection>`
 * and are only loaded when `SHOW_SAMPLE_CONTENT` resolves to true.
 */

export const CONTENT_ROOT = path.join(process.cwd(), "src", "content");
export const SAMPLES_ROOT = path.join(CONTENT_ROOT, "samples");

const ALLOWED_EXTENSIONS = new Set([".mdx", ".md"]);

export function samplesEnabled(): boolean {
  const flag = process.env.SHOW_SAMPLE_CONTENT;
  if (flag === "true" || flag === "1") return true;
  if (flag === "false" || flag === "0") return false;
  return process.env.NODE_ENV !== "production";
}

export class ContentValidationError extends Error {
  constructor(
    public readonly file: string,
    message: string,
  ) {
    super(`Invalid content in ${file}:\n${message}`);
    this.name = "ContentValidationError";
  }
}

function listContentFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && ALLOWED_EXTENSIONS.has(path.extname(entry.name)))
    .map((entry) => path.join(dir, entry.name))
    .sort();
}

function formatIssues(error: z.ZodError): string {
  return error.issues.map((issue) => `  • ${issue.path.join(".") || "(root)"}: ${issue.message}`).join("\n");
}

type LoadOptions<S extends z.ZodType> = {
  collection: string;
  schema: S;
  /** Transform applied to each validated entry (e.g. computed fields). */
  decorate?: (entry: Entry<z.infer<S>>) => Entry<z.infer<S>>;
};

const cache = new Map<string, unknown[]>();

/**
 * Load, validate and decorate a collection. Results are memoised in production
 * builds; in development every call re-reads the file system so that content
 * edits show up without restarting the server.
 */
export function loadCollection<S extends z.ZodType>({
  collection,
  schema,
  decorate,
}: LoadOptions<S>): Entry<z.infer<S>>[] {
  const cacheKey = `${collection}:${samplesEnabled() ? "samples" : "verified"}`;
  if (process.env.NODE_ENV === "production" && cache.has(cacheKey)) {
    return cache.get(cacheKey) as Entry<z.infer<S>>[];
  }

  const sources: Array<{ file: string; sample: boolean }> = [
    ...listContentFiles(path.join(CONTENT_ROOT, collection)).map((file) => ({
      file,
      sample: false,
    })),
    ...(samplesEnabled()
      ? listContentFiles(path.join(SAMPLES_ROOT, collection)).map((file) => ({
          file,
          sample: true,
        }))
      : []),
  ];

  const seen = new Map<string, string>();
  const entries: Entry<z.infer<S>>[] = [];

  for (const { file, sample } of sources) {
    const raw = fs.readFileSync(file, "utf8");
    const { data, content } = matter(raw);
    const parsed = schema.safeParse({ ...data, sample: sample || data.sample === true });
    if (!parsed.success) {
      throw new ContentValidationError(path.relative(process.cwd(), file), formatIssues(parsed.error));
    }
    const frontmatter = parsed.data as z.infer<S> & { slug?: string; draft?: boolean };
    if (frontmatter.draft) continue;

    const entrySlug = frontmatter.slug ?? path.basename(file, path.extname(file));
    const previous = seen.get(entrySlug);
    if (previous) {
      throw new ContentValidationError(
        path.relative(process.cwd(), file),
        `Duplicate slug "${entrySlug}" also used by ${path.relative(process.cwd(), previous)}`,
      );
    }
    seen.set(entrySlug, file);

    const body = content.trim();
    let entry = {
      ...frontmatter,
      slug: entrySlug,
      body,
      hasBody: body.length > 0,
    } as Entry<z.infer<S>>;
    if (decorate) entry = decorate(entry);
    entries.push(entry);
  }

  if (process.env.NODE_ENV === "production") cache.set(cacheKey, entries);
  return entries;
}

/** Words-per-minute reading time estimate for MDX bodies. */
export function estimateReadingTime(text: string, wordsPerMinute = 220): number {
  const words = text
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/<[^>]+>/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / wordsPerMinute));
}
