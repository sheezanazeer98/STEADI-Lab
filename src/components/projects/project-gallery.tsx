"use client";

import { useMemo } from "react";
import { FilterChips, FilterSelect, FilterToolbar } from "@/components/shared/filter-toolbar";
import { SearchInput } from "@/components/shared/search-input";
import { EmptyState } from "@/components/shared/empty-state";
import { ProjectCard } from "@/components/projects/project-card";
import { useUrlState } from "@/hooks/use-url-state";
import { matchesQuery, toggleValue, uniqueSorted } from "@/lib/search";
import { projectCategoryValues, projectStatusValues, type Project } from "@/types/content";

type ProjectGalleryProps = {
  projects: Project[];
};

const defaults = {
  q: "",
  category: "",
  status: "",
  tag: [] as string[],
};

export function ProjectGallery({ projects }: ProjectGalleryProps) {
  const { state, update, reset } = useUrlState(defaults);

  const categories = useMemo(() => {
    const present = new Set(projects.map((project) => project.category));
    return projectCategoryValues.filter((category) => present.has(category));
  }, [projects]);

  const statuses = useMemo(() => {
    const present = new Set(projects.map((project) => project.status));
    return projectStatusValues.filter((status) => present.has(status));
  }, [projects]);

  const tags = useMemo(() => uniqueSorted(projects.flatMap((project) => project.tags)), [projects]);

  const results = useMemo(
    () =>
      projects.filter((project) => {
        if (state.category && project.category !== state.category) return false;
        if (state.status && project.status !== state.status) return false;
        if (state.tag.length && !state.tag.some((tag) => project.tags.includes(tag))) return false;
        return matchesQuery(state.q, [
          project.title,
          project.summary,
          project.tags,
          project.techStack,
          project.category,
        ]);
      }),
    [projects, state],
  );

  const isFiltered = Boolean(state.q || state.category || state.status) || state.tag.length > 0;

  return (
    <div className="space-y-8">
      <FilterToolbar
        resultCount={results.length}
        resultLabel={results.length === 1 ? "project" : "projects"}
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
          placeholder="Search projects, technologies or tags…"
          label="Search projects"
          className="lg:flex-1"
        />
        <div className="grid grid-cols-2 gap-3 sm:flex">
          <FilterSelect
            label="Category"
            value={state.category}
            onChange={(category) => update({ category })}
            options={categories.map((category) => ({ value: category, label: category }))}
            allLabel="All categories"
            className="sm:w-52"
          />
          <FilterSelect
            label="Status"
            value={state.status}
            onChange={(status) => update({ status })}
            options={statuses.map((status) => ({ value: status, label: status }))}
            allLabel="All statuses"
            className="sm:w-40"
          />
        </div>
      </FilterToolbar>

      {results.length === 0 ? (
        <EmptyState
          title="No projects match these filters"
          description="Try a different search term or clear the filters."
        />
      ) : (
        <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {results.map((project) => (
            <li key={project.slug}>
              <ProjectCard project={project} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
