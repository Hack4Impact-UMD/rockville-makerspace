import { type } from "arktype";
import { address } from "@common/address.ts";

export const personKind = type("'member' | 'non-member'");
export type PersonKind = typeof personKind.infer;

/** Member-only fields. Present if and only if `kind` is "member". */
export const membership = type({
  myturnId: "string",
  // TODO: source TBD -- the MyTurn Customer ID or an RMS-generated value.
  barcode: "string | null",
  membershipType: "string | null",
  /** Validity is checked against the current time at check-in. */
  expiresAt: "number | null",
  memberSince: "number | null",
  // TODO: waiver due date. We need it, but MyTurn's export has no such column yet.
  // waiverDueAt: "number | null",
  /** Owned by RMS, not MyTurn, e.g. "laser-cutter", "cnc", "woodshop". */
  certifications: "string[]",
  syncedAt: "number",
});
export type Membership = typeof membership.infer;

/**
 * Everyone who checks in. Members are synced from MyTurn; non-members are
 * found or created at the kiosk by full name and phone.
 */
export const person = type({
  id: "string",
  kind: personKind,
  firstName: "string >= 1",
  lastName: "string >= 1",
  /** See `nameKey()`. */
  nameKey: "string",
  /** E.164. Required for non-members; MyTurn may leave it blank for members. */
  phone: "string | null",
  email: "string.email | null",
  /** Optional for non-members; from MyTurn for members. */
  address: address.or("null"),

  checkedIn: "boolean",
  /** The open visit, or null when checked out. */
  currentVisitId: "string | null",

  /** References to `labels/{id}`, managed by admins. */
  labelIds: "string[]",
  membership: membership.or("null"),
  createdAt: "number",
  updatedAt: "number",
}).narrow((p, ctx) => {
  if (p.kind === "member" && p.membership === null) {
    return ctx.reject({ path: ["membership"], expected: "set for a member" });
  }
  if (p.kind === "non-member" && p.membership !== null) {
    return ctx.reject({
      path: ["membership"],
      expected: "null for a non-member",
    });
  }
  if (p.kind === "non-member" && p.phone === null) {
    return ctx.reject({ path: ["phone"], expected: "set for a non-member" });
  }
  return true;
});
export type Person = typeof person.infer;

/**
 * Normalizes a full name for matching: accents removed, lowercased, trimmed,
 * and single-spaced. `nameKey("  José   DOE ")` is "jose doe".
 */
export function nameKey(fullName: string): string {
  return fullName
    .normalize("NFD")
    .replaceAll(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim()
    .replaceAll(/\s+/g, " ");
}

/**
 * Deterministic document IDs, so a sync upsert or a kiosk find-or-create can
 * never produce duplicates. Two people who share a phone but not a name get
 * separate records.
 */
export const personId = {
  member: (customerId: string) => `myturn_${customerId}`,
  nonMember: (phone: string, fullName: string) =>
    `nm_${phone}_${nameKey(fullName)
      .replaceAll(" ", "-")
      .replaceAll(/[^a-z0-9-]/g, "")}`,
};
