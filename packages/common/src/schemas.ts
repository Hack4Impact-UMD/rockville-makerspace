import { type } from "arktype";

export const helloInput = type({
  name: "string >= 1",
});
export type HelloInput = typeof helloInput.infer;

export const addNoteInput = type({
  text: "1 <= string <= 280",
});
export type AddNoteInput = typeof addNoteInput.infer;

export const note = type({
  id: "string",
  text: "string",
  createdAt: "number",
});
export type Note = typeof note.infer;

export const scanInput = type({
  barcode: "string >= 1",
  "visitTypeId?": "string",
});
export type ScanInput = typeof scanInput.infer;
