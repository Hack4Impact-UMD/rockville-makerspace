import { getMyTurnConfig } from "@backend/myturn/config.ts";

// TODO: this function assumes one bare array (figure out what API returns and adjust accordingly)
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
