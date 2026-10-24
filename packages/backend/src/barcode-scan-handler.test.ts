import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { COLLECTIONS } from "@repo/common";
import { handleBarcodeScan } from "./barcode-scan-handler.ts";

//Tiny in-memory stand-in for Firestore, only what the handler uses
const { store, fakeDb } = vi.hoisted(() => {
    const store = new Map<string, any>();
    let nextId = 1;

    function makeRef(path: string) {
        return {path: path, id: path.split("/")[1]};
    }

    function makeSnapshot(path: string) {
        const data = store.get(path);
        return {id: path.split("/")[1], ref: makeRef(path), exists: data !== undefined, data: () => data, get: (field: string) => data?.[field]};
    }

    function getByPath(data: any, path: string) {
        return path.split(".").reduce((value, key) => value?.[key], data);
    }

    const fakeDb = {
        collection: (name: string) => ({
            doc: (id?: string) => makeRef(`${name}/${id ?? `auto-${nextId++}`}`),
            where: (field: string, _op: string, value: any) => {
                const query: any = {name: name, field: field, value: value, max: Infinity};
                query.limit = (count: number) => {
                    query.max = count;
                    return query;
                };
                return query;
            },
        }),
        //Writes are saved only if the callback finishes, like a real transaction
        runTransaction: async (callback: any) => {
            const writes: Array<() => void> = [];
            const transaction = {
                get: async (target: any) => {
                    if ("path" in target) return makeSnapshot(target.path);

                    const docs = [...store.keys()]
                        .filter((path) => path.startsWith(`${target.name}/`) && getByPath(store.get(path), target.field) === target.value)
                        .slice(0, target.max)
                        .map((path) => makeSnapshot(path));
                    return {docs: docs, empty: docs.length === 0};
                },
                set: (ref: any, data: any) => {
                    writes.push(() => store.set(ref.path, {...data}));
                },
                update: (ref: any, data: any) => {
                    writes.push(() => store.set(ref.path, {...store.get(ref.path), ...data}));
                },
            };

            const result = await callback(transaction);
            writes.forEach((write) => write());
            return result;
        },
    };

    return {store, fakeDb};
});

vi.mock("firebase-admin/firestore", () => ({getFirestore: () => fakeDb}));

const NOW = 1_700_000_000_000;
const BARCODE = "RMS7K2QXP4M";
const PERSON_PATH = `${COLLECTIONS.people}/p1`;

function addPerson(overrides: any = {}, expiresAt: number | null = null) {
    store.set(PERSON_PATH, {
        id: "p1",
        firstName: "Ada",
        lastName: "Lovelace",
        checkedIn: false,
        currentVisitId: null,
        updatedAt: 0,
        membership: {barcode: BARCODE, expiresAt: expiresAt},
        ...overrides,
    });
}

function getVisits() {
    return [...store.entries()].filter(([path]) => path.startsWith(`${COLLECTIONS.visits}/`));
}

describe("handleBarcodeScan", () => {
    beforeEach(() => {
        store.clear();
        vi.useFakeTimers();
        vi.setSystemTime(NOW);
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("returns unknown-barcode when no member matches", async () => {
        addPerson();

        const response = await handleBarcodeScan({barcode: "NOPE"});

        expect(response).toEqual({result: "unknown-barcode"});
        expect(getVisits()).toHaveLength(0);
    });

    it("checks in a member who is not checked in", async () => {
        addPerson();

        const response = await handleBarcodeScan({barcode: BARCODE});

        expect(response).toEqual({result: "checked-in", firstName: "Ada", lastName: "Lovelace", membershipActive: true, checkedInAt: NOW, durationMs: null});

        const visits = getVisits();
        expect(visits).toHaveLength(1);

        const [visitPath, visit] = visits[0]!;
        expect(visit).toEqual({personId: "p1", visitTypeId: null, checkedInAt: NOW, checkedOutAt: null, durationMs: null});
        expect(store.get(PERSON_PATH)).toMatchObject({checkedIn: true, currentVisitId: visitPath.split("/")[1], updatedAt: NOW});
    });

    it("cleans up the scanned barcode before looking it up", async () => {
        addPerson();

        const response = await handleBarcodeScan({barcode: `  ${BARCODE.toLowerCase()} `});

        expect(response.result).toBe("checked-in");
    });

    it("saves the visitTypeId when one is given", async () => {
        addPerson();

        await handleBarcodeScan({barcode: BARCODE, visitTypeId: "open-hours"});

        expect(getVisits()[0]![1].visitTypeId).toBe("open-hours");
    });

    it("checks out a member and records the duration", async () => {
        const FIVE_MINUTES = 5 * 60 * 1000;
        store.set(`${COLLECTIONS.visits}/v1`, {personId: "p1", visitTypeId: null, checkedInAt: NOW - FIVE_MINUTES, checkedOutAt: null, durationMs: null});
        addPerson({checkedIn: true, currentVisitId: "v1"});

        const response = await handleBarcodeScan({barcode: BARCODE});

        expect(response).toEqual({result: "checked-out", firstName: "Ada", lastName: "Lovelace", membershipActive: true, checkedInAt: NOW - FIVE_MINUTES, durationMs: FIVE_MINUTES});
        expect(store.get(`${COLLECTIONS.visits}/v1`)).toMatchObject({checkedOutAt: NOW, durationMs: FIVE_MINUTES});
        expect(store.get(PERSON_PATH)).toMatchObject({checkedIn: false, currentVisitId: null, updatedAt: NOW});
    });

    it("scanning twice checks in then out using a single visit", async () => {
        addPerson();

        const first = await handleBarcodeScan({barcode: BARCODE});
        const second = await handleBarcodeScan({barcode: BARCODE});

        expect(first.result).toBe("checked-in");
        expect(second.result).toBe("checked-out");
        expect(getVisits()).toHaveLength(1);
    });

    it("treats a membership with no expiration as active", async () => {
        addPerson({}, null);

        const response = await handleBarcodeScan({barcode: BARCODE});

        expect(response).toMatchObject({membershipActive: true});
    });

    it("treats a membership that expires in the future as active", async () => {
        addPerson({}, NOW + 1000);

        const response = await handleBarcodeScan({barcode: BARCODE});

        expect(response).toMatchObject({membershipActive: true});
    });

    it("marks an expired membership inactive but still checks in", async () => {
        addPerson({}, NOW - 1000);

        const response = await handleBarcodeScan({barcode: BARCODE});

        expect(response).toMatchObject({result: "checked-in", membershipActive: false});
        expect(getVisits()).toHaveLength(1);
    });

    it("throws when checked in but there is no currentVisitId", async () => {
        addPerson({checkedIn: true, currentVisitId: null});

        await expect(handleBarcodeScan({barcode: BARCODE})).rejects.toThrow("no currentVisitId");
    });

    it("throws and changes nothing when the open visit does not exist", async () => {
        addPerson({checkedIn: true, currentVisitId: "missing"});

        await expect(handleBarcodeScan({barcode: BARCODE})).rejects.toThrow("does not exist");
        expect(store.get(PERSON_PATH)).toMatchObject({checkedIn: true, currentVisitId: "missing"});
    });
});