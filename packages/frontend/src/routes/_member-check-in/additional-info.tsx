import { createFileRoute } from "@tanstack/react-router";
import { NextArrow } from "@frontend/components/ui/NextArrow.tsx";
import { useState } from "react";

const PURPOSE_IDS = ["volunteering", "event", "seed-library"] as const;
type PurposeId = (typeof PURPOSE_IDS)[number];

interface AdditionalInfoSearch {
  /** `?allFields=true` shows the extra fields. */
  allFields?: boolean;
  purposes?: PurposeId[];
}

// TODO: this is hardcoded for now, but in the future
//       it should come from the admin side
const EVENTS = ["Woordshop Workshop"];
const VOLUNTEER_OPTIONS = ["Member hours"];
const YES_NO = ["Yes", "No"];


export const Route = createFileRoute("/_member-check-in/additional-info")({
  staticData: { backTo: "/check-in-purpose" },
  validateSearch: (search: Record<string, unknown>): AdditionalInfoSearch => ({
    allFields:
      search.allFields === true || search.allFields === "true"
        ? true
        : undefined,
    purposes: 
      Array.isArray(search.purposes)
        ? search.purposes.filter((p): p is PurposeId => PURPOSE_IDS.includes(p))
        : undefined,
  }),
  component: AdditionalInfo,
});

/** One screen, two modes: base fields, or all fields. */
function AdditionalInfo() {
  const { allFields, purposes = [] } = Route.useSearch();
  const isEvent = purposes.includes("event");
  const isVolunteering = purposes.includes("volunteering");

  const [groupSize, setGroupSize] = useState("");
  const [event, setEvent] = useState("");
  const [isInstructor, setIsInstructor] = useState("");
  const [volunteerFor, setVolunteerFor] = useState("");

  return (
    <div className="flex flex-col py-[40px] px-[120px] text-[#FFFFFF] gap-[28px]">
      <h1 className="text-[40px] font-[700]">Last step! We just need a little bit more information.</h1>
      <p className="text-[20px] font-[400]">Your answers help us secure grants for the makerspace!</p>

      <div className="flex flex-col gap-[10px]">

        <label htmlFor="group-size" className="text-[32px] font-[500]">
          How many people total are in your group?
          <span className="text-warning">*</span>
        </label>
        <input
          id="group-size"
          type="number"
          inputMode="numeric"
          min={1}
          required
          placeholder="ex. 2"
          value={groupSize}
          onChange={(e) => setGroupSize(e.target.value)}
          className="w-full max-w-[600px] rounded-md bg-[#efefef] px-4 py-3 text-[22px] text-teal placeholder:text-teal/70"
        />
        <span className="text-[20px] font-[400]">Required</span>

      </div>
      


      <h1>Additional Info{allFields ? " (all fields)" : null}</h1>
      {/* TODO: base fields */}
      {allFields ? <p>{/* TODO: extra fields */}</p> : null}
      {/* TODO: replace with the form's submit */}
      <NextArrow to="/checked-in" />
    </div>
  );
}
