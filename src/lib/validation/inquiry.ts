import { z } from "zod";

export const inquiryKinds = ["contact", "collaborate"] as const;
export type InquiryKind = (typeof inquiryKinds)[number];

export const inquiryTopics: Record<InquiryKind, readonly string[]> = {
  contact: [
    "General inquiry",
    "Research question",
    "Prospective student",
    "Media or press",
    "Speaking invitation",
    "Other",
  ],
  collaborate: [
    "University partnership",
    "Joint research",
    "Industry collaboration",
    "Research proposal",
    "Open-source contribution",
    "Academic collaboration",
  ],
};

export const inquirySchema = z.object({
  kind: z.enum(inquiryKinds),
  name: z.string().trim().min(2, "Please enter your name.").max(120),
  email: z.email("Please enter a valid email address.").max(200),
  organization: z.string().trim().max(160).optional().or(z.literal("")),
  topic: z.string().trim().min(1, "Please choose a topic.").max(80),
  message: z
    .string()
    .trim()
    .min(20, "Please tell us a little more (at least 20 characters).")
    .max(4000, "Please keep your message under 4,000 characters."),
  consent: z.literal(true, { error: "Please confirm you are happy for us to reply by email." }),
  /** Honeypot — must stay empty. */
  website: z.string().max(0).optional().or(z.literal("")),
  /** Timestamp (ms) when the form was rendered. */
  startedAt: z.coerce.number().int().nonnegative(),
});

export type InquiryInput = z.input<typeof inquirySchema>;
export type InquiryValues = z.output<typeof inquirySchema>;

export const inquiryFormSchema = inquirySchema.omit({ kind: true, website: true, startedAt: true });
export type InquiryFormValues = z.input<typeof inquiryFormSchema>;
