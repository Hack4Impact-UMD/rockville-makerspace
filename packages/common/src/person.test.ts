import { type } from "arktype";
import { describe, expect, it } from "vitest";
import { address } from "@common/address.ts";
import { adminUser } from "@common/admin.ts";
import {
  DEFAULT_LABELS,
  DEFAULT_VISIT_TYPES,
  label,
  visitType,
} from "@common/catalog.ts";
import { myTurnMember } from "@common/myturn.ts";
import { nameKey, person, personId } from "@common/person.ts";
import { visit } from "@common/visit.ts";

const myTurnRow = {
  "Customer ID": "1042",
  "First Name": "Jane",
  "Last Name": "Doe",
  Email: "jane@example.com",
  Phone: "(301) 555-1234",
  Address: "",
  Address2: "",
  City: "",
  "State/Province": "",
  "Postal Code": "",
  "Current Membership Type": "Individual",
  "Current Membership Expiration (M/D/YYYY)": "6/30/2027",
  "Member Created (M/D/YYYY)": "1/15/2024",
};

const nonMember = {
  id: "nm_+13015551234_jane-doe",
  personType: "non-member",
  firstName: "Jane",
  lastName: "Doe",
  nameKey: "jane doe",
  phone: "+13015551234",
  email: null,
  address: null,
  checkedIn: false,
  currentVisitId: null,
  labelIds: [],
  membership: null,
  createdAt: 0,
  updatedAt: 0,
};

const member = {
  ...nonMember,
  id: "myturn_1042",
  personType: "member",
  phone: null,
  membership: {
    myturnId: "1042",
    barcode: null,
    membershipType: "Individual",
    expiresAt: null,
    memberSince: null,
    certifications: ["laser-cutter"],
    syncedAt: 0,
  },
};

describe("myTurnMember", () => {
  it("accepts a row with blank cells and undeclared columns", () => {
    const row = { ...myTurnRow, Gender: "", "Confirmed?": "Yes" };
    expect(myTurnMember(row)).not.toBeInstanceOf(type.errors);
  });

  it("rejects a row without a Customer ID", () => {
    expect(myTurnMember({ ...myTurnRow, "Customer ID": "" })).toBeInstanceOf(
      type.errors,
    );
  });
});

describe("person", () => {
  it("accepts a non-member", () => {
    expect(person(nonMember)).not.toBeInstanceOf(type.errors);
  });

  it("accepts a member without a phone", () => {
    expect(person(member)).not.toBeInstanceOf(type.errors);
  });

  it("rejects a member without membership", () => {
    expect(person({ ...member, membership: null })).toBeInstanceOf(type.errors);
  });

  it("rejects a non-member without a phone", () => {
    expect(person({ ...nonMember, phone: null })).toBeInstanceOf(type.errors);
  });
});

describe("address", () => {
  it("rejects a partial address", () => {
    expect(
      address({
        street: "100 Main St",
        unit: null,
        city: "",
        state: "MD",
        zip: "20850",
      }),
    ).toBeInstanceOf(type.errors);
  });
});

describe("person helpers", () => {
  it("normalizes names", () => {
    expect(nameKey("  José   DOE ")).toBe("jose doe");
  });

  it("builds deterministic IDs", () => {
    expect(personId.member("1042")).toBe("myturn_1042");
    expect(personId.nonMember("+13015551234", " Jane  Doe")).toBe(
      "nm_+13015551234_jane-doe",
    );
  });
});

describe("visit", () => {
  it("accepts an open visit", () => {
    const open = {
      id: "v1",
      personId: "myturn_1042",
      personType: "member",
      visitTypeId: "member-hours",
      checkInMethod: "barcode",
      checkedInAt: 0,
      checkedOutAt: null,
      durationMs: null,
      endReason: null,
      flags: [],
      updatedAt: 0,
      updatedBy: null,
    };
    expect(visit(open)).not.toBeInstanceOf(type.errors);
  });
});

describe("catalog defaults", () => {
  it.each(DEFAULT_VISIT_TYPES)("visit type $id is valid", (entry) => {
    expect(visitType(entry)).not.toBeInstanceOf(type.errors);
  });

  it.each(DEFAULT_LABELS)("label $id is valid", (entry) => {
    expect(label(entry)).not.toBeInstanceOf(type.errors);
  });
});

describe("adminUser", () => {
  it("rejects a bad email", () => {
    expect(
      adminUser({
        email: "not-an-email",
        name: "A",
        addedAt: 0,
        addedBy: null,
      }),
    ).toBeInstanceOf(type.errors);
  });
});
