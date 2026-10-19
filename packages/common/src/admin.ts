import { type } from "arktype";

/**
 * An allowlist entry for the admin view, stored at `admins/{email}`. Admins
 * sign in with Google and never check in as admins, so they live apart from
 * `people`; the same human may also be a member with a `people` record.
 */
export const adminUser = type({
  /** Lowercased; also the document ID. */
  email: "string.email",
  name: "string",
  addedAt: "number",
  addedBy: "string | null",
});
export type AdminUser = typeof adminUser.infer;
