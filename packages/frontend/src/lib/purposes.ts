// The reasons a visitor can pick on check-in-purpose
export const PURPOSE_IDS = ["volunteering", "event", "seed-library"] as const;
export type PurposeId = (typeof PURPOSE_IDS)[number];
