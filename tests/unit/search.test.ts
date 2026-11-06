import { describe, expect, it } from "vitest";
import { matchesQuery, normalize, toggleValue, tokenize, uniqueSorted } from "@/lib/search";

describe("search helpers", () => {
  it("normalises case and diacritics", () => {
    expect(normalize("  Décentralisé  ")).toBe("decentralise");
  });

  it("tokenises on whitespace and drops empty tokens", () => {
    expect(tokenize("  smart   contract ")).toEqual(["smart", "contract"]);
    expect(tokenize("")).toEqual([]);
  });

  it("matches when every token appears in some field", () => {
    const fields = ["Ledger-Anchored Provenance", ["provenance", "ledgers"], undefined];
    expect(matchesQuery("ledger provenance", fields)).toBe(true);
    expect(matchesQuery("LEDGER", fields)).toBe(true);
    expect(matchesQuery("ledger agents", fields)).toBe(false);
  });

  it("treats an empty query as a match-all", () => {
    expect(matchesQuery("   ", ["anything"])).toBe(true);
  });

  it("deduplicates and sorts values", () => {
    expect(uniqueSorted(["b", "a", "b", "", "c"])).toEqual(["a", "b", "c"]);
  });

  it("toggles values in and out of a list", () => {
    expect(toggleValue(["a"], "b")).toEqual(["a", "b"]);
    expect(toggleValue(["a", "b"], "a")).toEqual(["b"]);
  });
});
