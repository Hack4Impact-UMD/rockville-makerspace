import { describe, expect, it } from "vitest";
import {
  blankToNull,
  parseMyTurnDate,
} from "@backend/sync/mapMyTurnMembers.ts";

describe("blankToNull", () => {
  it("returns null for empty and whitespace-only cells", () => {
    expect(blankToNull("")).toBeNull();
    expect(blankToNull("   ")).toBeNull();
  });

  it("trims the value otherwise", () => {
    expect(blankToNull(" Maria ")).toBe("Maria");
  });
});

describe("parseMyTurnDate", () => {
  it("parses M/D/YYYY as midnight UTC", () => {
    expect(parseMyTurnDate("6/30/2027")).toBe(Date.UTC(2027, 5, 30));
    expect(parseMyTurnDate("1/1/2026")).toBe(Date.UTC(2026, 0, 1));
    expect(parseMyTurnDate("12/31/2026")).toBe(Date.UTC(2026, 11, 31));
  });

  it("returns null for a blank cell", () => {
    expect(parseMyTurnDate("")).toBeNull();
  });

  it("returns null for dates that don't exist", () => {
    // Date.UTC would silently roll these over into the next month or year
    expect(parseMyTurnDate("2/30/2027")).toBeNull();
    expect(parseMyTurnDate("13/1/2027")).toBeNull();
  });

  it("returns null for anything that isn't M/D/YYYY", () => {
    expect(parseMyTurnDate("June 30")).toBeNull();
    expect(parseMyTurnDate("6//2027")).toBeNull();
    expect(parseMyTurnDate("6/30/27")).toBeNull();
  });
});
