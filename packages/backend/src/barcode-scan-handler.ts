import { getFirestore } from "firebase-admin/firestore";
import type { DocumentReference, Transaction } from "firebase-admin/firestore";
import { COLLECTIONS } from "@repo/common";
import type { Person } from "@repo/common";

type ScanInput = { barcode: string; visitTypeId?: string };

//Check if membership is active (never blocks check in)
function isMembershipActive(person: Person, now: number) {
    let expiresAt = person.membership?.expiresAt ?? null;

    return expiresAt === null || expiresAt > now;
}

//Create a visit and check the person in
function checkIn(transaction: Transaction, personRef: DocumentReference, person: Person, visitTypeId: string | null, membershipActive: boolean, now: number) {
    const visitRef = getFirestore().collection(COLLECTIONS.visits).doc(); //new visit id

    transaction.set(visitRef, {personId: person.id, visitTypeId: visitTypeId, checkedInAt: now, checkedOutAt: null, durationMs: null});

    transaction.update(personRef, {checkedIn: true, currentVisitId: visitRef.id, updatedAt: now});

    return {result: "checked-in" as const, firstName: person.firstName, lastName: person.lastName, membershipActive: membershipActive, checkedInAt: now, durationMs: null};
}

//Close the open visit and check the person out
async function checkOut(transaction: Transaction, personRef: DocumentReference, person: Person, membershipActive: boolean, now: number) {
    if (!person.currentVisitId) throw new Error(`Person ${person.id} is checked in but has no currentVisitId`);

    //Read the visit before any writes
    const visitRef = getFirestore().collection(COLLECTIONS.visits).doc(person.currentVisitId);
    const visitData = await transaction.get(visitRef);

    if (!visitData.exists) throw new Error(`Visit ${person.currentVisitId} does not exist`);

    let checkedInAt = visitData.get("checkedInAt") as number;
    let durationMs = now - checkedInAt;

    transaction.update(visitRef, {checkedOutAt: now, durationMs: durationMs});

    transaction.update(personRef, {checkedIn: false, currentVisitId: null, updatedAt: now});

    return {result: "checked-out" as const, firstName: person.firstName, lastName: person.lastName, membershipActive: membershipActive, checkedInAt: checkedInAt, durationMs: durationMs};
}

export async function handleBarcodeScan(input: ScanInput) {
    const db = getFirestore();
    const barcode = input.barcode.trim().toUpperCase(); //ToDo: swap for normalizeBarcode()

    return db.runTransaction(async (transaction) => {
        //Find the member with this barcode
        const personQuery = db.collection(COLLECTIONS.people).where("membership.barcode", "==", barcode).limit(1);

        const matches = await transaction.get(personQuery);
        const personDoc = matches.docs[0];

        if (!personDoc) return { result: "unknown-barcode" as const };

        const personRef = personDoc.ref;
        const person = personDoc.data() as Person;
        let now = Date.now();
        let membershipActive = isMembershipActive(person, now);

        //Check if they are not checked in yet
        if (!person.checkedIn) return checkIn(transaction, personRef, person, input.visitTypeId ?? null, membershipActive, now);

        return checkOut(transaction, personRef, person, membershipActive, now);
    });
}