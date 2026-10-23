
// akhila TODO: address is null, api times out, other edge cases, testing
// also i think the api might return multiple addressmatches so we probably have to check
// all of them. they should all match each other if there are multiple

const GEOCODER_URL = "https://geocoding.geo.census.gov/geocoder/geographies/onelineaddress";

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

  const url = new URL(GEOCODER_URL);
  url.searchParams.set("address", address);
  url.searchParams.set("benchmark", "Public_AR_Current");
  url.searchParams.set("vintage", "Current_Current");
  url.searchParams.set("format", "json");

  try {
    const res = await fetch(url);
    const data = (await res.json()) as GeocoderResponse;
    const match = data.result.addressMatches[0];

    if (!match) {
      return null
    }

    const places = match.geographies["Incorporated Places"];

    return places?.some(
      (place) => place.BASENAME === "Rockville"
    ) ?? false;

  } catch {
    return null
  }
}