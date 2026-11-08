import { describe, expect, it } from "vitest";
import { createCaller } from "@backend/routers/index.ts";
import type { Context } from "@backend/trpc/context";
import type { Firestore } from "firebase-admin/firestore";

function caller(session: Context["session"], db: Firestore) {
  return createCaller({ session, db });
}

describe("lookupRouter", () => {
    it("returns an empty array when the normalized search query is too short", async () => {
        let collectionCalled = false;
        const mockCtx = {
            collection: () => {
                collectionCalled = true;
                throw new Error("FAIL: Database collection was called for a short query!");
            },
        
        };

        const testCaller = caller(null, mockCtx as unknown as Firestore);
        const result = await testCaller.lookup.search({ query: "a" });

        expect(result).toEqual([]);
        expect(collectionCalled).toBe(false);
    });

    it("queries Firestore without personType filter when personType is omitted", async () => {
        const recordedCalls: { name: string; args: any[] }[] = [];

        const mockQuery = {
            where(...args: any[]) {
                recordedCalls.push({ name: "where", args });
                return this;
            },
            limit(...args: any[]) {
                recordedCalls.push({ name: "limit", args });
                return this;
            },
            async get() {
                recordedCalls.push({ name: "get", args: [] });
                return { docs: [] };
            },
        };

        const mockCtx = {
            collection(name: string) {
                recordedCalls.push({ name: "collection", args: [name] });
                return mockQuery;
            },
        }

        const testCaller = caller(null, mockCtx as unknown as Firestore);
        const result = await testCaller.lookup.search({ query: "Jane" });

        expect(recordedCalls).toEqual([
            { name: "collection", args: ["people"] },
            { name: "where", args: ["nameKey", ">=", "jane"] },
            { name: "where", args: ["nameKey", "<", "jane\uf8ff"] },
            { name: "limit", args: [10] },
            { name: "get", args: [] },
        ]);

        expect(result).toEqual([]);
    });

    it("queries Firestore and maps results correctly when personType is provided", async () => {
        const recordedCalls: { name: string; args: any[] }[] = [];

        const mockQuery = {
            where(...args: any[]) {
                recordedCalls.push({ name: "where", args });
                return this;
            },
            limit(...args: any[]) {
                recordedCalls.push({ name: "limit", args });
                return this;
            },
            async get() {
                recordedCalls.push({ name: "get", args: [] });
                return {
                docs: [
                    {
                    id: "myturn_1042",
                    data: () => ({
                        personType: "member",
                        firstName: "José",
                        lastName: "Muñoz",
                        phone: "+13015551234",
                    }),
                    },
                ],
                };
            },
        };

        const mockCtx = {
            collection(name: string) {
                recordedCalls.push({ name: "collection", args: [name] });
                return mockQuery;
            },
        };

        const testCaller = caller(null, mockCtx as unknown as Firestore);
        const result = await testCaller.lookup.search({ query: "José", personType: "member" });

        expect(recordedCalls).toEqual([
            { name: "collection", args: ["people"] },
            { name: "where", args: ["nameKey", ">=", "jose"] },
            { name: "where", args: ["nameKey", "<", "jose\uf8ff"] },
            { name: "where", args: ["personType", "==", "member"] },
            { name: "limit", args: [10] },
            { name: "get", args: [] },
        ]);

        expect(result).toEqual([ {
            id: "myturn_1042",
            personType: "member",
            fullName: "José Muñoz",
            phoneLast4: "1234",
        },]);
    });
});