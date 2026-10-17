import { person } from "@repo/common";
import { type } from "arktype";
import { describe, expect, it } from "vitest";
import { fakePeople } from "@backend/dev/fakePeople.ts";

const people = fakePeople(0);

describe("fakePeople", () => {
  it("returns 40 people with unique IDs", () => {
    expect(people).toHaveLength(40);
    expect(new Set(people.map((p) => p.id)).size).toBe(40);
  });

  it("only contains valid people", () => {
    for (const p of people) {
      expect(person(p)).not.toBeInstanceOf(type.errors);
    }
  });

  it("includes members and non-members", () => {
    expect(people.some((p) => p.personType === "member")).toBe(true);
    expect(people.some((p) => p.personType === "non-member")).toBe(true);
  });

  it("includes the lookup edge cases", () => {
    const keys = people.map((p) => p.nameKey);
    expect(keys.filter((k) => k === "jane doe")).toHaveLength(2);
    expect(keys.filter((k) => k.startsWith("jan"))).toHaveLength(3);
    expect(keys).toContain("jose munoz");
    expect(
      people.some((p) => p.personType === "member" && p.phone === null),
    ).toBe(true);
  });
});
