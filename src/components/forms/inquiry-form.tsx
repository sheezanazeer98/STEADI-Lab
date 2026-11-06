"use client";

import { useId, useRef, useState, useTransition, type FormEvent } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, CircleAlert, LoaderCircle, Send } from "lucide-react";
import { submitInquiry, type InquiryResult } from "@/app/actions/inquiry";
import {
  inquiryFormSchema,
  inquiryTopics,
  type InquiryFormValues,
  type InquiryKind,
} from "@/lib/validation/inquiry";
import { cn } from "@/lib/utils";

type InquiryFormProps = {
  kind: InquiryKind;
  className?: string;
};

const fieldClass =
  "border-input bg-card text-foreground placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-primary/30 aria-invalid:border-destructive aria-invalid:ring-destructive/20 w-full rounded-md border px-3.5 text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none";

/** Serialises validated values for the server action (runs outside render). */
function toFormData(
  kind: InquiryKind,
  values: InquiryFormValues,
  startedAt: number,
  website: string,
): FormData {
  const formData = new FormData();
  formData.set("kind", kind);
  formData.set("name", values.name);
  formData.set("email", values.email);
  formData.set("organization", values.organization ?? "");
  formData.set("topic", values.topic);
  formData.set("message", values.message);
  formData.set("consent", String(values.consent));
  formData.set("startedAt", String(startedAt || Date.now()));
  formData.set("website", website);
  return formData;
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-1.5 flex items-center gap-1 text-xs font-medium text-destructive">
      <CircleAlert className="size-3.5" aria-hidden="true" />
      {message}
    </p>
  );
}

export function InquiryForm({ kind, className }: InquiryFormProps) {
  const id = useId();
  const [result, setResult] = useState<InquiryResult | null>(null);
  const [pending, startTransition] = useTransition();
  const startedAt = useRef<number>(0);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<InquiryFormValues>({
    resolver: zodResolver(inquiryFormSchema),
    defaultValues: { name: "", email: "", organization: "", topic: "", message: "" },
  });

  const topics = inquiryTopics[kind];

  // Wrapped in an event handler so refs are only read on submit, not during render.
  const onSubmit = (event: FormEvent<HTMLFormElement>) =>
    handleSubmit((values) => {
      const honeypot = document.getElementById(`${id}-website`) as HTMLInputElement | null;
      const formData = toFormData(kind, values, startedAt.current, honeypot?.value ?? "");

      startTransition(async () => {
        const response = await submitInquiry(formData);
        setResult(response);
        if (response.status === "success") {
          reset();
        } else if (response.status === "error" && response.fieldErrors) {
          for (const [field, messages] of Object.entries(response.fieldErrors)) {
            if (field in values) {
              setError(field as keyof InquiryFormValues, { message: messages[0] });
            }
          }
        }
      });
    })(event);

  if (result?.status === "success") {
    return (
      <div role="status" className={cn("rounded-md border border-border bg-card p-8 text-center", className)}>
        <CheckCircle2 className="mx-auto size-10 text-emerald-600" aria-hidden="true" />
        <h3 className="mt-4 text-xl font-extrabold tracking-tight">Message received</h3>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">{result.message}</p>
        <button
          type="button"
          onClick={() => setResult(null)}
          className="mt-6 text-sm font-semibold text-primary hover:underline"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      onFocusCapture={() => {
        if (!startedAt.current) startedAt.current = Date.now();
      }}
      noValidate
      className={cn("rounded-md border border-border bg-card p-6 sm:p-8", className)}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={`${id}-name`} className="mb-2 block label-mono text-foreground">
            Name <span className="text-primary">*</span>
          </label>
          <input
            id={`${id}-name`}
            type="text"
            autoComplete="name"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? `${id}-name-error` : undefined}
            className={cn(fieldClass, "h-11")}
            {...register("name")}
          />
          <FieldError id={`${id}-name-error`} message={errors.name?.message} />
        </div>
        <div>
          <label htmlFor={`${id}-email`} className="mb-2 block label-mono text-foreground">
            Email <span className="text-primary">*</span>
          </label>
          <input
            id={`${id}-email`}
            type="email"
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? `${id}-email-error` : undefined}
            className={cn(fieldClass, "h-11")}
            {...register("email")}
          />
          <FieldError id={`${id}-email-error`} message={errors.email?.message} />
        </div>
        <div>
          <label htmlFor={`${id}-organization`} className="mb-2 block label-mono text-foreground">
            Organization
          </label>
          <input
            id={`${id}-organization`}
            type="text"
            autoComplete="organization"
            className={cn(fieldClass, "h-11")}
            {...register("organization")}
          />
        </div>
        <div>
          <label htmlFor={`${id}-topic`} className="mb-2 block label-mono text-foreground">
            Topic <span className="text-primary">*</span>
          </label>
          <select
            id={`${id}-topic`}
            aria-invalid={Boolean(errors.topic)}
            aria-describedby={errors.topic ? `${id}-topic-error` : undefined}
            className={cn(fieldClass, "h-11 appearance-none")}
            {...register("topic")}
          >
            <option value="">Select a topic…</option>
            {topics.map((topic) => (
              <option key={topic} value={topic}>
                {topic}
              </option>
            ))}
          </select>
          <FieldError id={`${id}-topic-error`} message={errors.topic?.message} />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor={`${id}-message`} className="mb-2 block label-mono text-foreground">
            Message <span className="text-primary">*</span>
          </label>
          <textarea
            id={`${id}-message`}
            rows={6}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? `${id}-message-error` : `${id}-message-hint`}
            className={cn(fieldClass, "min-h-36 py-3 leading-relaxed")}
            {...register("message")}
          />
          <p id={`${id}-message-hint`} className="mt-1.5 text-xs text-muted-foreground">
            {kind === "collaborate"
              ? "Describe the collaboration you have in mind, relevant timelines and what you hope to achieve."
              : "Tell us how we can help. Please do not include sensitive personal information."}
          </p>
          <FieldError id={`${id}-message-error`} message={errors.message?.message} />
        </div>
        <div className="sm:col-span-2">
          <label className="flex items-start gap-3 text-sm">
            <input
              type="checkbox"
              aria-invalid={Boolean(errors.consent)}
              aria-describedby={errors.consent ? `${id}-consent-error` : undefined}
              className="mt-0.5 size-4 shrink-0 accent-primary"
              {...register("consent")}
            />
            <span className="leading-relaxed text-ink-soft">
              I agree that STEADI Lab may use the details above to reply to my message, as described in the{" "}
              <Link href="/privacy" className="text-primary link-underline">
                privacy notice
              </Link>
              .
            </span>
          </label>
          <FieldError id={`${id}-consent-error`} message={errors.consent?.message} />
        </div>
        {/* Honeypot: hidden from people, attractive to bots. */}
        <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
          <label htmlFor={`${id}-website`}>Website</label>
          <input id={`${id}-website`} type="text" name="website" tabIndex={-1} autoComplete="off" />
        </div>
      </div>

      {result ? (
        <p
          role="alert"
          className={cn(
            "mt-6 flex items-start gap-2 rounded-md border px-3.5 py-3 text-sm",
            result.status === "unconfigured"
              ? "border-amber-600/40 bg-amber-500/10 text-amber-900 dark:text-amber-200"
              : "border-destructive/40 bg-destructive/10 text-destructive",
          )}
        >
          <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          {result.message}
        </p>
      ) : null}

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <p className="text-xs text-muted-foreground">
          <span className="text-primary">*</span> Required fields
        </p>
        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-11 items-center gap-2 rounded-md bg-foreground px-6 text-sm font-semibold text-background transition-colors hover:bg-primary hover:text-primary-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none disabled:opacity-60"
        >
          {pending ? (
            <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
          ) : (
            <Send className="size-4" aria-hidden="true" />
          )}
          {pending ? "Sending…" : "Send message"}
        </button>
      </div>
    </form>
  );
}
