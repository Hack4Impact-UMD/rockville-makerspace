import { afterEach, describe, expect, it, vi } from "vitest";
import { isRockvilleResident } from "@backend/lib/geocode.ts";

const ROCKVILLE = { BASENAME: "Rockville", GEOID: "2467675" };
const GAITHERSBURG = { BASENAME: "Gaithersburg", GEOID: "2431175" };
// same name, different state (Rockville, IN)
const ROCKVILLE_IN = { BASENAME: "Rockville", GEOID: "1865484" };

/** Stubs `fetch` with a geocoder response; each match is a list of places. */
function mockResponse(matches: object[][], status = 200) {
  return vi.spyOn(globalThis, "fetch").mockResolvedValue(
    new Response(
      JSON.stringify({
        result: {
          addressMatches: matches.map((places) => ({
            geographies: { "Incorporated Places": places },
          })),
        },
      }),
      { status },
    ),
  );
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("isRockvilleResident", () => {
  it("returns true for an address in Rockville", async () => {
    mockResponse([[ROCKVILLE]]);
    await expect(isRockvilleResident("111 Maryland Ave")).resolves.toBe(true);
  });

  it("returns false for an address in a different city", async () => {
    mockResponse([[GAITHERSBURG]]);
    await expect(isRockvilleResident("31 S Summit Ave")).resolves.toBe(false);
  });

  it("returns false for an unincorporated address", async () => {
    mockResponse([[]]);
    await expect(isRockvilleResident("4301 Jones Bridge Rd")).resolves.toBe(
      false,
    );
  });

  it("returns false for a Rockville in another state", async () => {
    mockResponse([[ROCKVILLE_IN]]);
    await expect(isRockvilleResident("1 Main St, Rockville, IN")).resolves.toBe(
      false,
    );
  });

  it("returns null when there are no matches", async () => {
    mockResponse([]);
    await expect(isRockvilleResident("asdfghjkl")).resolves.toBeNull();
  });

  it("returns null for an empty address without calling the API", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    await expect(isRockvilleResident("")).resolves.toBeNull();
    await expect(isRockvilleResident("   ")).resolves.toBeNull();
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("sends the trimmed address with a timeout signal", async () => {
    const fetchSpy = mockResponse([[ROCKVILLE]]);
    await isRockvilleResident("  111 Maryland Ave  ");

    expect(fetchSpy).toHaveBeenCalledOnce();
    const [url, init] = fetchSpy.mock.calls[0] ?? [];
    expect(new URL(url as URL).searchParams.get("address")).toBe(
      "111 Maryland Ave",
    );
    expect(init?.signal).toBeInstanceOf(AbortSignal);
  });

  it("returns null when the API responds with an error status", async () => {
    mockResponse([[ROCKVILLE]], 500);
    await expect(isRockvilleResident("111 Maryland Ave")).resolves.toBeNull();
  });

  it("returns null on a network error", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(
      new TypeError("fetch failed"),
    );
    await expect(isRockvilleResident("111 Maryland Ave")).resolves.toBeNull();
  });

  it("returns null when the request times out", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(
      new DOMException("The operation timed out.", "TimeoutError"),
    );
    await expect(isRockvilleResident("111 Maryland Ave")).resolves.toBeNull();
  });

  it("returns the shared answer when multiple matches agree", async () => {
    mockResponse([[ROCKVILLE], [ROCKVILLE]]);
    await expect(isRockvilleResident("111 Maryland Ave")).resolves.toBe(true);
  });

  it("returns null when multiple matches disagree", async () => {
    mockResponse([[ROCKVILLE], [GAITHERSBURG]]);
    await expect(isRockvilleResident("1 Ambiguous St")).resolves.toBeNull();
  });
});
