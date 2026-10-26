import { describe, expect, it } from "vitest";
import { normalizeBarcode } from "@common/barcode.ts";

describe("normalizeBarcode", () => {
  it("trims spaces and uppercases the barcode", () => {
    expect(normalizeBarcode("  rms7k2qxp4m  ")).toBe("RMS7K2QXP4M");
  });

  it("returns an already normalized barcode unchanged", () => {
    expect(normalizeBarcode("RMS7K2QXP4M")).toBe("RMS7K2QXP4M");
  });

  it("trims tabs and newlines", () => {
    expect(normalizeBarcode("\t rms7k2qxp4m\n")).toBe("RMS7K2QXP4M");
  });
});