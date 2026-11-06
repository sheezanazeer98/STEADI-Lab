import type { Metadata } from "next";
import { PageHero } from "@/components/shared/page-hero";
import { Section } from "@/components/shared/section";
import { EmptyState } from "@/components/shared/empty-state";
import { ProjectGallery } from "@/components/projects/project-gallery";
import { getProjects } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { projectCategoryValues, projectStatusValues } from "@/types/content";

export const metadata: Metadata = buildMetadata({
  title: "Research Projects",
  description:
    "A filterable portfolio of STEADI Lab research projects across artificial intelligence, blockchain, agentic systems, smart contracts, Web3, security and data analytics.",
  path: "/projects",
});

export default function ProjectsPage() {
  const projects = getProjects();
  const counts = Object.fromEntries(
    projectStatusValues.map((status) => [status, projects.filter((p) => p.status === status).length]),
  );

  return (
    <>
      <PageHero
        eyebrow="Projects"
        title={
          <>
            Experiments that become <span className="text-primary">systems</span>.
          </>
        }
        current="Projects"
        breadcrumbs={[]}
        description="Each project page documents objectives, technical approach, technology stack, team, publications and repositories so the work can be reproduced and extended."
      >
        <dl className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
          {projectStatusValues.map((status) => (
            <div key={status} className="flex items-baseline gap-2">
              <dd className="font-heading text-2xl font-extrabold">{counts[status]}</dd>
              <dt className="label-mono text-muted-foreground">{status}</dt>
            </div>
          ))}
        </dl>
      </PageHero>
      <Section spacing="sm" className="border-t border-border pt-10">
        {projects.length ? (
          <ProjectGallery projects={projects} />
        ) : (
          <EmptyState
            title="No projects have been published yet"
            description={`Projects are organised under ${projectCategoryValues.length} categories and three statuses. Add a project file to populate this gallery with search, category, tag and status filters.`}
            hint="src/content/projects/"
          />
        )}
      </Section>
    </>
  );
}
