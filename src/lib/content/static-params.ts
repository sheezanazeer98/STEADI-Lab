/**
 * Slug used to satisfy Cache Components' build-time validation when a content
 * collection has no published records yet. With `cacheComponents` enabled every
 * `generateStaticParams` must return at least one entry; the placeholder is
 * resolved by the page as `notFound()` because no record carries this slug.
 * See https://nextjs.org/docs/messages/empty-generate-static-params
 */
export const PLACEHOLDER_SLUG = "__placeholder__";

/**
 * Convert a collection into `generateStaticParams` output, falling back to the
 * placeholder entry while the collection is empty (e.g. before verified
 * publications or people have been added).
 */
export function toStaticParams(records: ReadonlyArray<{ slug: string }>): Array<{ slug: string }> {
  if (records.length === 0) return [{ slug: PLACEHOLDER_SLUG }];
  return records.map(({ slug }) => ({ slug }));
}
