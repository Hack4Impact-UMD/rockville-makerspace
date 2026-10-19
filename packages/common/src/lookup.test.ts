import { type } from "arktype";
import { describe, expect, it } from "vitest";
import { personSearchInput, phoneLast4 } from "@common/lookup.ts";

describe("personSearchInput", () => {
  it("accepts a query with an optional personType", () => {
    expect(personSearchInput({ query: "ja" })).not.toBeInstanceOf(type.errors);
    expect(
      personSearchInput({ query: "ja", personType: "member" }),
    ).not.toBeInstanceOf(type.errors);
  });

  it("rejects a 1-character query", () => {
    expect(personSearchInput({ query: "j" })).toBeInstanceOf(type.errors);
  });

  it("rejects an unknown personType", () => {
    expect(
      personSearchInput({ query: "ja", personType: "admin" }),
    ).toBeInstanceOf(type.errors);
  });
});

describe("phoneLast4", () => {
  it("returns the last 4 digits", () => {
    expect(phoneLast4("+13015551234")).toBe("1234");
  });

  it("returns null without a phone", () => {
    expect(phoneLast4(null)).toBeNull();
  });
});
