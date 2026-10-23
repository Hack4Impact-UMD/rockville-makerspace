import { COLLECTIONS } from "@repo/common";
import { Router } from "express";
import { getFirestore } from "firebase-admin/firestore";
import { fakePeople } from "@backend/dev/fakePeople.ts";
import { syncMyTurn } from "@backend/sync/syncMyTurn.ts";

/**
 * Emulator-only helpers. Mounted by `createApp` only in the emulator, so they
 * never run in production.
 */
export const devRouter = Router();

/** Writes fake people to `people`. Safe to repeat: the IDs are deterministic. */
devRouter.post("/seed", async (_req, res) => {
  const db = getFirestore();
  const people = fakePeople(Date.now());
  const batch = db.batch();

  for (const person of people) {
    batch.set(db.collection(COLLECTIONS.people).doc(person.id), person);
  }
  await batch.commit();

  res.json({ written: people.length });
});

/** Runs one MyTurn sync against the mock, without waiting for the schedule. */
devRouter.post("/sync-myturn", async (_req, res) => {
  res.json(await syncMyTurn());
});
