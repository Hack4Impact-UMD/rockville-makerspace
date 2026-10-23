import { getMyTurnConfig } from "@backend/myturn/config.ts";

// TODO: this assumes the API returns every member as one bare JSON array. The
// real MyTurn API may paginate, wrap the array in an object, or export CSV.
export async function fetchMyTurn(): Promise<unknown[]> {
  const config = getMyTurnConfig();
  const url = `${config.baseUrl}/members`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
    },
  });

  if (response.status !== 200) {
    throw new Error(`error: ${response.status} status returned, expected 200`);
  }

  const body = await response.json();
  if (!Array.isArray(body)) {
    throw new Error(`error: response was not an array`);
  }

  return body;
}
