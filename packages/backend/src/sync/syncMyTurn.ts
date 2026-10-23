import { myTurnMember, person, COLLECTIONS } from "@repo/common";
import { type } from "arktype";
import type { Firestore } from "firebase-admin/firestore";
import { getFirestore } from "firebase-admin/firestore";
import { logger } from "firebase-functions";
import { fetchMyTurn } from "@backend/sync/fetchMyTurn.ts";
import { mapMyTurnMember } from "@backend/sync/mapMyTurnMembers.ts";

export type SyncResult = { created: number; updated: number; skipped: number };

export async function syncRows(
  db: Firestore,
  rows: unknown[],
  now: number,
): Promise<SyncResult> {
  let created = 0;
  let updated = 0;
  let skipped = 0;
  // TODO: batch can hold at most 500 writes, whenever real data is handled we need to split it into chunks
  const batch = db.batch();
  for (const raw of rows) {
    const member = myTurnMember(raw);
    if (member instanceof type.errors) {
      logger.warn(`Skipping invalid MyTurn row: ${member.summary}`);
      skipped++;
      continue;
    }

    const mapped = mapMyTurnMember(member, now);
    const fullPerson = {
      ...mapped,
      checkedIn: false,
      currentVisitId: null,
      labelIds: [],
      createdAt: now,
      membership: { ...mapped.membership, barcode: null, certifications: [] },
    };
    const checkedPerson = person(fullPerson);
    if (checkedPerson instanceof type.errors) {
      logger.warn(`Skipping ${mapped.id}: ${checkedPerson.summary}`);
      skipped++;
      continue;
    }

    const ref = db.collection(COLLECTIONS.people).doc(mapped.id);
    const snapshot = await ref.get();
    if (snapshot.exists) {
      batch.set(ref, mapped, { merge: true });
      updated++;
    } else {
      batch.set(ref, checkedPerson);
      created++;
    }
  }

  await batch.commit();

  return { created, updated, skipped };
}

/** One full sync: fetch every member from MyTurn and upsert them into `people`. */
export async function syncMyTurn(): Promise<SyncResult> {
  const rows = await fetchMyTurn();
  const result = await syncRows(getFirestore(), rows, Date.now());
  logger.info("MyTurn sync finished", result);
  return result;
}
