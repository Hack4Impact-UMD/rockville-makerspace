import { type } from "arktype";
import { personType } from "@common/person.ts";

/** Kiosk type-ahead input. Omit `personType` to search members and non-members. */
export const personSearchInput = type({
  /** At least 2 characters, so a single letter can't list everyone. */
  query: "2 <= string <= 50",
  "personType?": personType,
});
export type PersonSearchInput = typeof personSearchInput.infer;

/**
 * One type-ahead match. The kiosk is public, so only the last 4 digits of the
 * phone are returned -- never the full number, email, or address.
 */
export const personSearchResult = type({
  id: "string",
  personType,
  fullName: "string",
  phoneLast4: "string | null",
});
export type PersonSearchResult = typeof personSearchResult.infer;

/** "+13015551234" is "1234". Null when there is no phone. */
export function phoneLast4(phone: string | null): string | null {
  if (phone === null) return null;
  const digits = phone.replaceAll(/\D/g, "");
  return digits.length >= 4 ? digits.slice(-4) : null;
}
