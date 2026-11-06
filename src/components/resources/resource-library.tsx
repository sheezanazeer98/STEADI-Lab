"use client";

import { useMemo } from "react";
import { FilterChips, FilterSelect, FilterToolbar } from "@/components/shared/filter-toolbar";
import { SearchInput } from "@/components/shared/search-input";
import { EmptyState } from "@/components/shared/empty-state";
import { ResourceCard } from "@/components/resources/resource-card";
import { useUrlState } from "@/hooks/use-url-state";
import { matchesQuery, toggleValue, uniqueSorted } from "@/lib/search";
import { resourceCategoryValues, type Resource } from "@/types/content";

type ResourceLibraryProps = {
  resources: Resource[];
  areas: Record<string, string>;
};

const defaults = { q: "", category: "", tag: [] as string[] };

export function ResourceLibrary({ resources, areas }: ResourceLibraryProps) {
  const { state, update, reset } = useUrlState(defaults);

  const categories = useMemo(() => {
    const present = new Set(resources.map((resource) => resource.category));
    return resourceCategoryValues.filter((category) => present.has(category));
  }, [resources]);

  const tags = useMemo(() => uniqueSorted(resources.flatMap((resource) => resource.tags)), [resources]);

  const results = useMemo(
    () =>
      resources.filter((resource) => {
        if (state.category && resource.category !== state.category) return false;
        if (state.tag.length && !state.tag.some((tag) => resource.tags.includes(tag))) return false;
        return matchesQuery(state.q, [
          resource.title,
          resource.description,
          resource.tags,
          resource.category,
          resource.format,
        ]);
      }),
    [resources, state],
  );

  const isFiltered = Boolean(state.q || state.category) || state.tag.length > 0;

  return (
    <div className="space-y-8">
      <FilterToolbar
        resultCount={results.length}
        resultLabel={results.length === 1 ? "resource" : "resources"}
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
          placeholder="Search datasets, code, tools and materials…"
          label="Search resources"
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
          title="No resources match these filters"
          description="Try a different search term or clear the filters."
        />
      ) : (
        <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {results.map((resource) => (
            <li key={resource.slug}>
              <ResourceCard resource={resource} areaTitles={areas} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
