import { type } from "arktype";

/**
 * A complete residential address, used for grant reporting. Shared by members
 * (from MyTurn) and non-members (optional at the kiosk). Partial addresses are
 * rejected; store `null` instead.
 */
export const address = type({
  street: "string >= 1",
  unit: "string | null",
  city: "string >= 1",
  state: "string == 2",
  zip: /^\d{5}(-\d{4})?$/,
});
export type Address = typeof address.infer;
