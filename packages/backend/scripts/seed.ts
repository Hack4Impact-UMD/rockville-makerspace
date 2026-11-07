import { COLLECTIONS } from "@repo/common";
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { fakePeople } from "@backend/dev/fakePeople.ts";

if (!process.env.FIRESTORE_EMULATOR_HOST) {
  throw new Error("Refusing to seed: FIRESTORE_EMULATOR_HOST is not set.");
}

initializeApp({ projectId: "demo-vtf-template" });

const db = getFirestore();
const people = fakePeople(Date.now());
const batch = db.batch();

for (const person of people) {
  batch.set(db.collection(COLLECTIONS.people).doc(person.id), person);
}
await batch.commit();

console.log(`Seeded ${people.length} people.`);
