import type {
  DocumentReference,
  Firestore,
  Transaction,
} from "firebase-admin/firestore";
import { COLLECTIONS, visit } from "@repo/common";
import type { Person, ScanInput } from "@repo/common";

//First entry of DEFAULT_VISIT_TYPES in catalog.ts
const DEFAULT_VISIT_TYPE_ID = "member-hours";

//Check if membership is active (never blocks check in)
function isMembershipActive(person: Person, now: number) {
  const expiresAt = person.membership?.expiresAt ?? null;

  return expiresAt === null || expiresAt > now;
}

//Create a visit and check the person in
function checkIn(
  db: Firestore,
  transaction: Transaction,
  personRef: DocumentReference,
  person: Person,
  visitTypeId: string,
  membershipActive: boolean,
  now: number,
) {
  const visitRef = db.collection(COLLECTIONS.visits).doc(); //new visit id

  //Throws right away if the visit doesn't match the schema
  const newVisit = visit.assert({
    id: visitRef.id,
    personId: person.id,
    personType: person.personType,
    visitTypeId: visitTypeId,
    checkInMethod: "barcode",
    checkedInAt: now,
    checkedOutAt: null,
    durationMs: null,
    endReason: null,
    flags: [],
    updatedAt: now,
    updatedBy: null,
  });

  transaction.set(visitRef, newVisit);

  transaction.update(personRef, {
    checkedIn: true,
    currentVisitId: visitRef.id,
    updatedAt: now,
  });

  return {
    result: "checked-in" as const,
    firstName: person.firstName,
    lastName: person.lastName,
    membershipActive: membershipActive,
    checkedInAt: now,
    durationMs: null,
  };
}

//Close the open visit and check the person out
async function checkOut(
  db: Firestore,
  transaction: Transaction,
  personRef: DocumentReference,
  person: Person,
  membershipActive: boolean,
  now: number,
) {
  if (!person.currentVisitId)
    throw new Error(
      `Person ${person.id} is checked in but has no currentVisitId`,
    );

  //Read the visit before any writes
  const visitRef = db.collection(COLLECTIONS.visits).doc(person.currentVisitId);
  const visitData = await transaction.get(visitRef);

  if (!visitData.exists)
    throw new Error(`Visit ${person.currentVisitId} does not exist`);

  const checkedInAt = visitData.get("checkedInAt") as number;
  const durationMs = now - checkedInAt;

  transaction.update(visitRef, {
    checkedOutAt: now,
    durationMs: durationMs,
    endReason: "checkout",
    updatedAt: now,
  });

  transaction.update(personRef, {
    checkedIn: false,
    currentVisitId: null,
    updatedAt: now,
  });

  return {
    result: "checked-out" as const,
    firstName: person.firstName,
    lastName: person.lastName,
    membershipActive: membershipActive,
    checkedInAt: checkedInAt,
    durationMs: durationMs,
  };
}

export function handleBarcodeScan(db: Firestore, input: ScanInput) {
  const barcode = input.barcode.trim().toUpperCase(); //TODO: swap for normalizeBarcode() once barcode generation merges

  return db.runTransaction(async (transaction) => {
    //Find the member with this barcode
    const personQuery = db
      .collection(COLLECTIONS.people)
      .where("membership.barcode", "==", barcode)
      .limit(1);

    const matches = await transaction.get(personQuery);
    const personDoc = matches.docs[0];

    if (!personDoc) return { result: "unknown-barcode" as const };

    const personRef = personDoc.ref;
    const person = personDoc.data() as Person;
    const now = Date.now();
    const membershipActive = isMembershipActive(person, now);

    //Check if they are not checked in yet
    if (!person.checkedIn)
      return checkIn(
        db,
        transaction,
        personRef,
        person,
        input.visitTypeId ?? DEFAULT_VISIT_TYPE_ID,
        membershipActive,
        now,
      );

    return checkOut(db, transaction, personRef, person, membershipActive, now);
  });
}
