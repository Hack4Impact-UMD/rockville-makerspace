
// akhila TODO: address is null, api times out, other edge cases, testing
// also i think the api might return multiple addressmatches so we probably have to check
// all of them. they should all match each other if there are multiple

const GEOCODER_URL = "https://geocoding.geo.census.gov/geocoder/geographies/onelineaddress";
const TIMEOUT_MS = 5000;

interface GeocoderResponse {
  result: {
    addressMatches: {
      geographies: {
        "Incorporated Places"?: {
          BASENAME: string;
        }[];
      };
    }[];
  };
}

/*
Checks whether a user’s address is inside Rockville city limits, 
using the US Census Geocoder API.
This uses the city limits, not mailing city or ZIP code

The API takes in the address, benchmark, vintage, and format
- benchmark: specifies which version of the Census address database to use
  we want to use Public Address Ranges
- vintage: specifies which version of the geographic boundaries to use
  we want to use Current_Current to get the most up-to-date geographic boundaries
- format: we want JSON
*/

export const isRockvilleResident = async (address: string): Promise<boolean | null> => {
  const trimmed = address.trim();

  if (!trimmed) {
    return null;
  }

  const url = new URL(GEOCODER_URL);
  url.searchParams.set("address", trimmed);
  url.searchParams.set("benchmark", "Public_AR_Current");
  url.searchParams.set("vintage", "Current_Current");
  url.searchParams.set("format", "json");

  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS) });

    if (!res.ok) {
      return null;
    }

    const data = (await res.json()) as GeocoderResponse;
    const matches = data.result.addressMatches;

    if (matches.length === 0) {
      return null
    }

    // the API can return multiple matches for one address. if they disagree
    // on whether the address is in Rockville, the result is ambiguous
    const results = matches.map((match) => {
      const places = match.geographies["Incorporated Places"];

      return places?.some(
        (place) => place.BASENAME === "Rockville"
      ) ?? false;
    });

    if (results.some((result) => result !== results[0])) {
      return null;
    }

    return results[0] ?? null;

  } catch {
    return null
  }
}