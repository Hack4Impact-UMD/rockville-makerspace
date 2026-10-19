import { type } from "arktype";
import { personKind } from "@common/person.ts";

/** What a person selects at the kiosk. Admins can add or change these. */
export const visitType = type({
  id: "string",
  name: "string",
  /** Which kinds of people see this option at the kiosk. */
  audiences: personKind.array(),
  /** Volunteer hours carry grant-matching value. */
  countsAsVolunteerHours: "boolean",
  requiresWaiver: "boolean",
  /** Without this label the visit is flagged, never blocked (e.g. "mod" for MODing). */
  requiredLabelId: "string | null",
  active: "boolean",
  sortOrder: "number",
});
export type VisitType = typeof visitType.infer;

/** A back-end tag on a person. Not shown to visitors. */
export const label = type({
  id: "string",
  name: "string",
  description: "string",
  /** "admin": only admins add it. "derived": set by check-in activity. */
  assignment: "'admin' | 'derived'",
});
export type Label = typeof label.infer;

// TODO: confirm with RMS which visit flows require a waiver.
export const DEFAULT_VISIT_TYPES: VisitType[] = [
  {
    id: "member-hours",
    name: "Member Hours",
    audiences: ["member"],
    countsAsVolunteerHours: false,
    requiresWaiver: false,
    requiredLabelId: null,
    active: true,
    sortOrder: 0,
  },
  {
    id: "volunteering",
    name: "Volunteering",
    audiences: ["member", "non-member"],
    countsAsVolunteerHours: true,
    requiresWaiver: false,
    requiredLabelId: null,
    active: true,
    sortOrder: 1,
  },
  {
    id: "moding",
    name: "MODing",
    audiences: ["member"],
    countsAsVolunteerHours: true,
    requiresWaiver: false,
    requiredLabelId: "mod",
    active: true,
    sortOrder: 2,
  },
  {
    id: "event",
    name: "Event",
    audiences: ["member", "non-member"],
    countsAsVolunteerHours: false,
    requiresWaiver: false,
    requiredLabelId: null,
    active: true,
    sortOrder: 3,
  },
  {
    id: "tour",
    name: "Tour",
    audiences: ["non-member"],
    countsAsVolunteerHours: false,
    requiresWaiver: false,
    requiredLabelId: null,
    active: true,
    sortOrder: 4,
  },
  {
    id: "seed-library",
    name: "Seed Library",
    audiences: ["non-member"],
    countsAsVolunteerHours: false,
    requiresWaiver: false,
    requiredLabelId: null,
    active: true,
    sortOrder: 5,
  },
  {
    id: "become-member",
    name: "Become a Member",
    audiences: ["non-member"],
    countsAsVolunteerHours: false,
    requiresWaiver: false,
    requiredLabelId: null,
    active: true,
    sortOrder: 6,
  },
  {
    id: "guest-of-member",
    name: "Guest of a Member",
    audiences: ["non-member"],
    countsAsVolunteerHours: false,
    requiresWaiver: false,
    requiredLabelId: null,
    active: true,
    sortOrder: 7,
  },
];

export const DEFAULT_LABELS: Label[] = [
  {
    id: "mod",
    name: "Member On Duty",
    description: "May open and close the makerspace and run the register.",
    assignment: "admin",
  },
  {
    id: "affiliated-group",
    name: "Affiliated group member",
    description:
      "Checked in to an affiliate group event (Explorer Post, UAS4STEM, Civil Air Patrol).",
    assignment: "derived",
  },
  {
    id: "volunteer",
    name: "Volunteer",
    description: "Has checked in as a volunteer.",
    assignment: "derived",
  },
  {
    id: "instructor",
    name: "Instructor",
    description: "Teaches classes. Not yet derivable from any visit type.",
    assignment: "admin",
  },
];
