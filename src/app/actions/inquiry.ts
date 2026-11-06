"use server";

import { headers } from "next/headers";
import { inquirySchema, inquiryTopics, type InquiryValues } from "@/lib/validation/inquiry";
import { siteConfig } from "@/lib/site";

export type InquiryResult =
  | { status: "success"; message: string }
  | { status: "unconfigured"; message: string }
  | { status: "error"; message: string; fieldErrors?: Record<string, string[]> };

/* -------------------------------------------------------------------------- */
/* Spam protection                                                             */
/* -------------------------------------------------------------------------- */

const MIN_FILL_TIME_MS = 3000;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 5;

/** Best-effort in-memory limiter (per server instance; use an edge/KV limiter for stricter control). */
const submissions = new Map<string, number[]>();

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (submissions.get(key) ?? []).filter((time) => now - time < RATE_LIMIT_WINDOW_MS);
  submissions.set(key, [...recent, now]);
  if (submissions.size > 5000) submissions.clear();
  return recent.length >= RATE_LIMIT_MAX;
}

async function clientKey(): Promise<string> {
  const headerList = await headers();
  return (
    headerList.get("x-forwarded-for")?.split(",")[0]?.trim() || headerList.get("x-real-ip") || "anonymous"
  );
}

/* -------------------------------------------------------------------------- */
/* Delivery                                                                    */
/* -------------------------------------------------------------------------- */

function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

async function deliverViaResend(values: InquiryValues): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL ?? "STEADI Lab <onboarding@resend.dev>";
  if (!apiKey || !to) throw new Error("Email delivery is not configured.");

  const subject = `[${siteConfig.shortName} ${values.kind}] ${values.topic} — ${values.name}`;
  const lines = [
    `Kind: ${values.kind}`,
    `Topic: ${values.topic}`,
    `Name: ${values.name}`,
    `Email: ${values.email}`,
    `Organization: ${values.organization || "—"}`,
    "",
    values.message,
  ];

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: to.split(",").map((address) => address.trim()),
      reply_to: values.email,
      subject,
      text: lines.join("\n"),
      html: `<pre style="font-family:ui-monospace,monospace;white-space:pre-wrap">${escapeHtml(lines.join("\n"))}</pre>`,
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`Resend responded with ${response.status}: ${detail.slice(0, 200)}`);
  }
}

/* -------------------------------------------------------------------------- */
/* Action                                                                      */
/* -------------------------------------------------------------------------- */

export async function submitInquiry(formData: FormData): Promise<InquiryResult> {
  const raw = Object.fromEntries(formData.entries());
  const parsed = inquirySchema.safeParse({
    ...raw,
    consent: raw.consent === "true" || raw.consent === "on" ? true : raw.consent,
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      fieldErrors[key] = [...(fieldErrors[key] ?? []), issue.message];
    }
    return { status: "error", message: "Please correct the highlighted fields.", fieldErrors };
  }

  const values = parsed.data;

  // Silently accept bot submissions so they cannot probe the filters.
  const tooFast = Date.now() - values.startedAt < MIN_FILL_TIME_MS;
  if (values.website || tooFast) {
    return { status: "success", message: "Thank you — your message has been received." };
  }

  if (!inquiryTopics[values.kind].includes(values.topic)) {
    return {
      status: "error",
      message: "Please choose a valid topic.",
      fieldErrors: { topic: ["Invalid topic."] },
    };
  }

  if (isRateLimited(await clientKey())) {
    return {
      status: "error",
      message: "Too many messages were sent from your connection. Please try again later.",
    };
  }

  const configured = Boolean(process.env.RESEND_API_KEY && process.env.CONTACT_TO_EMAIL);

  if (!configured) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[inquiry] Email delivery not configured — message logged instead:", {
        kind: values.kind,
        topic: values.topic,
        name: values.name,
        email: values.email,
        organization: values.organization,
        message: values.message,
      });
      return {
        status: "success",
        message:
          "Thank you — your message has been received. (Development mode: delivery is not configured, so it was logged to the server console.)",
      };
    }
    return {
      status: "unconfigured",
      message:
        "Message delivery is not configured on this site yet. Please try again later or reach us through the links on this page.",
    };
  }

  try {
    await deliverViaResend(values);
    return { status: "success", message: "Thank you — your message has been sent. We will reply by email." };
  } catch (error) {
    console.error("[inquiry] Delivery failed:", error);
    return {
      status: "error",
      message: "We could not send your message right now. Please try again in a few minutes.",
    };
  }
}
