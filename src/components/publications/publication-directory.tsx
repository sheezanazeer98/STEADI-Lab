"use client";

import { useMemo } from "react";
import { LayoutGrid, List } from "lucide-react";
import { FilterChips, FilterSelect, FilterToolbar, Segmented } from "@/components/shared/filter-toolbar";
import { SearchInput } from "@/components/shared/search-input";
import { EmptyState } from "@/components/shared/empty-state";
import { PublicationCard } from "@/components/publications/publication-card";
import { useUrlState } from "@/hooks/use-url-state";
import { matchesQuery, toggleValue } from "@/lib/search";
import { publicationTypeValues, type Publication } from "@/types/content";

type PublicationDirectoryProps = {
  publications: Publication[];
  years: number[];
  /** slug → title for research areas. */
  areas: Record<string, string>;
};

const defaults = {
  q: "",
  year: "",
  type: "",
  area: [] as string[],
  sort: "newest",
  view: "cards",
};

export function PublicationDirectory({ publications, years, areas }: PublicationDirectoryProps) {
  const { state, update, reset } = useUrlState(defaults);

  const usedTypes = useMemo(() => {
    const present = new Set(publications.map((publication) => publication.type));
    return publicationTypeValues.filter((type) => present.has(type));
  }, [publications]);

  const areaOptions = useMemo(() => {
    const present = new Set(publications.flatMap((publication) => publication.researchAreas));
    return Object.entries(areas)
      .filter(([slug]) => present.has(slug))
      .map(([slug, title]) => ({ slug, title }));
  }, [publications, areas]);

  const results = useMemo(() => {
    const filtered = publications.filter((publication) => {
      if (state.year && String(publication.year) !== state.year) return false;
      if (state.type && publication.type !== state.type) return false;
      if (state.area.length && !state.area.some((slug) => publication.researchAreas.includes(slug))) {
        return false;
      }
      return matchesQuery(state.q, [
        publication.title,
        publication.authors,
        publication.keywords,
        publication.venue,
        publication.abstract,
      ]);
    });
    return state.sort === "oldest"
      ? [...filtered].sort((a, b) => a.year - b.year || (a.month ?? 0) - (b.month ?? 0))
      : filtered;
  }, [publications, state]);

  const isFiltered =
    Boolean(state.q || state.year || state.type) || state.area.length > 0 || state.sort !== "newest";

  const selectedAreaTitles = state.area.map((slug) => areas[slug] ?? slug);

  return (
    <div className="space-y-8">
      <FilterToolbar
        resultCount={results.length}
        resultLabel={results.length === 1 ? "publication" : "publications"}
        isFiltered={isFiltered}
        onReset={reset}
        secondary={
          areaOptions.length ? (
            <FilterChips
              label="Research area"
              options={areaOptions.map((option) => option.title)}
              selected={selectedAreaTitles}
              onToggle={(title) => {
                const slug = areaOptions.find((option) => option.title === title)?.slug ?? title;
                update({ area: toggleValue(state.area, slug) });
              }}
            />
          ) : null
        }
      >
        <SearchInput
          value={state.q}
          onChange={(q) => update({ q })}
          placeholder="Search by title, author or keyword…"
          label="Search publications"
          className="lg:flex-1"
        />
        <div className="grid grid-cols-2 gap-3 sm:flex sm:items-center">
          <FilterSelect
            label="Year"
            value={state.year}
            onChange={(year) => update({ year })}
            options={years.map((year) => ({ value: String(year), label: String(year) }))}
            allLabel="All years"
            className="sm:w-36"
          />
          <FilterSelect
            label="Type"
            value={state.type}
            onChange={(type) => update({ type })}
            options={usedTypes.map((type) => ({ value: type, label: type }))}
            allLabel="All types"
            className="sm:w-44"
          />
          <Segmented
            label="Sort order"
            value={state.sort}
            onChange={(sort) => update({ sort })}
            options={[
              { value: "newest", label: "Newest" },
              { value: "oldest", label: "Oldest" },
            ]}
          />
          <Segmented
            label="View"
            value={state.view}
            onChange={(view) => update({ view })}
            options={[
              {
                value: "cards",
                label: <LayoutGrid className="size-4" aria-hidden="true" />,
                title: "Card view",
              },
              {
                value: "list",
                label: <List className="size-4" aria-hidden="true" />,
                title: "Compact list",
              },
            ]}
          />
        </div>
      </FilterToolbar>

      {results.length === 0 ? (
        <EmptyState
          title="No publications match these filters"
          description="Try a different search term or clear the filters to see every record."
        />
      ) : state.view === "list" ? (
        <div className="border-t border-border">
          {results.map((publication) => (
            <PublicationCard
              key={publication.slug}
              publication={publication}
              areaTitles={areas}
              variant="row"
            />
          ))}
        </div>
      ) : (
        <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {results.map((publication) => (
            <li key={publication.slug}>
              <PublicationCard publication={publication} areaTitles={areas} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
