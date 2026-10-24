import type { Server } from "node:http";
import express from "express";
import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import { MOCK_MYTURN_API_KEY } from "@backend/myturn/config.ts";
import { fetchMyTurn } from "@backend/sync/fetchMyTurn.ts";
import { mockMyTurnRouter } from "@backend/myturn/mockRoute.ts";

let server: Server;
let baseUrl: string;
const headers = { Authorization: `Bearer ${MOCK_MYTURN_API_KEY}` };

beforeAll(async () => {
  const app = express();
  app.use("/myturn", mockMyTurnRouter);
  server = await new Promise<Server>((resolve) => {
    const listening = app.listen(0, "127.0.0.1", () => resolve(listening));
  });
  const address = server.address();
  if (address === null || typeof address === "string") {
    throw new Error("Expected a TCP test server");
  }
  baseUrl = `http://127.0.0.1:${address.port}/myturn`;
});

afterAll(async () => {
  await new Promise<void>((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("MyTurn mock endpoint over HTTP", () => {
  it("returns member rows with the correct key", async () => {
    const response = await fetch(`${baseUrl}/members`, { headers });
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ "Customer ID": "9001" }),
      ]),
    );
  });

  it("returns 503 for ?fail=1", async () => {
    const response = await fetch(`${baseUrl}/members?fail=1`, { headers });
    expect(response.status).toBe(503);
  });

  it("fetchMyTurn reads the real HTTP mock using configured credentials", async () => {
    vi.stubEnv("FUNCTIONS_EMULATOR", "false");
    vi.stubEnv("MYTURN_BASE_URL", baseUrl);
    vi.stubEnv("MYTURN_API_KEY", MOCK_MYTURN_API_KEY);
    expect(await fetchMyTurn()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ "Customer ID": "9001" }),
      ]),
    );
  });

  it("fetchMyTurn propagates the mock's ?fail=1 response", async () => {
    vi.stubEnv("FUNCTIONS_EMULATOR", "false");
    vi.stubEnv("MYTURN_BASE_URL", baseUrl);
    vi.stubEnv("MYTURN_API_KEY", MOCK_MYTURN_API_KEY);
    const realFetch = globalThis.fetch;
    vi.stubGlobal("fetch", (url: string, options: RequestInit) =>
      realFetch(`${url}?fail=1`, options),
    );
    await expect(fetchMyTurn()).rejects.toThrow("503");
  });

  it("rejects a missing key", async () => {
    const response = await fetch(`${baseUrl}/members`);
    expect(response.status).toBe(401);
  });
});
