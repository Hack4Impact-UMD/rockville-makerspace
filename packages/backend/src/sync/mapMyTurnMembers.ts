import type { Address, MyTurnMember } from "@repo/common";
import { nameKey, normalizePhone, personId, address } from "@repo/common";
import { type } from "arktype";

export function blankToNull(cell: string): string | null {
  const trimmed = cell.trim();
  if (trimmed.length === 0) {
    return null;
  }

  return trimmed;
}

// TODO: eastern time might matter for expiry
// dates are treated as UTC
export function parseMyTurnDate(date: string): number | null {
  if (blankToNull(date) === null) {
    return null;
  }

  const splitDate = date.trim().split("/");
  if (splitDate.length !== 3) {
    return null;
  }

  const dateNums: number[] = [];
  for (const num of splitDate) {
    if (Number.isInteger(Number(num)) && Number(num) > 0) {
      dateNums.push(Number(num));
    } else {
      return null;
    }
  }

  const [month, day, year] = dateNums;
  if (year === undefined || month === undefined || day === undefined) {
    return null;
  }

  const formatted = Date.UTC(year, month - 1, day);

  const dateFromFormatted = new Date(formatted);
  if (
    dateFromFormatted.getUTCFullYear() !== year ||
    dateFromFormatted.getUTCMonth() !== month - 1 ||
    dateFromFormatted.getUTCDate() !== day
  ) {
    return null;
  }

  return formatted;
}

export function mapMyTurnMember(row: MyTurnMember, now: number) {
  let addressObj: Address | null = {
    street: row["Address"],
    unit: blankToNull(row["Address2"]),
    city: row["City"],
    state: row["State/Province"],
    zip: row["Postal Code"],
  };
  const result = address(addressObj);
  if (result instanceof type.errors) {
    addressObj = null;
  }

  return {
    id: personId.member(row["Customer ID"]),
    personType: "member",
    firstName: row["First Name"].trim(),
    lastName: row["Last Name"].trim(),
    nameKey: nameKey(`${row["First Name"]} ${row["Last Name"]}`),
    phone: normalizePhone(row["Phone"]),
    email: blankToNull(row["Email"]),
    updatedAt: now,
    membership: {
      myturnId: row["Customer ID"],
      membershipType: blankToNull(row["Current Membership Type"]),
      expiresAt: parseMyTurnDate(
        row["Current Membership Expiration (M/D/YYYY)"],
      ),
      memberSince: parseMyTurnDate(row["Member Created (M/D/YYYY)"]),
      syncedAt: now,
    },
    address: addressObj,
  };
}
