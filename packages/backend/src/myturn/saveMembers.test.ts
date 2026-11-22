import { beforeEach, describe, expect, it } from "vitest";
import { COLLECTIONS, person } from "@repo/common";
import { type } from "arktype";
import { fakeFirestore } from "@backend/myturn/fakeFirestore.ts";
import type { ImportedMember } from "@backend/myturn/parseCsv.ts";
import {
  newMemberRecord,
  saveImportedMembers,
} from "@backend/myturn/saveMembers.ts";

let { db, store, batchSizes } = fakeFirestore();

const path = (customerId: string) =>
  `${COLLECTIONS.people}/myturn_${customerId}`;

function member(overrides: Partial<ImportedMember> = {}): ImportedMember {
  return {
    customerId: "1042",
    firstName: "Ana",
    lastName: "Diaz",
    nameKey: "ana diaz",
    phone: "+13015551234",
    email: "ana@example.com",
    address: {
      street: "1 Main St",
      unit: null,
      city: "Rockville",
      state: "MD",
      zip: "20850",
    },
    ...overrides,
  };
}

beforeEach(() => {
  ({ db, store, batchSizes } = fakeFirestore());
});

describe("newMemberRecord", () => {
  it("builds a valid Person with starting values", () => {
    const record = newMemberRecord(member(), 1000);

    expect(person(record)).not.toBeInstanceOf(type.errors);
    expect(record).toMatchObject({
      id: "myturn_1042",
      personType: "member",
      checkedIn: false,
      currentVisitId: null,
      labelIds: [],
      createdAt: 1000,
      updatedAt: 1000,
      membership: {
        myturnId: "1042",
        barcode: null,
        expiresAt: null,
        certifications: [],
        syncedAt: 1000,
      },
    });
  });

  it("accepts a member with no phone, email, or address", () => {
    const record = newMemberRecord(
      member({ phone: null, email: null, address: null }),
      1000,
    );
    expect(record.phone).toBeNull();
    expect(record.address).toBeNull();
  });
});

describe("saveImportedMembers", () => {
  it("creates a member that doesn't exist yet", async () => {
    const result = await saveImportedMembers(db, [member()], 1000);

    expect(result).toEqual({ created: 1, updated: 0 });
    expect(store.get(path("1042"))).toEqual(newMemberRecord(member(), 1000));
  });

  it("updates MyTurn fields and keeps app-owned fields", async () => {
    store.set(path("1042"), {
      ...newMemberRecord(member(), 1000),
      checkedIn: true,
      currentVisitId: "visit-1",
      labelIds: ["volunteer"],
      membership: {
        ...newMemberRecord(member(), 1000).membership,
        barcode: "ABC123",
        certifications: ["laser-cutter"],
      },
    });

    const result = await saveImportedMembers(
      db,
      [member({ firstName: "Anna", nameKey: "anna diaz", email: null })],
      2000,
    );

    expect(result).toEqual({ created: 0, updated: 1 });
    expect(store.get(path("1042"))).toMatchObject({
      firstName: "Anna",
      nameKey: "anna diaz",
      email: null,
      updatedAt: 2000,
      createdAt: 1000,
      checkedIn: true,
      currentVisitId: "visit-1",
      labelIds: ["volunteer"],
      membership: {
        barcode: "ABC123",
        certifications: ["laser-cutter"],
        syncedAt: 2000,
      },
    });
  });

  it("updates instead of duplicating when the same list is saved twice", async () => {
    const members = [member(), member({ customerId: "7" })];

    expect(await saveImportedMembers(db, members, 1000)).toEqual({
      created: 2,
      updated: 0,
    });
    expect(await saveImportedMembers(db, members, 2000)).toEqual({
      created: 0,
      updated: 2,
    });
    expect(store.size).toBe(2);
  });

  it("saves more than 500 members in batches of at most 500", async () => {
    const members = Array.from({ length: 1201 }, (_, i) =>
      member({ customerId: String(i) }),
    );

    const result = await saveImportedMembers(db, members, 1000);

    expect(result).toEqual({ created: 1201, updated: 0 });
    expect(store.size).toBe(1201);
    expect(batchSizes).toEqual([500, 500, 201]);
  });

  it("does nothing for an empty list", async () => {
    expect(await saveImportedMembers(db, [], 1000)).toEqual({
      created: 0,
      updated: 0,
    });
    expect(batchSizes).toEqual([]);
  });
});
