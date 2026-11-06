import { CalendarDays, MapPin, Users } from "lucide-react";
import { ExternalLink } from "@/components/shared/external-link";
import { MdxContent } from "@/lib/content/mdx";
import { StatusTag, Tag } from "@/components/shared/tag";
import { formatEventDate } from "@/lib/format";
import type { LabEvent } from "@/types/content";
import { cn } from "@/lib/utils";

type EventCardProps = {
  event: LabEvent;
  past?: boolean;
  className?: string;
};

export function EventCard({ event, past = false, className }: EventCardProps) {
  const start = new Date(event.start);
  const day = new Intl.DateTimeFormat("en-US", { day: "2-digit", timeZone: event.timezone }).format(start);
  const month = new Intl.DateTimeFormat("en-US", { month: "short", timeZone: event.timezone }).format(start);
  const year = new Intl.DateTimeFormat("en-US", { year: "numeric", timeZone: event.timezone }).format(start);

  return (
    <article
      id={event.slug}
      className={cn(
        "grid gap-5 rounded-md border border-border bg-card p-6 sm:grid-cols-[6rem_1fr]",
        past && "opacity-90",
        className,
      )}
    >
      <div className="flex items-center gap-3 border-border sm:flex-col sm:items-start sm:gap-0 sm:border-r sm:pr-5">
        <span className="font-heading text-4xl leading-none font-extrabold">{day}</span>
        <span className="label-mono text-primary sm:mt-2">
          {month} {year}
        </span>
      </div>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <Tag tone="accent">{event.type}</Tag>
          <Tag tone="outline">{event.format}</Tag>
          {event.status !== "Scheduled" || past ? (
            <StatusTag status={past && event.status === "Scheduled" ? "Completed" : event.status} />
          ) : null}
        </div>
        <h3 className="mt-3 text-xl leading-snug font-extrabold tracking-tight">{event.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">{event.summary}</p>
        <dl className="mt-4 grid gap-2 text-sm text-ink-soft sm:grid-cols-2">
          <div className="flex items-start gap-2">
            <CalendarDays className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
            <div>
              <dt className="sr-only">Date and time</dt>
              <dd>
                <time dateTime={event.start}>{formatEventDate(event.start, event.timezone)}</time>
                {event.end ? (
                  <>
                    <span aria-hidden="true"> → </span>
                    <time dateTime={event.end}>{formatEventDate(event.end, event.timezone)}</time>
                  </>
                ) : null}
              </dd>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <MapPin className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
            <div>
              <dt className="sr-only">Location</dt>
              <dd>{event.location}</dd>
            </div>
          </div>
          {event.speakers.length ? (
            <div className="flex items-start gap-2 sm:col-span-2">
              <Users className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
              <div>
                <dt className="sr-only">Speakers</dt>
                <dd>
                  {event.speakers.map((speaker, index) => (
                    <span key={speaker.name}>
                      {index > 0 ? ", " : ""}
                      {speaker.url ? (
                        <a
                          href={speaker.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium link-underline"
                        >
                          {speaker.name}
                        </a>
                      ) : (
                        <span className="font-medium">{speaker.name}</span>
                      )}
                      {speaker.affiliation ? (
                        <span className="text-muted-foreground"> ({speaker.affiliation})</span>
                      ) : null}
                    </span>
                  ))}
                </dd>
              </div>
            </div>
          ) : null}
        </dl>
        {event.hasBody ? <MdxContent source={event.body} className="mt-4 text-sm" /> : null}
        {event.registrationUrl && !past && event.status === "Scheduled" ? (
          <ExternalLink href={event.registrationUrl} variant="button" className="mt-5 h-10">
            Register
          </ExternalLink>
        ) : null}
      </div>
    </article>
  );
}
