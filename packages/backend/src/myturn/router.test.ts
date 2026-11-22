import { beforeEach, describe, expect, it } from "vitest";
import { COLLECTIONS } from "@repo/common";
import { createCaller } from "@backend/routers/index.ts";
import { fakeFirestore } from "@backend/myturn/fakeFirestore.ts";

const signedInSession = {
  uid: "admin-1",
  email: "admin@example.com",
  emailVerified: true,
};

let { db, store } = fakeFirestore();

beforeEach(() => {
  ({ db, store } = fakeFirestore());
});

const csv = [
  "customerID,firstName,lastName,email,phone,Address,City,State,postal code,Country",
  "1042,Ana,Diaz,ana@example.com,301-555-1234,1 Main St,Rockville,md,20850,USA",
  "1043,Ben,Lee,not-an-email,,,,,,USA",
  "1044,Cy,Ng,,,,,,,",
].join("\n");

describe("myturn.importCsv", () => {
  it("rejects a signed-out caller", async () => {
    const anonymous = createCaller({ session: null, db });

    await expect(anonymous.myturn.importCsv({ csv })).rejects.toMatchObject({
      code: "UNAUTHORIZED",
    });
    expect(store.size).toBe(0);
  });

  it("saves valid rows and reports created, updated, and skipped", async () => {
    const caller = createCaller({ session: signedInSession, db });

    const first = await caller.myturn.importCsv({ csv });
    expect(first).toEqual({
      created: 2,
      updated: 0,
      skipped: [
        { row: 3, customerId: "1043", reason: 'invalid email "not-an-email"' },
      ],
    });
    expect(store.get(`${COLLECTIONS.people}/myturn_1042`)).toMatchObject({
      firstName: "Ana",
      phone: "+13015551234",
      address: { state: "MD", zip: "20850" },
    });

    const second = await caller.myturn.importCsv({ csv });
    expect(second).toMatchObject({ created: 0, updated: 2 });
  });

  it("returns BAD_REQUEST naming a missing required column", async () => {
    const caller = createCaller({ session: signedInSession, db });

    await expect(
      caller.myturn.importCsv({ csv: "firstName,lastName\nAna,Diaz" }),
    ).rejects.toMatchObject({
      code: "BAD_REQUEST",
      message: expect.stringContaining("Customer ID"),
    });
  });

  it("rejects an empty file", async () => {
    const caller = createCaller({ session: signedInSession, db });

    await expect(caller.myturn.importCsv({ csv: "" })).rejects.toMatchObject({
      code: "BAD_REQUEST",
    });
  });
});
