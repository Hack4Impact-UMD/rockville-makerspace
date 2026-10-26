import { myTurnMember } from "@repo/common";
import { type } from "arktype";
import { describe, expect, it } from "vitest";
import { mockMyTurnMembers } from "@backend/myturn/mockData.ts";
import {
  blankToNull,
  mapMyTurnMember,
  parseMyTurnDate,
} from "@backend/sync/mapMyTurnMembers.ts";

const now = Date.UTC(2026, 9, 17);

/** Maps the mock's row for `customerId`, validating it first like the sync does. */
function mappedRow(customerId: string) {
  const raw = mockMyTurnMembers(now).find(
    (row) => (row as Record<string, unknown>)["Customer ID"] === customerId,
  );
  const row = myTurnMember(raw);
  if (row instanceof type.errors) {
    throw new Error(`Mock row ${customerId} is invalid: ${row.summary}`);
  }
  return mapMyTurnMember(row, now);
}

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

describe("mapMyTurnMember", () => {
  it("maps a complete row", () => {
    expect(mappedRow("9001")).toEqual({
      id: "myturn_9001",
      personType: "member",
      firstName: "Maria",
      lastName: "Santos",
      nameKey: "maria santos",
      phone: "+13015550101",
      email: "maria.santos@example.com",
      address: {
        street: "100 Maryland Ave",
        unit: "Apt 4",
        city: "Rockville",
        state: "MD",
        zip: "20850",
      },
      updatedAt: now,
      membership: {
        myturnId: "9001",
        membershipType: "Individual",
        expiresAt: Date.UTC(2027, 5, 30),
        memberSince: Date.UTC(2023, 2, 14),
        syncedAt: now,
      },
    });
  });

  it("stores null for a blank phone and address", () => {
    expect(mappedRow("9002")).toMatchObject({ phone: null, address: null });
  });

  it("normalizes a +1 phone and an accented name", () => {
    expect(mappedRow("9004")).toMatchObject({
      phone: "+13015550104",
      nameKey: "jose munoz",
      address: { street: "12 Summit Ave", unit: null, zip: "20877" },
    });
  });

  it("stores null for a blank email, membership type and expiration", () => {
    expect(mappedRow("9005")).toMatchObject({
      email: null,
      membership: { membershipType: null, expiresAt: null },
    });
  });

  it("leaves out the fields RMS owns", () => {
    const mapped = mappedRow("9001");
    expect(mapped).not.toHaveProperty("checkedIn");
    expect(mapped).not.toHaveProperty("labelIds");
    expect(mapped).not.toHaveProperty("createdAt");
    expect(mapped.membership).not.toHaveProperty("certifications");
    expect(mapped.membership).not.toHaveProperty("barcode");
  });
});
