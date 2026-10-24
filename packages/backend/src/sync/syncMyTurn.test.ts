import type { Firestore } from "firebase-admin/firestore";
import { logger } from "firebase-functions";
import { afterEach, describe, expect, it, vi } from "vitest";
import { mockMyTurnMembers } from "@backend/myturn/mockData.ts";
import { syncRows } from "@backend/sync/syncMyTurn.ts";

const now = Date.UTC(2026, 9, 24);

// Firestore test double: set(..., { merge: true }) merges nested map fields.
// Emulator verification remains necessary before deployment.
function memoryFirestore() {
  const docs = new Map<string, Record<string, unknown>>();
  function merge(
    before: Record<string, unknown>,
    patch: Record<string, unknown>,
  ): Record<string, unknown> {
    const result = { ...before };
    for (const [key, value] of Object.entries(patch)) {
      const previous = result[key];
      result[key] =
        value !== null && typeof value === "object" && !Array.isArray(value)
          ? merge(
              (previous ?? {}) as Record<string, unknown>,
              value as Record<string, unknown>,
            )
          : value;
    }
    return result;
  }
  const writes: (() => void)[] = [];
  const db = {
    collection: (name: string) => ({
      doc: (id: string) => ({
        id: `${name}/${id}`,
        get: () => Promise.resolve({ exists: docs.has(`${name}/${id}`) }),
      }),
    }),
    batch: () => ({
      set: (
        ref: { id: string },
        data: Record<string, unknown>,
        options?: { merge: boolean },
      ) => {
        writes.push(() => {
          docs.set(
            ref.id,
            options?.merge ? merge(docs.get(ref.id) ?? {}, data) : data,
          );
        });
      },
      commit: () => {
        for (const write of writes.splice(0)) write();
        return Promise.resolve([]);
      },
    }),
  } as unknown as Firestore;
  return { db, docs };
}

afterEach(() => vi.restoreAllMocks());

describe("syncRows with MyTurn mock data", () => {
  it("creates every valid row, skips and logs the malformed row, then creates zero", async () => {
    const { db, docs } = memoryFirestore();
    const rows = mockMyTurnMembers(now);
    const warn = vi.spyOn(logger, "warn").mockImplementation(() => {});
    const validCount = rows.length - 1;

    await expect(syncRows(db, rows, now)).resolves.toEqual({
      created: validCount,
      updated: 0,
      skipped: 1,
    });
    expect(docs.size).toBe(validCount);
    expect(docs.has("people/myturn_")).toBe(false);
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining("Skipping invalid"),
    );

    await expect(syncRows(db, rows, now + 1000)).resolves.toEqual({
      created: 0,
      updated: validCount,
      skipped: 1,
    });
    expect(docs.size).toBe(validCount);
  });

  it("updates MyTurn fields while preserving every RMS-owned field", async () => {
    const { db, docs } = memoryFirestore();
    const rows = mockMyTurnMembers(now).slice(0, 1);
    await syncRows(db, rows, now);
    const id = "people/myturn_9001";
    const original = docs.get(id) ?? {};
    const rmsFields = {
      labelIds: ["volunteer"],
      checkedIn: true,
      currentVisitId: "visit-123",
      createdAt: 123,
    };
    const rmsMembership = {
      barcode: "RMS-123",
      certifications: ["laser-cutter"],
    };
    docs.set(id, {
      ...original,
      ...rmsFields,
      membership: {
        ...(original.membership as Record<string, unknown>),
        ...rmsMembership,
      },
    });
    const changed = {
      ...(rows[0] as Record<string, unknown>),
      "First Name": "Mariana",
    };

    await expect(syncRows(db, [changed], now + 1000)).resolves.toEqual({
      created: 0,
      updated: 1,
      skipped: 0,
    });
    expect(docs.get(id)).toMatchObject({
      ...rmsFields,
      firstName: "Mariana",
      updatedAt: now + 1000,
      membership: { ...rmsMembership, syncedAt: now + 1000 },
    });
  });
});
