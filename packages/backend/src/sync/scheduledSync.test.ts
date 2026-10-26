import { beforeEach, describe, expect, it, vi } from "vitest";
import { syncMyTurn } from "@backend/sync/syncMyTurn.ts";
import {
  isMyTurnOpen,
  myTurnNightlySync,
  myTurnOpenHoursSync,
} from "@backend/sync/scheduledSync.ts";

vi.mock("@backend/sync/syncMyTurn.ts", () => ({
  syncMyTurn: vi.fn<typeof syncMyTurn>(),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("Rockville open hours", () => {
  it.each([
    ["2026-10-24T11:59:00-04:00", false],
    ["2026-10-24T12:00:00-04:00", true],
    ["2026-10-24T15:45:00-04:00", true],
    ["2026-10-24T16:00:00-04:00", false],
    ["2026-10-25T13:45:00-04:00", false],
    ["2026-10-25T14:00:00-04:00", true],
    ["2026-10-25T16:00:00-04:00", false],
    ["2026-10-27T17:45:00-04:00", false],
    ["2026-10-27T18:00:00-04:00", true],
    ["2026-10-27T19:45:00-04:00", true],
    ["2026-10-27T20:00:00-04:00", false],
    ["2026-10-29T18:00:00-04:00", true],
    ["2026-10-29T20:00:00-04:00", false],
    ["2026-10-26T18:00:00-04:00", false],
    ["2026-10-28T18:00:00-04:00", false],
    ["2026-10-30T18:00:00-04:00", false],
    ["2026-12-05T11:59:00-05:00", false],
    ["2026-12-05T12:00:00-05:00", true],
    ["2026-12-05T16:00:00-05:00", false],
    ["2026-12-08T18:00:00-05:00", true],
  ])("%s => %s", (time, expected) => {
    expect(isMyTurnOpen(new Date(time))).toBe(expected);
  });
});

describe("scheduled sync handlers", () => {
  it("syncs on an open-hours delivery", async () => {
    await myTurnOpenHoursSync.run({ scheduleTime: "2026-10-24T16:00:00Z" });
    expect(syncMyTurn).toHaveBeenCalledExactlyOnceWith();
  });

  it("does no sync at closing time", async () => {
    await myTurnOpenHoursSync.run({ scheduleTime: "2026-10-24T20:00:00Z" });
    expect(syncMyTurn).not.toHaveBeenCalled();
  });

  it("runs the nightly full sync even on a closed day", async () => {
    await myTurnNightlySync.run({ scheduleTime: "2026-10-26T07:00:00Z" });
    expect(syncMyTurn).toHaveBeenCalledExactlyOnceWith();
  });

  it("propagates sync failures", async () => {
    vi.mocked(syncMyTurn).mockRejectedValueOnce(
      new Error("MyTurn unavailable"),
    );
    await expect(
      myTurnNightlySync.run({ scheduleTime: "2026-10-26T07:00:00Z" }),
    ).rejects.toThrow("MyTurn unavailable");
  });
});
