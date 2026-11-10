import type { Firestore } from "firebase-admin/firestore";
import { beforeEach, describe, expect, it } from "vitest";
import { COLLECTIONS } from "@repo/common";
import {
  generateBarcode,
  assignBarcode,
  barcodeSvg,
  barcodePng,
} from "@backend/barcode.ts";

describe("generateBarcode", () => {
  it("generates an 11-character barcode", () => {
    const barcode = generateBarcode();

    expect(barcode).toHaveLength(11);
  });

  it("only contains uppercase letters and digits", () => {
    const barcode = generateBarcode();

    expect(barcode).toMatch(/^[A-Z0-9]+$/);
  });

  it("generates different barcodes", () => {
    const barcode1 = generateBarcode();
    const barcode2 = generateBarcode();

    expect(barcode1).not.toBe(barcode2);
  });
});

type Doc = Record<string, unknown>;
type Ref = { path: string };
type Query = { name: string; field: string; value: unknown };

// In-memory stand-in for Firestore, only what assignBarcode uses. CI's unit
// tests run without the emulator, so these can't touch a real database.
const store = new Map<string, Doc>();

function getByPath(data: Doc | undefined, path: string) {
  return path
    .split(".")
    .reduce<unknown>((value, key) => (value as Doc | undefined)?.[key], data);
}

// Applies an update like { "membership.barcode": "X" } to nested fields
function setByPath(data: Doc, path: string, value: unknown) {
  const keys = path.split(".");
  const last = keys.pop() ?? "";
  let target = data;
  for (const key of keys) {
    target[key] = { ...(target[key] as Doc) };
    target = target[key] as Doc;
  }
  target[last] = value;
}

const db = {
  collection: (name: string) => ({
    doc: (id: string): Ref => ({ path: `${name}/${id}` }),
    where: (field: string, _op: string, value: unknown): Query => ({
      name,
      field,
      value,
    }),
  }),
  // Writes are saved only if the work finishes, like a real transaction
  runTransaction: async (work: (transaction: unknown) => Promise<unknown>) => {
    const writes: (() => void)[] = [];

    const transaction = {
      get: (target: Ref | Query) => {
        if ("path" in target) {
          const data = store.get(target.path);
          return { exists: data !== undefined, data: () => data };
        }

        const docs = [...store.entries()].filter(
          ([path, data]) =>
            path.startsWith(`${target.name}/`) &&
            getByPath(data, target.field) === target.value,
        );
        return { empty: docs.length === 0 };
      },
      update: (ref: Ref, data: Doc) => {
        writes.push(() => {
          const updated = structuredClone(store.get(ref.path) ?? {});
          for (const [path, value] of Object.entries(data)) {
            setByPath(updated, path, value);
          }
          store.set(ref.path, updated);
        });
      },
    };

    const result = await work(transaction);
    writes.forEach((write) => write());

    return result;
  },
} as unknown as Firestore;

describe("assignBarcode", () => {
  const memberId = "test-member-barcode";
  const otherMemberId = "test-member-barcode-2";
  const guestId = "test-guest-barcode";

  beforeEach(() => {
    store.clear();
    store.set(`${COLLECTIONS.people}/${memberId}`, {
      membership: { barcode: null },
    });
    store.set(`${COLLECTIONS.people}/${otherMemberId}`, {
      membership: { barcode: null },
    });
    store.set(`${COLLECTIONS.people}/${guestId}`, { membership: null });
  });

  it("assigns a valid barcode to a member and saves it", async () => {
    const barcode = await assignBarcode(db, memberId);
    expect(barcode).toMatch(/^[A-Z0-9]{11}$/);

    const saved = store.get(`${COLLECTIONS.people}/${memberId}`);
    expect(getByPath(saved, "membership.barcode")).toBe(barcode);
  });

  it("returns the same barcode if called again", async () => {
    const first = await assignBarcode(db, memberId);
    const second = await assignBarcode(db, memberId);
    expect(second).toBe(first);
  });

  it("gives different members different barcodes", async () => {
    const a = await assignBarcode(db, memberId);
    const b = await assignBarcode(db, otherMemberId);
    expect(a).not.toBe(b);
  });

  it("throws for a non-member", async () => {
    await expect(assignBarcode(db, guestId)).rejects.toThrow("not a member");
  });

  it("throws for a person that doesn't exist", async () => {
    await expect(assignBarcode(db, "does-not-exist")).rejects.toThrow(
      "does not exist",
    );
  });
});

describe("barcode images", () => {
  it("barcodeSvg returns an SVG with bars and a text path", () => {
    const svg = barcodeSvg("RMS7K2QXP4M");
    expect(svg).toContain("<svg");
    expect(svg).toContain('fill="#000000"');
  });

  it("barcodePng returns a real PNG", async () => {
    const png = await barcodePng("RMS7K2QXP4M");
    // PNG files always start with these 4 bytes
    expect(png.subarray(0, 4).toString("hex")).toBe("89504e47");
  });
});
