/** The bearer key the mock MyTurn endpoint expects. Not a secret. */
export const MOCK_MYTURN_API_KEY = "mock-myturn-key";

/**
 * Where the mock is served in the emulator. Matches the project, region, and
 * port used by `e2e/emulator.ts`; the second `api` is the Express prefix.
 */
const MOCK_MYTURN_BASE_URL =
  "http://127.0.0.1:5001/demo-vtf-template/us-central1/api/api/mock/myturn";

export type MyTurnConfig = { baseUrl: string; apiKey: string };

/**
 * The emulator always talks to the mock. Elsewhere the real MyTurn base URL
 * and key come from the environment.
 *
 * TODO: move the key to `defineSecret` once we have real API access.
 */
export function getMyTurnConfig(): MyTurnConfig {
  if (process.env.FUNCTIONS_EMULATOR === "true") {
    return { baseUrl: MOCK_MYTURN_BASE_URL, apiKey: MOCK_MYTURN_API_KEY };
  }

  const baseUrl = process.env.MYTURN_BASE_URL;
  const apiKey = process.env.MYTURN_API_KEY;
  if (!baseUrl || !apiKey) {
    throw new Error(
      "MyTurn is not configured: set MYTURN_BASE_URL and MYTURN_API_KEY.",
    );
  }
  return { baseUrl, apiKey };
}
