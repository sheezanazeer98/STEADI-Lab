import type { Metadata } from "next";
import { CalendarDays } from "lucide-react";
import { PageHero } from "@/components/shared/page-hero";
import { Section } from "@/components/shared/section";
import { SectionHeading } from "@/components/shared/section-heading";
import { EmptyState } from "@/components/shared/empty-state";
import { JsonLd } from "@/components/shared/json-ld";
import { EventCard } from "@/components/events/event-card";
import { getEvents, partitionEvents } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { absoluteUrl, siteConfig } from "@/lib/site";
import { getCachedNow } from "@/lib/time";
import { eventTypeValues } from "@/types/content";

export const metadata: Metadata = buildMetadata({
  title: "Events",
  description:
    "Research seminars, guest lectures, workshops, hackathons, conference presentations and community discussions hosted or attended by STEADI Lab.",
  path: "/events",
});

export default async function EventsPage() {
  const events = getEvents();
  // The reference time is cached and refreshed hourly, so the upcoming/past
  // split stays accurate without turning the route dynamic.
  const now = new Date(await getCachedNow());
  const { upcoming, past } = partitionEvents(events, now);

  const jsonLd = upcoming.map((event) => ({
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.summary,
    startDate: event.start,
    ...(event.end ? { endDate: event.end } : {}),
    eventStatus:
      event.status === "Cancelled"
        ? "https://schema.org/EventCancelled"
        : event.status === "Postponed"
          ? "https://schema.org/EventPostponed"
          : "https://schema.org/EventScheduled",
    eventAttendanceMode:
      event.format === "Virtual"
        ? "https://schema.org/OnlineEventAttendanceMode"
        : event.format === "Hybrid"
          ? "https://schema.org/MixedEventAttendanceMode"
          : "https://schema.org/OfflineEventAttendanceMode",
    location:
      event.format === "Virtual"
        ? { "@type": "VirtualLocation", url: event.registrationUrl ?? absoluteUrl("/events") }
        : { "@type": "Place", name: event.location },
    organizer: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
    url: absoluteUrl(`/events#${event.slug}`),
    ...(event.speakers.length
      ? { performer: event.speakers.map((speaker) => ({ "@type": "Person", name: speaker.name })) }
      : {}),
  }));

  return (
    <>
      <PageHero
        eyebrow="Events"
        title={
          <>
            Seminars, workshops and <span className="text-primary">talks</span>.
          </>
        }
        current="Events"
        breadcrumbs={[]}
        description="Where the lab meets the wider community: research seminars, guest lectures, workshops, hackathons and conference presentations. Dates are shown in the event's own timezone."
      >
        <ul className="mt-8 flex flex-wrap gap-2" aria-label="Event types">
          {eventTypeValues.map((type) => (
            <li
              key={type}
              className="rounded-sm border border-border px-2 py-1 label-mono text-muted-foreground"
            >
              {type}
            </li>
          ))}
        </ul>
      </PageHero>

      <Section className="border-t border-border" aria-labelledby="upcoming-title">
        <SectionHeading
          eyebrow="01 — Upcoming"
          title={<span id="upcoming-title">Upcoming events</span>}
          size="md"
          description={upcoming.length ? undefined : "Nothing is scheduled right now."}
        />
        <div className="mt-8 space-y-5">
          {upcoming.length ? (
            upcoming.map((event) => <EventCard key={event.slug} event={event} />)
          ) : (
            <EmptyState
              icon={CalendarDays}
              title="No upcoming events"
              description="Scheduled seminars, workshops and talks will be announced here. Follow the news page for announcements."
              hint="src/content/events/"
            />
          )}
        </div>
      </Section>

      <Section className="border-t border-border bg-card/50" aria-labelledby="past-title">
        <SectionHeading eyebrow="02 — Archive" title={<span id="past-title">Past events</span>} size="md" />
        <div className="mt-8 space-y-5">
          {past.length ? (
            past.map((event) => <EventCard key={event.slug} event={event} past />)
          ) : (
            <p className="text-sm text-muted-foreground">No past events have been recorded yet.</p>
          )}
        </div>
      </Section>

      {jsonLd.length ? <JsonLd data={jsonLd} /> : null}
    </>
  );
}
