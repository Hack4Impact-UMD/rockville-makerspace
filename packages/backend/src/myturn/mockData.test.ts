import { myTurnMember } from "@repo/common";
import { type } from "arktype";
import { describe, expect, it } from "vitest";
import { mockMyTurnMembers } from "@backend/myturn/mockData.ts";

const now = Date.UTC(2026, 9, 17);
const later = now + 24 * 60 * 60 * 1000;

function customerIds(rows: unknown[]) {
  return rows.map((row) => (row as Record<string, unknown>)["Customer ID"]);
}

describe("mockMyTurnMembers", () => {
  it("returns the same rows for the same time", () => {
    expect(mockMyTurnMembers(now)).toEqual(mockMyTurnMembers(now));
  });

  it("adds new members on a later poll", () => {
    const before = customerIds(mockMyTurnMembers(now));
    const after = customerIds(mockMyTurnMembers(later));

    expect(after).toEqual(expect.arrayContaining(before));
    expect(after.length).toBeGreaterThan(before.length);
  });

  it("includes exactly one malformed row", () => {
    const invalid = mockMyTurnMembers(now).filter(
      (row) => myTurnMember(row) instanceof type.errors,
    );

    expect(invalid).toHaveLength(1);
    expect(invalid[0]).toMatchObject({ "Customer ID": "" });
  });
});
