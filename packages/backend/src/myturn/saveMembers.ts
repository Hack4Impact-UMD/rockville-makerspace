import { type } from "arktype";
import type { Firestore } from "firebase-admin/firestore";
import { COLLECTIONS, person, personId } from "@repo/common";
import type { Person } from "@repo/common";
import type { ImportedMember } from "@backend/myturn/parseCsv.ts";

export type SaveResult = { created: number; updated: number };

// firestore allows at most 500 writes in one batch (and keeps reads small too)
const CHUNK_SIZE = 500;

// builds the full record for a member we haven't seen before. fields MyTurn
// doesn't give us get their starting values.
export function newMemberRecord(member: ImportedMember, now: number): Person {
  const record = {
    id: personId.member(member.customerId),
    personType: "member",
    firstName: member.firstName,
    lastName: member.lastName,
    nameKey: member.nameKey,
    phone: member.phone,
    email: member.email,
    address: member.address,
    checkedIn: false,
    currentVisitId: null,
    labelIds: [],
    membership: {
      myturnId: member.customerId,
      barcode: null,
      membershipType: null,
      // TODO: fill in from MyTurn once the export has an expiration date.
      // null is treated as active for now.
      expiresAt: null,
      memberSince: null,
      certifications: [],
      syncedAt: now,
    },
    createdAt: now,
    updatedAt: now,
  } satisfies Person;

  // catches mistakes in this file before they reach the database
  const result = person(record);
  if (result instanceof type.errors) {
    throw new Error(
      `Built an invalid record for MyTurn customer ${member.customerId}: ${result.summary}`,
    );
  }
  return result;
}

// only the fields that come from MyTurn. app-owned fields like checkedIn,
// labelIds, and certifications are left alone.
export function memberUpdate(member: ImportedMember, now: number) {
  return {
    firstName: member.firstName,
    lastName: member.lastName,
    nameKey: member.nameKey,
    phone: member.phone,
    email: member.email,
    address: member.address,
    "membership.myturnId": member.customerId,
    "membership.syncedAt": now,
    updatedAt: now,
  };
}

// creates members that don't exist yet and updates the ones that do. the
// parser already removed duplicate customer ids, so each id appears once.
export async function saveImportedMembers(
  db: Firestore,
  members: ImportedMember[],
  now: number,
): Promise<SaveResult> {
  const people = db.collection(COLLECTIONS.people);
  let created = 0;
  let updated = 0;

  for (let start = 0; start < members.length; start += CHUNK_SIZE) {
    const chunk = members.slice(start, start + CHUNK_SIZE);
    const refs = chunk.map((m) => people.doc(personId.member(m.customerId)));
    const snapshots = await db.getAll(...refs);

    const existing = new Set(
      snapshots.filter((s) => s.exists).map((s) => s.ref.path),
    );

    const batch = db.batch();
    for (const member of chunk) {
      const ref = people.doc(personId.member(member.customerId));
      if (existing.has(ref.path)) {
        batch.update(ref, memberUpdate(member, now));
        updated++;
      } else {
        batch.set(ref, newMemberRecord(member, now));
        created++;
      }
    }
    await batch.commit();
  }

  return { created, updated };
}
