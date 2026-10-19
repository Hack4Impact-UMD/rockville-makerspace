import { type } from "arktype";

/**
 * One member row as MyTurn returns it. Keys are MyTurn's column names exactly,
 * so they are not camelCase; the sync maps this into a `Person`.
 *
 * Only the columns we use are declared. MyTurn sends ~47 columns and arktype
 * lets undeclared keys through, so the rest (date of birth, gender, secondary
 * contact, balances, ...) are ignored and never stored.
 *
 * Every value is a string: empty cells arrive as "" and dates as M/D/YYYY.
 * A column whose name ends in "?" must be escaped, e.g. "Confirmed\\?".
 */
export const myTurnMember = type({
  "Customer ID": "string >= 1",
  "First Name": "string",
  "Last Name": "string",
  Email: "string",
  Phone: "string",
  Address: "string",
  Address2: "string",
  City: "string",
  "State/Province": "string",
  "Postal Code": "string",
  "Current Membership Type": "string",
  "Current Membership Expiration (M/D/YYYY)": "string",
  "Member Created (M/D/YYYY)": "string",
});
export type MyTurnMember = typeof myTurnMember.infer;
