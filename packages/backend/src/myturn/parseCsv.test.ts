import { describe, expect, it } from "vitest";
import {
  CsvFormatError,
  mapColumns,
  normalizeHeader,
  parseMyTurnCsv,
  toAddress,
  toE164,
  toEmail,
} from "@backend/myturn/parseCsv.ts";

const MYTURN_COLUMNS = [
  "Customer ID",
  "First Name",
  "Last Name",
  "Email",
  "Confirmed?",
  "Unconfirmed Email",
  "Username",
  "Title",
  "Organization",
  "Department",
  "Address",
  "Address2",
  "City",
  "State/Province",
  "Postal Code",
  "Country",
  "Phone",
  "Alt. Phone",
  "Address Notes",
  "Gender",
  "Date of Birth",
  "Age",
  "Secondary First Name",
  "Secondary Last Name",
  "Secondary Email",
  "Secondary Title",
  "Secondary Organization",
  "Secondary Department",
  "Secondary Address",
  "Secondary Address2",
  "Secondary City",
  "Secondary State/Province",
  "Secondary Postal Code",
  "Secondary Country",
  "Secondary Phone",
  "Secondary Alt. Phone",
  "Secondary Address Notes",
  "Member Created (M/D/YYYY)",
  "Start of first full membership (M/D/YYYY)",
  "Current Membership Type",
  "Latest Membership Change (request, upgrade, renewal, cancellation...) (M/D/YYYY)",
  "Current Membership Expiration (M/D/YYYY)",
  "Suspended",
  "Renews Automatically",
  "Automatically Pay Statements",
  "User Note",
  "User Warning",
  "Opening Balance",
  "Opening Balance Date (M/D/YYYY)",
];

// quotes a cell the way a spreadsheet export does
function cell(value: string): string {
  return /[",\n]/.test(value) ? `"${value.replaceAll('"', '""')}"` : value;
}

// builds csv text. each row is { column name: value }, missing columns are blank.
function csv(
  rows: Record<string, string>[],
  columns: string[] = MYTURN_COLUMNS,
): string {
  const lines = [
    columns.map(cell).join(","),
    ...rows.map((row) => columns.map((c) => cell(row[c] ?? "")).join(",")),
  ];
  return `${lines.join("\n")}\n`;
}

const MARIA = {
  "Customer ID": "9001",
  "First Name": "Maria",
  "Last Name": "Santos",
  Email: "maria.santos@example.com",
  Address: "100 Maryland Ave",
  Address2: "Apt 4",
  City: "Rockville",
  "State/Province": "MD",
  "Postal Code": "20850",
  Country: "United States",
  Phone: "(301) 555-0101",
};

describe("normalizeHeader", () => {
  it.each([
    ["State/Province", "stateprovince"],
    ["first_name", "firstname"],
    ["firstName", "firstname"],
    ["  Postal Code ", "postalcode"],
    ["Alt. Phone", "altphone"],
  ])("%s -> %s", (header, expected) => {
    expect(normalizeHeader(header)).toBe(expected);
  });
});

describe("mapColumns", () => {
  it("finds every field in the real myturn export", () => {
    expect(mapColumns(MYTURN_COLUMNS)).toEqual({
      customerId: 0,
      firstName: 1,
      lastName: 2,
      email: 3,
      street: 10,
      unit: 11,
      city: 12,
      state: 13,
      zip: 14,
      phone: 16,
    });
  });

  it("ignores look-alike columns like Secondary Phone and Alt. Phone", () => {
    expect(
      mapColumns(["Secondary Phone", "Alt. Phone", "Unconfirmed Email"]),
    ).toEqual({});
  });

  it("accepts the column names from the ticket", () => {
    expect(
      mapColumns([
        "firstName",
        "lastName",
        "email",
        "phone",
        "Address",
        "City",
        "Country",
        "State",
        "postal code",
        "customerID",
      ]),
    ).toEqual({
      firstName: 0,
      lastName: 1,
      email: 2,
      phone: 3,
      street: 4,
      city: 5,
      state: 7,
      zip: 8,
      customerId: 9,
    });
  });

  it("uses the first column when two match the same field", () => {
    expect(mapColumns(["Phone", "Mobile"])).toEqual({ phone: 0 });
  });
});

describe("toE164", () => {
  it.each([
    ["(301) 555-0101", "+13015550101"],
    ["301.555.0103", "+13015550103"],
    ["+1 301 555 0104", "+13015550104"],
    ["3015550105", "+13015550105"],
    ["555-0101", null],
    ["+44 20 7946 0958", null],
  ])("%s -> %s", (raw, expected) => {
    expect(toE164(raw)).toBe(expected);
  });
});

describe("toEmail", () => {
  it.each([
    ["maria@example.com", "maria@example.com"],
    ["not-an-email", null],
    ["a@b", null],
  ])("%s -> %s", (raw, expected) => {
    expect(toEmail(raw)).toBe(expected);
  });
});

describe("toAddress", () => {
  const full = {
    street: "100 Maryland Ave",
    unit: "Apt 4",
    city: "Rockville",
    state: "MD",
    zip: "20850",
  };

  it("builds a complete address", () => {
    expect(toAddress(full)).toEqual(full);
  });

  it("uppercases the state", () => {
    expect(toAddress({ ...full, state: "md" })?.state).toBe("MD");
  });

  it("stores a blank unit as null", () => {
    expect(toAddress({ ...full, unit: "" })?.unit).toBeNull();
  });

  it("accepts ZIP+4", () => {
    expect(toAddress({ ...full, zip: "20850-1234" })?.zip).toBe("20850-1234");
  });

  it.each([
    ["a full state name", { ...full, state: "Maryland" }],
    ["a missing zip", { ...full, zip: "" }],
    ["a missing city", { ...full, city: "" }],
    [
      "every part blank",
      { street: "", unit: "", city: "", state: "", zip: "" },
    ],
  ])("is null for %s", (_, parts) => {
    expect(toAddress(parts)).toBeNull();
  });
});

describe("parseMyTurnCsv", () => {
  it("imports a complete member from the real export format", () => {
    const result = parseMyTurnCsv(csv([MARIA]));

    expect(result.skipped).toEqual([]);
    expect(result.members).toEqual([
      {
        customerId: "9001",
        firstName: "Maria",
        lastName: "Santos",
        nameKey: "maria santos",
        phone: "+13015550101",
        email: "maria.santos@example.com",
        address: {
          street: "100 Maryland Ave",
          unit: "Apt 4",
          city: "Rockville",
          state: "MD",
          zip: "20850",
        },
      },
    ]);
  });

  it("reads Phone, not Secondary Phone or Alt. Phone", () => {
    const result = parseMyTurnCsv(
      csv([
        {
          ...MARIA,
          "Alt. Phone": "240-555-0001",
          "Secondary Phone": "240-555-0002",
        },
      ]),
    );

    expect(result.members[0]?.phone).toBe("+13015550101");
  });

  it("keeps commas inside quoted cells", () => {
    const result = parseMyTurnCsv(
      csv([{ ...MARIA, Address: "100 Maryland Ave, Rear" }]),
    );

    expect(result.members[0]?.address?.street).toBe("100 Maryland Ave, Rear");
  });

  it("trims whitespace around values", () => {
    const result = parseMyTurnCsv(
      csv([
        { ...MARIA, "First Name": "  Maria ", Email: " maria@example.com " },
      ]),
    );

    expect(result.members[0]?.firstName).toBe("Maria");
    expect(result.members[0]?.email).toBe("maria@example.com");
  });

  it("normalizes accented names in nameKey", () => {
    const result = parseMyTurnCsv(
      csv([
        { "Customer ID": "9004", "First Name": "José", "Last Name": "Muñoz" },
      ]),
    );

    expect(result.members[0]?.firstName).toBe("José");
    expect(result.members[0]?.nameKey).toBe("jose munoz");
  });

  it("stores blank phone, email, and address as null", () => {
    const result = parseMyTurnCsv(
      csv([
        { "Customer ID": "9002", "First Name": "Tom", "Last Name": "Becker" },
      ]),
    );

    expect(result.skipped).toEqual([]);
    expect(result.members[0]).toMatchObject({
      phone: null,
      email: null,
      address: null,
    });
  });

  it("imports a member with a partial address, leaving the address null", () => {
    const result = parseMyTurnCsv(
      csv([{ ...MARIA, "State/Province": "Maryland" }]),
    );

    expect(result.skipped).toEqual([]);
    expect(result.members[0]?.address).toBeNull();
  });

  it("skips a row with no Customer ID", () => {
    const result = parseMyTurnCsv(csv([{ ...MARIA, "Customer ID": "" }]));

    expect(result.members).toEqual([]);
    expect(result.skipped).toEqual([
      { row: 2, customerId: null, reason: "missing Customer ID" },
    ]);
  });

  it("skips a row with a missing name", () => {
    const result = parseMyTurnCsv(csv([{ ...MARIA, "Last Name": "" }]));

    expect(result.skipped).toEqual([
      { row: 2, customerId: "9001", reason: "missing last name" },
    ]);
  });

  it("lists every problem with a row in one reason", () => {
    const result = parseMyTurnCsv(
      csv([{ ...MARIA, Email: "nope", Phone: "555" }]),
    );

    expect(result.skipped).toEqual([
      {
        row: 2,
        customerId: "9001",
        reason: 'invalid email "nope"; invalid phone "555"',
      },
    ]);
  });

  it("skips a repeated Customer ID and keeps the first", () => {
    const result = parseMyTurnCsv(
      csv([MARIA, { ...MARIA, "First Name": "Mary" }]),
    );

    expect(result.members.map((m) => m.firstName)).toEqual(["Maria"]);
    expect(result.skipped).toEqual([
      {
        row: 3,
        customerId: "9001",
        reason: "duplicate Customer ID (first seen on row 2)",
      },
    ]);
  });

  it("does not count a skipped row as the first sighting of its ID", () => {
    const result = parseMyTurnCsv(csv([{ ...MARIA, Email: "nope" }, MARIA]));

    expect(result.members).toHaveLength(1);
    expect(result.skipped.map((s) => s.row)).toEqual([2]);
  });

  it("ignores rows that are only commas, keeping spreadsheet row numbers", () => {
    const result = parseMyTurnCsv(
      csv([MARIA, {}, { ...MARIA, "Customer ID": "" }, {}]),
    );

    expect(result.members).toHaveLength(1);
    expect(result.skipped).toEqual([
      { row: 4, customerId: null, reason: "missing Customer ID" },
    ]);
  });

  it("handles a byte order mark and Windows line endings", () => {
    const text = `﻿${csv([MARIA]).replaceAll("\n", "\r\n")}`;

    const result = parseMyTurnCsv(text);

    expect(result.members.map((m) => m.customerId)).toEqual(["9001"]);
  });

  it("accepts the column names from the ticket", () => {
    const columns = [
      "firstName",
      "lastName",
      "email",
      "phone",
      "Address",
      "City",
      "Country",
      "State",
      "postal code",
      "customerID",
    ];
    const row = {
      firstName: "Maria",
      lastName: "Santos",
      email: "maria@example.com",
      phone: "3015550101",
      Address: "100 Maryland Ave",
      City: "Rockville",
      Country: "US",
      State: "MD",
      "postal code": "20850",
      customerID: "9001",
    };

    const result = parseMyTurnCsv(csv([row], columns));

    expect(result.skipped).toEqual([]);
    expect(result.members[0]).toMatchObject({
      customerId: "9001",
      phone: "+13015550101",
      address: { street: "100 Maryland Ave", unit: null, zip: "20850" },
    });
  });

  it("returns nothing for a file with only a header", () => {
    expect(parseMyTurnCsv(csv([]))).toEqual({ members: [], skipped: [] });
  });

  describe("rejects an unusable file", () => {
    it("when it's empty", () => {
      expect(() => parseMyTurnCsv("")).toThrow(
        new CsvFormatError("The file is empty."),
      );
    });

    it("when required columns are missing, naming them", () => {
      expect(() => parseMyTurnCsv(csv([], ["First Name", "Email"]))).toThrow(
        new CsvFormatError(
          "Missing required column(s): Customer ID, Last Name.",
        ),
      );
    });

    it("when it isn't valid CSV", () => {
      expect(() => parseMyTurnCsv('Customer ID,"First Name\n')).toThrow(
        CsvFormatError,
      );
    });
  });
});
