import type { Metadata } from "next";
import { Users } from "lucide-react";
import { PageHero } from "@/components/shared/page-hero";
import { Section } from "@/components/shared/section";
import { EmptyState } from "@/components/shared/empty-state";
import { ButtonLink } from "@/components/shared/button-link";
import { TeamMemberCard } from "@/components/people/team-member-card";
import { getPeople } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { personRoleValues, type PersonRole } from "@/types/content";

export const metadata: Metadata = buildMetadata({
  title: "People",
  description:
    "The researchers, students and collaborators of STEADI Lab at The University of Scranton, organised by role.",
  path: "/people",
});

const roleDescriptions: Record<PersonRole, string> = {
  "Lab Director / Principal Investigator": "Leads the lab's research agenda.",
  "Faculty Researchers": "Faculty members contributing to lab projects.",
  "Research Associates": "Postdoctoral and staff researchers.",
  "Graduate Researchers": "Master's and doctoral students.",
  "Undergraduate Researchers": "Undergraduate students engaged in research.",
  Collaborators: "External researchers and technology partners working with the lab.",
  Alumni: "Former members and where their work continues.",
};

function roleAnchor(role: PersonRole): string {
  return role
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function PeoplePage() {
  const people = getPeople();
  const groups = personRoleValues
    .map((role) => ({ role, members: people.filter((person) => person.role === role) }))
    .filter((group) => group.members.length > 0);

  return (
    <>
      <PageHero
        eyebrow="People"
        title={
          <>
            The <span className="text-primary">researchers</span> behind the work.
          </>
        }
        current="People"
        breadcrumbs={[]}
        description="Faculty, students and collaborators working across artificial intelligence and blockchain at The University of Scranton. Only verified profiles are listed."
      >
        {groups.length > 1 ? (
          <nav aria-label="Jump to role" className="mt-8 flex flex-wrap gap-2">
            {groups.map((group) => (
              <a
                key={group.role}
                href={`#${roleAnchor(group.role)}`}
                className="rounded-sm border border-border bg-card px-2 py-1 label-mono text-foreground transition-colors hover:border-primary hover:text-primary"
              >
                {group.role} · {group.members.length}
              </a>
            ))}
          </nav>
        ) : null}
      </PageHero>

      <Section spacing="sm" className="border-t border-border pt-10">
        {groups.length ? (
          <div className="space-y-16">
            {groups.map((group, index) => (
              <section
                key={group.role}
                id={roleAnchor(group.role)}
                aria-labelledby={`${roleAnchor(group.role)}-title`}
                className="scroll-mt-28"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
                  <h2 id={`${roleAnchor(group.role)}-title`} className="display-text text-2xl sm:text-3xl">
                    <span className="mr-3 align-middle label-mono text-primary">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {group.role}
                  </h2>
                  <p className="text-sm text-muted-foreground">{roleDescriptions[group.role]}</p>
                </div>
                <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {group.members.map((person) => (
                    <li key={person.slug}>
                      <TeamMemberCard person={person} />
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Users}
            title="Team profiles have not been published yet"
            description="Profiles are added only with verified names, roles and affiliations. In the meantime, explore the research areas or get in touch about joining the lab."
            hint="src/content/people/"
            actions={
              <>
                <ButtonLink href="/research">Research areas</ButtonLink>
                <ButtonLink href="/opportunities" variant="secondary">
                  Opportunities
                </ButtonLink>
              </>
            }
          />
        )}
      </Section>
    </>
  );
}
