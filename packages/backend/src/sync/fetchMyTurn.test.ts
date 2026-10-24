import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fetchMyTurn } from "@backend/sync/fetchMyTurn.ts";

describe("fetchMyTurn", () => {
  beforeEach(() => {
    // make getMyTurnConfig() return the mock url, like it does inside the emulator
    vi.stubEnv("FUNCTIONS_EMULATOR", "true");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  // each test replaces fetch with a fake response, so none need the emulator
  it("requests /members with the bearer key and returns the rows", async () => {
    const fetchSpy = vi
      .fn<typeof fetch>()
      .mockResolvedValue(Response.json([{ "Customer ID": "1" }]));
    vi.stubGlobal("fetch", fetchSpy);

    const rows = await fetchMyTurn();

    expect(rows).toEqual([{ "Customer ID": "1" }]);
    expect(fetchSpy).toHaveBeenCalledWith(expect.stringMatching(/\/members$/), {
      headers: { Authorization: "Bearer mock-myturn-key" },
    });
  });

  it("throws when MyTurn does not return 200", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn<typeof fetch>()
        .mockResolvedValue(new Response("unavailable", { status: 503 })),
    );

    await expect(fetchMyTurn()).rejects.toThrow("503");
  });

  it("throws when the body is not an array", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn<typeof fetch>().mockResolvedValue(Response.json({ members: [] })),
    );

    await expect(fetchMyTurn()).rejects.toThrow("not an array");
  });
});
