import { onSchedule } from "firebase-functions/scheduler";
import { syncMyTurn } from "@backend/sync/syncMyTurn.ts";

export const MYTURN_TIME_ZONE = "America/New_York";

/** Opening is inclusive; closing is exclusive. Handles EST and EDT. */
export function isMyTurnOpen(date: Date): boolean {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: MYTURN_TIME_ZONE,
    weekday: "short",
    hour: "numeric",
    hourCycle: "h23",
  }).formatToParts(date);
  const day = parts.find((part) => part.type === "weekday")?.value;
  const hour = Number(parts.find((part) => part.type === "hour")?.value);
  switch (day) {
    case "Sat":
      return hour >= 12 && hour < 16;
    case "Sun":
      return hour >= 14 && hour < 16;
    case "Tue":
    case "Thu":
      return hour >= 18 && hour < 20;
    default:
      return false;
  }
}

// One polling job plus one nightly job uses two of the billing account's
// three free Cloud Scheduler jobs. Closed-hour invocations do no Firestore work.
// Functions and Firestore usage are billed separately; free usage is not guaranteed.
export const myTurnOpenHoursSync = onSchedule(
  {
    schedule: "*/15 * * * 0,2,4,6",
    timeZone: MYTURN_TIME_ZONE,
    maxInstances: 1,
    concurrency: 1,
    retryCount: 0,
  },
  async (event) => {
    // Use the scheduled time so delayed delivery keeps its intended open window.
    if (isMyTurnOpen(new Date(event.scheduleTime))) {
      await syncMyTurn();
    }
  },
);

export const myTurnNightlySync = onSchedule(
  {
    schedule: "0 3 * * *",
    timeZone: MYTURN_TIME_ZONE,
    maxInstances: 1,
    concurrency: 1,
    retryCount: 0,
  },
  async () => {
    // syncMyTurn always fetches the full member list and logs the result.
    await syncMyTurn();
  },
);
