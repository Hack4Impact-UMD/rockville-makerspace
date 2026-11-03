import { describe, expect, it } from "vitest";
import { normalizePhone } from "@common/phone.ts";

describe("normalizePhone", () => {
  it("converts every US format MyTurn sends to E.164", () => {
    expect(normalizePhone("(301) 555-0101")).toBe("+13015550101");
    expect(normalizePhone("301.555.0103")).toBe("+13015550103");
    expect(normalizePhone("+1 301 555 0104")).toBe("+13015550104");
    expect(normalizePhone("3015550105")).toBe("+13015550105");
    expect(normalizePhone("(240) 555-0106")).toBe("+12405550106");
  });

  it("returns null for a blank phone", () => {
    expect(normalizePhone("")).toBeNull();
  });

  it("returns null instead of guessing at a number that isn't US", () => {
    // Too short, a missing digit
    expect(normalizePhone("301-555-010")).toBeNull();
    // 11 digits that dont start with the US country code
    expect(normalizePhone("23015550104")).toBeNull();
    // International (UK mobile)
    expect(normalizePhone("+44 7911 123456")).toBeNull();
  });
});
