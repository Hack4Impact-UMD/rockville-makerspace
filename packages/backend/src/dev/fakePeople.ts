import { nameKey, personId } from "@repo/common";
import type { Person } from "@repo/common";

/** Fictional 555-01xx numbers only. */
const phone = (last2: string) => `+1301555${`01${last2}`}`;

function base(firstName: string, lastName: string, now: number) {
  return {
    firstName,
    lastName,
    nameKey: nameKey(`${firstName} ${lastName}`),
    email: null,
    address: null,
    checkedIn: false,
    currentVisitId: null,
    labelIds: [],
    createdAt: now,
    updatedAt: now,
  };
}

function member(
  customerId: string,
  firstName: string,
  lastName: string,
  memberPhone: string | null,
  now: number,
): Person {
  return {
    ...base(firstName, lastName, now),
    id: personId.member(customerId),
    personType: "member",
    phone: memberPhone,
    membership: {
      myturnId: customerId,
      barcode: null,
      membershipType: "Individual",
      expiresAt: now + 365 * 24 * 60 * 60 * 1000,
      memberSince: now,
      certifications: [],
      syncedAt: now,
    },
  };
}

function nonMember(
  firstName: string,
  lastName: string,
  visitorPhone: string,
  now: number,
): Person {
  return {
    ...base(firstName, lastName, now),
    id: personId.nonMember(visitorPhone, `${firstName} ${lastName}`),
    personType: "non-member",
    phone: visitorPhone,
    membership: null,
  };
}

const FILLER_MEMBERS: [string, string][] = [
  ["Ava", "Adams"],
  ["Ben", "Brooks"],
  ["Chloe", "Chen"],
  ["Diego", "Diaz"],
  ["Emma", "Evans"],
  ["Farah", "Flores"],
  ["Gabe", "Garcia"],
  ["Hana", "Huang"],
  ["Isaac", "Iyer"],
  ["Jada", "Johnson"],
  ["Kenji", "Kim"],
  ["Lena", "Lopez"],
  ["Mateo", "Martin"],
  ["Nia", "Nguyen"],
  ["Owen", "Ortiz"],
  ["Priya", "Patel"],
  ["Quinn", "Reyes"],
  ["Sara", "Singh"],
  ["Theo", "Turner"],
  ["Uma", "Vargas"],
];

const FILLER_NON_MEMBERS: [string, string][] = [
  ["Wes", "Walker"],
  ["Xena", "Young"],
  ["Yara", "Zhang"],
  ["Zoe", "Allen"],
  ["Aaron", "Baker"],
  ["Bella", "Carter"],
  ["Caleb", "Davis"],
  ["Daisy", "Ellis"],
  ["Eli", "Foster"],
  ["Fiona", "Gray"],
  ["George", "Hill"],
  ["Holly", "Irwin"],
  ["Ivan", "Jensen"],
  ["Julia", "Keller"],
];

/**
 * Fake people for the emulator, so lookup and check-in work can start without
 * real data. Deterministic IDs make re-seeding safe. Includes the cases the
 * kiosk lookup must handle:
 * - two "Jane Doe"s told apart only by the last 4 phone digits
 * - "Jan Park" and "Jane Doe", so "jan" matches both
 * - "José Muñoz", found by typing "jose"
 * - a member with no phone
 * - a non-member sharing a phone with a member
 *
 * Member IDs use 8xxx so they never collide with the mock MyTurn data
 * (9001–9006, 10000+), which the sync writes to the same `people` docs.
 */
export function fakePeople(now: number): Person[] {
  const edgeCases = [
    member("8001", "Jane", "Doe", phone("01"), now),
    nonMember("Jane", "Doe", phone("02"), now),
    member("8002", "Jan", "Park", phone("03"), now),
    member("8003", "José", "Muñoz", phone("04"), now),
    member("8004", "Tom", "Becker", null, now),
    nonMember("Sam", "Lee", phone("03"), now),
  ];
  const members = FILLER_MEMBERS.map(([first, last], index) =>
    member(String(8100 + index), first, last, phone(String(10 + index)), now),
  );
  const nonMembers = FILLER_NON_MEMBERS.map(([first, last], index) =>
    nonMember(first, last, phone(String(50 + index)), now),
  );
  return [...edgeCases, ...members, ...nonMembers];
}
