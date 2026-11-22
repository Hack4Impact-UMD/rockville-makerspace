import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Firestore } from "firebase-admin/firestore";
import { assignBarcode, barcodeSvg } from "@backend/barcode.ts";
import { createCaller } from "@backend/routers/index.ts";
import type { Context } from "@backend/trpc/context.ts";

vi.mock("@backend/barcode.ts", () => ({
  assignBarcode: vi.fn<() => Promise<string>>(() =>
    Promise.resolve("ABC123XYZ90"),
  ),
  barcodeSvg: vi.fn<(code: string) => string>((code) => `<svg>${code}</svg>`),
}));

const session: Context["session"] = {
  uid: "admin-uid",
  email: "admin@example.com",
  emailVerified: true,
};

function caller(session: Context["session"], db: Firestore) {
  return createCaller({ session, db });
}

describe("adminRouter.barcode", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejects callers who are not signed in", async () => {
    const mockDb = {
      collection: () => {
        throw new Error("Firestore should not be queried!");
      },
    };

    const testCaller = caller(null, mockDb as unknown as Firestore);

    await expect(
      testCaller.admin.barcode({ personId: "myturn_1042" }),
    ).rejects.toMatchObject({ code: "UNAUTHORIZED" });
    expect(assignBarcode).not.toHaveBeenCalled();
  });

  it("returns the member's barcode label", async () => {
    const recordedCalls: { name: string; args: unknown[] }[] = [];

    const mockDb = {
      collection(name: string) {
        recordedCalls.push({ name: "collection", args: [name] });
        return {
          doc(id: string) {
            recordedCalls.push({ name: "doc", args: [id] });
            return {
              get: () =>
                Promise.resolve({
                  data: () => ({ firstName: "Jane", lastName: "Doe" }),
                }),
            };
          },
        };
      },
    };

    const testCaller = caller(session, mockDb as unknown as Firestore);
    const result = await testCaller.admin.barcode({ personId: "myturn_1042" });

    expect(assignBarcode).toHaveBeenCalledWith(mockDb, "myturn_1042");
    expect(barcodeSvg).toHaveBeenCalledWith("ABC123XYZ90");
    expect(recordedCalls).toEqual([
      { name: "collection", args: ["people"] },
      { name: "doc", args: ["myturn_1042"] },
    ]);
    expect(result).toEqual({
      code: "ABC123XYZ90",
      svg: "<svg>ABC123XYZ90</svg>",
      firstName: "Jane",
      lastName: "Doe",
    });
  });
});
