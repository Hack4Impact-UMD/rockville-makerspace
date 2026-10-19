import { type } from "arktype";
import { personKind } from "@common/person.ts";

/**
 * One check-in, kept permanently. All reporting (visitors and hours for any
 * day, month, or year, by purpose) is a `checkedInAt` range query over these.
 *
 * TODO: overlapping visits (e.g. Member Hours, then an Event). For now, a
 * second check-in while checked in counts as a checkout.
 */
export const visit = type({
  id: "string",
  personId: "string",
  /** Snapshot at check-in, since a non-member may later become a member. */
  personKind,
  visitTypeId: "string",
  /** "search" is name and phone entry: every non-member, and members without their card. */
  checkInMethod: "'barcode' | 'search'",
  checkedInAt: "number",
  // TODO: auto-checkout for people who forget to check out. We haven't decided
  // when to close their visit, or how many hours to credit it with.
  /** Null while the visit is open. */
  checkedOutAt: "number | null",
  /** Set at checkout. */
  durationMs: "number | null",
  endReason: "'checkout' | 'auto-expired' | 'admin' | null",
  /** e.g. "mod-without-clearance", "waiver-missing". */
  flags: "string[]",
  updatedAt: "number",
  /** Admin who last edited or overrode this visit. */
  updatedBy: "string | null",
});
export type Visit = typeof visit.infer;
