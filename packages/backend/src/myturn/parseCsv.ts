import { type } from "arktype";
import { parse } from "csv-parse/sync";
import { address, nameKey } from "@repo/common";
import type { Address, Person } from "@repo/common";

// the save step merges these into an existing member or fills
// in defaults for a new one
export type ImportedMember = Pick<
  Person,
  "firstName" | "lastName" | "nameKey" | "phone" | "email" | "address"
> & {
  customerId: string;
};

export type SkippedRow = {
  row: number;
  customerId: string | null;
  reason: string;
};

export type ParseResult = {
  members: ImportedMember[];
  skipped: SkippedRow[];
};

// the csv values the parser reads
type Field =
  | "customerId"
  | "firstName"
  | "lastName"
  | "email"
  | "phone"
  | "street"
  | "unit"
  | "city"
  | "state"
  | "zip";

// matching is exact, so look alike columns in the real export never match
const ALIASES: Record<Field, string[]> = {
  customerId: ["customerid", "myturnid", "memberid"],
  firstName: ["firstname", "first", "givenname"],
  lastName: ["lastname", "last", "surname", "familyname"],
  email: ["email", "emailaddress"],
  phone: ["phone", "phonenumber", "mobile", "cell"],
  street: ["address", "address1", "addressline1", "street", "streetaddress"],
  unit: ["address2", "addressline2", "unit", "apt"],
  city: ["city", "town"],
  state: ["state", "stateprovince", "province"],
  zip: ["postalcode", "zip", "zipcode", "postcode"],
};

export function normalizeHeader(header: string): string {
  return header.toLowerCase().replaceAll(/[^a-z0-9]/g, "");
}

const FIELD_BY_ALIAS = new Map<string, Field>();
for (const [field, aliases] of Object.entries(ALIASES)) {
  for (const alias of aliases) {
    FIELD_BY_ALIAS.set(alias, field as Field);
  }
}

// finds the column index of each field in the header row. a field with no
// matching column is left out. if two columns match one field, the first wins.
export function mapColumns(headers: string[]): Partial<Record<Field, number>> {
  const columns: Partial<Record<Field, number>> = {};
  headers.forEach((header, index) => {
    const field = FIELD_BY_ALIAS.get(normalizeHeader(header));
    if (field !== undefined && columns[field] === undefined) {
      columns[field] = index;
    }
  });
  return columns;
}

export function toE164(raw: string): string | null {
  const digits = raw.replaceAll(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  return null;
}

const emailType = type("string.email");

export function toEmail(raw: string): string | null {
  const result = emailType(raw);
  return result instanceof type.errors ? null : result;
}

export function toAddress(parts: {
  street: string;
  unit: string;
  city: string;
  state: string;
  zip: string;
}): Address | null {
  const result = address({
    street: parts.street,
    unit: parts.unit === "" ? null : parts.unit,
    city: parts.city,
    state: parts.state.toUpperCase(),
    zip: parts.zip,
  });
  return result instanceof type.errors ? null : result;
}

export class CsvFormatError extends Error {
  override name = "CsvFormatError";
}

const REQUIRED: { field: Field; label: string }[] = [
  { field: "customerId", label: "Customer ID" },
  { field: "firstName", label: "First Name" },
  { field: "lastName", label: "Last Name" },
];

// blank optional values become null. an email or phone thats filled in but
// invalid skips the row so an admin can fix it in myturn. a bad address
// doesnt skip the row, it just becomes null.
export function parseMyTurnCsv(text: string): ParseResult {
  let records: string[][];
  try {
    records = parse(text, {
      bom: true,
      skip_empty_lines: true,
      relax_column_count: true,
    });
  } catch (error) {
    throw new CsvFormatError(
      `Couldn't read the file as CSV: ${(error as Error).message}`,
    );
  }

  const [headers, ...rows] = records;
  if (headers === undefined) {
    throw new CsvFormatError("The file is empty.");
  }

  const columns = mapColumns(headers);
  const missing = REQUIRED.filter(({ field }) => columns[field] === undefined);
  if (missing.length > 0) {
    throw new CsvFormatError(
      `Missing required column(s): ${missing.map((m) => m.label).join(", ")}.`,
    );
  }

  const members: ImportedMember[] = [];
  const skipped: SkippedRow[] = [];
  // customer id -> the row it was first seen on
  const seen = new Map<string, number>();

  rows.forEach((cells, index) => {
    // exports often end with a row of only commas
    if (cells.every((cell) => cell.trim() === "")) return;

    const row = index + 2;
    const get = (field: Field): string => {
      const column = columns[field];
      return column === undefined ? "" : (cells[column] ?? "").trim();
    };

    const customerId = get("customerId");
    const firstName = get("firstName");
    const lastName = get("lastName");
    const rawEmail = get("email");
    const rawPhone = get("phone");

    const email = rawEmail === "" ? null : toEmail(rawEmail);
    const phone = rawPhone === "" ? null : toE164(rawPhone);

    const reasons: string[] = [];
    if (customerId === "") reasons.push("missing Customer ID");
    if (firstName === "") reasons.push("missing first name");
    if (lastName === "") reasons.push("missing last name");
    if (rawEmail !== "" && email === null) {
      reasons.push(`invalid email "${rawEmail}"`);
    }
    if (rawPhone !== "" && phone === null) {
      reasons.push(`invalid phone "${rawPhone}"`);
    }
    const firstRow = seen.get(customerId);
    if (firstRow !== undefined) {
      reasons.push(`duplicate Customer ID (first seen on row ${firstRow})`);
    }

    if (reasons.length > 0) {
      skipped.push({
        row,
        customerId: customerId === "" ? null : customerId,
        reason: reasons.join("; "),
      });
      return;
    }

    seen.set(customerId, row);
    members.push({
      customerId,
      firstName,
      lastName,
      nameKey: nameKey(`${firstName} ${lastName}`),
      phone,
      email,
      address: toAddress({
        street: get("street"),
        unit: get("unit"),
        city: get("city"),
        state: get("state"),
        zip: get("zip"),
      }),
    });
  });

  return { members, skipped };
}
