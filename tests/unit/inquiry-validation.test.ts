import { describe, expect, it } from "vitest";
import { inquiryFormSchema, inquirySchema, inquiryTopics } from "@/lib/validation/inquiry";

const valid = {
  kind: "contact",
  name: "Jane Researcher",
  email: "jane@example.edu",
  organization: "",
  topic: inquiryTopics.contact[0],
  message: "I would like to ask about your work on provenance ledgers.",
  consent: true,
  website: "",
  startedAt: "1700000000000",
};

describe("inquiry validation", () => {
  it("accepts a well-formed submission and coerces the timestamp", () => {
    const parsed = inquirySchema.parse(valid);
    expect(parsed.startedAt).toBe(1700000000000);
    expect(parsed.kind).toBe("contact");
  });

  it("requires consent, a real email and a meaningful message", () => {
    expect(() => inquirySchema.parse({ ...valid, consent: false })).toThrow();
    expect(() => inquirySchema.parse({ ...valid, email: "nope" })).toThrow();
    expect(() => inquirySchema.parse({ ...valid, message: "too short" })).toThrow();
  });

  it("rejects honeypot content", () => {
    expect(() => inquirySchema.parse({ ...valid, website: "http://spam.example" })).toThrow();
  });

  it("exposes a client schema without server-only fields", () => {
    const parsed = inquiryFormSchema.safeParse({
      name: "Jane Researcher",
      email: "jane@example.edu",
      topic: "Joint research",
      message: "Let us build something verifiable together.",
      consent: true,
    });
    expect(parsed.success).toBe(true);
  });
});
