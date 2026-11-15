import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { NextArrow } from "@frontend/components/ui/NextArrow.tsx";
import { useState } from "react";
import { Dropdown } from "@frontend/components/ui/Dropdown.tsx";
import { Button } from "@frontend/components/ui/Button.tsx";

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

  const navigate = useNavigate();

  const { allFields, purposes = [] } = Route.useSearch();
  const isEvent = purposes.includes("event");
  const isVolunteering = purposes.includes("volunteering");

  const [groupSize, setGroupSize] = useState("");
  const [event, setEvent] = useState("");
  const [isInstructor, setIsInstructor] = useState("");
  const [volunteerFor, setVolunteerFor] = useState("");
  const [fullName, setFullName] = useState("");

  const groupSizeNum = Number(groupSize);
  const groupSizeValid = Number.isInteger(groupSizeNum) && groupSizeNum >= 1;

  const canContinue =
    groupSizeValid &&
    fullName.trim() !== "" &&
    (!isEvent || (event !== "" && isInstructor !== "")) &&
    (!isVolunteering || volunteerFor !== "");


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
          className="w-[720px] h-[64px] rounded-md bg-[#F0F0F0] px-[20px] py-3 text-[28px] text-[#0B7285] font-[500] placeholder:text-[#0B7285]"
        />
        <span className="text-[20px] font-[400]">Required</span>

        {isEvent && (
          <>
            <Dropdown
              id="event"
              label="What event are you attending?"
              options={EVENTS}
              value={event}
              onChange={setEvent}
              required
            />
            <Dropdown
              id="is-instructor"
              label="Are you the event instructor?"
              options={YES_NO}
              value={isInstructor}
              onChange={setIsInstructor}
              required
            />
          </>
        )}

        {isVolunteering && (
          <Dropdown
            id="volunteer-for"
            label="What are you volunteering for?"
            options={VOLUNTEER_OPTIONS}
            value={volunteerFor}
            onChange={setVolunteerFor}
            required
          />
        )}
        {allFields ? <p>{/* TODO: extra fields (address?) */}</p> : null}

        <label htmlFor="full-name" className="text-[32px] font-[500]">
          Your full name
          <span className="text-warning">*</span>
        </label>
        <input
          id="full-name"
          type="text"
          autoComplete="name"
          autoCapitalize="words"
          required
          placeholder='ex. "Bruce Wayne"'
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-[720px] h-[64px] rounded-md bg-[#F0F0F0] px-[20px] py-3 text-[28px] text-[#0B7285] font-[500] placeholder:text-[#0B7285]"
        />
        <span className="text-[20px] font-[400]">Required</span>


      </div>

      <div className="mt-auto flex justify-end pt-10">

        {/* TODO: replace with the form's submit once there's somewhere to save answers */}
        <Button
          size="lg"
          disabled={!canContinue}
          onClick={() => navigate({ to: "/checked-in" })}
          className="cursor-pointer rounded-md bg-[#F0F0F0] px-12 py-4 text-[28px] font-medium text-[#565656] shadow-[0_4px_4px_rgba(0,0,0,0.25)] disabled:cursor-not-allowed disabled:bg-[#efefef] disabled:text-neutral-500"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
