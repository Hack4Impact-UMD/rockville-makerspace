import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
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

describe("assignBarcode (needs emulator running)", () => {
  process.env.FIRESTORE_EMULATOR_HOST = "127.0.0.1:8080";

  const memberId = "test-member-barcode";
  const otherMemberId = "test-member-barcode-2";
  const guestId = "test-guest-barcode";

  beforeAll(async () => {
    if (getApps().length === 0) {
      initializeApp({ projectId: "demo-test" });
    }
    const people = getFirestore().collection(COLLECTIONS.people);
    await people.doc(memberId).set({ membership: {} });
    await people.doc(otherMemberId).set({ membership: {} });
    await people.doc(guestId).set({ membership: null });
  });

  afterAll(async () => {
    const people = getFirestore().collection(COLLECTIONS.people);
    await people.doc(memberId).delete();
    await people.doc(otherMemberId).delete();
    await people.doc(guestId).delete();
  });

  it("assigns a valid barcode to a member and saves it", async () => {
    const barcode = await assignBarcode(memberId);
    expect(barcode).toMatch(/^[A-Z0-9]{11}$/);

    const saved = await getFirestore()
      .collection(COLLECTIONS.people)
      .doc(memberId)
      .get();
    expect(saved.data()?.membership.barcode).toBe(barcode);
  });

  it("returns the same barcode if called again", async () => {
    const first = await assignBarcode(memberId);
    const second = await assignBarcode(memberId);
    expect(second).toBe(first);
  });

  it("gives different members different barcodes", async () => {
    const a = await assignBarcode(memberId);
    const b = await assignBarcode(otherMemberId);
    expect(a).not.toBe(b);
  });

  it("throws for a non-member", async () => {
    await expect(assignBarcode(guestId)).rejects.toThrow("not a member");
  });

  it("throws for a person that doesn't exist", async () => {
    await expect(assignBarcode("does-not-exist")).rejects.toThrow(
      "does not exist",
    );
  });
});

describe("barcode images", () => {
  it("barcodeSvg returns an SVG containing the code text", () => {
    const svg = barcodeSvg("RMS7K2QXP4M");
    expect(svg).toContain("<svg");
    expect(svg).toContain("RMS7K2QXP4M");
  });

  it("barcodePng returns a real PNG", async () => {
    const png = await barcodePng("RMS7K2QXP4M");
    // PNG files always start with these 4 bytes
    expect(png.subarray(0, 4).toString("hex")).toBe("89504e47");
  });
});