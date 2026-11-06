"use client";

import { useMemo } from "react";
import { FilterChips, FilterSelect, FilterToolbar } from "@/components/shared/filter-toolbar";
import { SearchInput } from "@/components/shared/search-input";
import { EmptyState } from "@/components/shared/empty-state";
import { NewsCard } from "@/components/news/news-card";
import { useUrlState } from "@/hooks/use-url-state";
import { matchesQuery, toggleValue, uniqueSorted } from "@/lib/search";
import { newsCategoryValues, type NewsPost } from "@/types/content";

type NewsDirectoryProps = {
  posts: NewsPost[];
};

const defaults = { q: "", category: "", tag: [] as string[] };

export function NewsDirectory({ posts }: NewsDirectoryProps) {
  const { state, update, reset } = useUrlState(defaults);

  const categories = useMemo(() => {
    const present = new Set(posts.map((post) => post.category));
    return newsCategoryValues.filter((category) => present.has(category));
  }, [posts]);

  const tags = useMemo(() => uniqueSorted(posts.flatMap((post) => post.tags)), [posts]);

  const results = useMemo(
    () =>
      posts.filter((post) => {
        if (state.category && post.category !== state.category) return false;
        if (state.tag.length && !state.tag.some((tag) => post.tags.includes(tag))) return false;
        return matchesQuery(state.q, [post.title, post.excerpt, post.author, post.tags, post.body]);
      }),
    [posts, state],
  );

  const isFiltered = Boolean(state.q || state.category) || state.tag.length > 0;

  return (
    <div className="space-y-8">
      <FilterToolbar
        resultCount={results.length}
        resultLabel={results.length === 1 ? "article" : "articles"}
        isFiltered={isFiltered}
        onReset={reset}
        secondary={
          <FilterChips
            label="Tags"
            options={tags}
            selected={state.tag}
            onToggle={(tag) => update({ tag: toggleValue(state.tag, tag) })}
          />
        }
      >
        <SearchInput
          value={state.q}
          onChange={(q) => update({ q })}
          placeholder="Search articles…"
          label="Search news"
          className="lg:flex-1"
        />
        <FilterSelect
          label="Category"
          value={state.category}
          onChange={(category) => update({ category })}
          options={categories.map((category) => ({ value: category, label: category }))}
          allLabel="All categories"
          className="sm:w-60"
        />
      </FilterToolbar>

      {results.length === 0 ? (
        <EmptyState
          title="No articles match these filters"
          description="Try a different search term or clear the filters."
        />
      ) : (
        <div className="border-t border-border">
          {results.map((post) => (
            <NewsCard key={post.slug} post={post} variant="row" />
          ))}
        </div>
      )}
    </div>
  );
}
