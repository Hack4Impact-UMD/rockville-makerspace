import { describe, expect, it } from "vitest";
import { generateBarcode } from "./barcode.ts";

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