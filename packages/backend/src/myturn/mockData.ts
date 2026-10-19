import type { MyTurnMember } from "@repo/common";

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;
const YEAR = 365 * DAY;

/** The first generated member joins here; one more joins every `JOIN_EVERY`. */
const BASE_DATE = Date.UTC(2026, 9, 1);
const JOIN_EVERY = 6 * HOUR;

/** Generated members whose index is a multiple of this renew after a few days. */
const RENEW_EVERY_NTH = 5;
const RENEW_AFTER = 3 * DAY;

const FIRST_NAMES = [
  "Ava",
  "Ben",
  "Chloe",
  "Diego",
  "Emma",
  "Farah",
  "Gabe",
  "Hana",
  "Isaac",
  "Jada",
  "Kenji",
  "Lena",
  "Mateo",
  "Nia",
  "Owen",
  "Priya",
];
const LAST_NAMES = [
  "Adams",
  "Brooks",
  "Chen",
  "Dubois",
  "Evans",
  "Flores",
  "Garcia",
  "Huang",
  "Iyer",
  "Johnson",
  "Kim",
  "Lopez",
  "Martin",
  "Nguyen",
];

/** Rotated so the sync has to normalize every common phone format. */
const PHONE_FORMATS = [
  (n: string) => `(301) 555-${n}`,
  (n: string) => `301.555.${n}`,
  (n: string) => `+1 301 555 ${n}`,
  (n: string) => `301555${n}`,
];

/** MyTurn's date format: M/D/YYYY. */
function myTurnDate(ms: number): string {
  const date = new Date(ms);
  return `${date.getUTCMonth() + 1}/${date.getUTCDate()}/${date.getUTCFullYear()}`;
}

/** A full row with every declared column, blank unless overridden. */
function row(fields: Partial<MyTurnMember>): MyTurnMember {
  return {
    "Customer ID": "",
    "First Name": "",
    "Last Name": "",
    Email: "",
    Phone: "",
    Address: "",
    Address2: "",
    City: "",
    "State/Province": "",
    "Postal Code": "",
    "Current Membership Type": "",
    "Current Membership Expiration (M/D/YYYY)": "",
    "Member Created (M/D/YYYY)": "",
    ...fields,
  };
}

/**
 * Hand-written rows covering the cases the sync must handle. Always returned,
 * before any generated member.
 */
const EDGE_CASES: Record<string, unknown>[] = [
  // A complete Rockville member.
  row({
    "Customer ID": "9001",
    "First Name": "Maria",
    "Last Name": "Santos",
    Email: "maria.santos@example.com",
    Phone: "(301) 555-0101",
    Address: "100 Maryland Ave",
    Address2: "Apt 4",
    City: "Rockville",
    "State/Province": "MD",
    "Postal Code": "20850",
    "Current Membership Type": "Individual",
    "Current Membership Expiration (M/D/YYYY)": "6/30/2027",
    "Member Created (M/D/YYYY)": "3/14/2023",
  }),
  // No phone and no address: both are blank in MyTurn.
  row({
    "Customer ID": "9002",
    "First Name": "Tom",
    "Last Name": "Becker",
    Email: "tom.becker@example.com",
    "Current Membership Type": "Individual",
    "Current Membership Expiration (M/D/YYYY)": "1/31/2027",
    "Member Created (M/D/YYYY)": "1/31/2025",
  }),
  // Expired membership.
  row({
    "Customer ID": "9003",
    "First Name": "Grace",
    "Last Name": "Okafor",
    Email: "grace.okafor@example.com",
    Phone: "301.555.0103",
    "Current Membership Type": "Family",
    "Current Membership Expiration (M/D/YYYY)": "8/31/2025",
    "Member Created (M/D/YYYY)": "8/31/2024",
  }),
  // Accented names and a phone with a country code.
  row({
    "Customer ID": "9004",
    "First Name": "José",
    "Last Name": "Muñoz",
    Email: "jose.munoz@example.com",
    Phone: "+1 301 555 0104",
    City: "Gaithersburg",
    "State/Province": "MD",
    "Postal Code": "20877",
    Address: "12 Summit Ave",
    "Current Membership Type": "Student",
    "Current Membership Expiration (M/D/YYYY)": "5/31/2027",
    "Member Created (M/D/YYYY)": "9/1/2025",
  }),
  // A blank membership type and expiration.
  row({
    "Customer ID": "9005",
    "First Name": "Sam",
    "Last Name": "Lee",
    Email: "",
    Phone: "3015550105",
    "Member Created (M/D/YYYY)": "2/2/2026",
  }),
  // Extra columns the schema doesn't declare; the sync must ignore them.
  {
    ...row({
      "Customer ID": "9006",
      "First Name": "Ravi",
      "Last Name": "Patel",
      Email: "ravi.patel@example.com",
      Phone: "(240) 555-0106",
      "Current Membership Type": "Individual",
      "Current Membership Expiration (M/D/YYYY)": "12/31/2026",
      "Member Created (M/D/YYYY)": "12/31/2025",
    }),
    Gender: "",
    "Confirmed?": "Yes",
    "Date of Birth": "4/1/1990",
  },
  // Malformed: no Customer ID. The sync must validate and skip it.
  row({
    "First Name": "Broken",
    "Last Name": "Record",
    Email: "broken@example.com",
    "Member Created (M/D/YYYY)": "1/1/2026",
  }),
];

function generatedMember(index: number, now: number): MyTurnMember {
  const joinedAt = BASE_DATE + index * JOIN_EVERY;
  const renewed =
    index % RENEW_EVERY_NTH === 0 && now >= joinedAt + RENEW_AFTER;
  const firstName = FIRST_NAMES[index % FIRST_NAMES.length] ?? "Alex";
  const lastName =
    LAST_NAMES[Math.floor(index / FIRST_NAMES.length) % LAST_NAMES.length] ??
    "Smith";
  const phoneSuffix = String(1000 + (index % 9000));
  const formatPhone = PHONE_FORMATS[index % PHONE_FORMATS.length];

  return row({
    "Customer ID": String(10_000 + index),
    "First Name": firstName,
    "Last Name": lastName,
    Email: `${firstName}.${lastName}.${index}@example.com`.toLowerCase(),
    Phone: formatPhone ? formatPhone(phoneSuffix) : "",
    "Current Membership Type": renewed ? "Individual (renewed)" : "Individual",
    "Current Membership Expiration (M/D/YYYY)": myTurnDate(
      joinedAt + (renewed ? 2 : 1) * YEAR,
    ),
    "Member Created (M/D/YYYY)": myTurnDate(joinedAt),
  });
}

/**
 * What the mock MyTurn API returns at time `now`. Deterministic and stateless,
 * so every cold start and test sees the same data for the same `now`.
 *
 * Polling simulation: a new member joins every six hours from `BASE_DATE`, so
 * a later poll returns everything an earlier one did plus new members. Every
 * fifth member renews a few days after joining, so existing rows change too.
 *
 * Typed `unknown[]` like a real API response: the sync must validate each row
 * with `myTurnMember`.
 */
export function mockMyTurnMembers(now: number): unknown[] {
  const joined =
    now < BASE_DATE ? 0 : Math.floor((now - BASE_DATE) / JOIN_EVERY) + 1;
  const generated = Array.from({ length: joined }, (_, index) =>
    generatedMember(index, now),
  );
  return [...EDGE_CASES, ...generated];
}
