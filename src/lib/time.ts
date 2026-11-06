import { cacheLife } from "next/cache";

/**
 * Cache Components forbid reading the current time during prerendering
 * because it would make the output non-deterministic. Wrapping the read in a
 * cached function captures the value at cache-fill time and refreshes it on
 * the configured schedule, which keeps the pages fully static.
 */

/** Current epoch milliseconds, refreshed roughly hourly. */
export async function getCachedNow(): Promise<number> {
  "use cache";
  cacheLife("hours");
  return Date.now();
}

/** Current year, refreshed daily. Used for copyright notices. */
export async function getCachedYear(): Promise<number> {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}
