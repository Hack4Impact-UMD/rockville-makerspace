import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { Dropdown } from "@frontend/components/ui/Dropdown.tsx";
import { Button } from "@frontend/components/ui/Button.tsx";
import { PURPOSE_IDS } from "@frontend/lib/purposes.ts";
import type { PurposeId } from "@frontend/lib/purposes.ts";

interface AdditionalInfoSearch {
  /** `?allFields=true` shows the extra fields. */
  allFields?: boolean;
  purposes?: PurposeId[];
}

// TODO: this is hardcoded for now, but in the future
//       it should come from the admin side
const EVENTS = ["Woodshop Workshop"];
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
  const [address, setAddress] = useState("");
  const [showSkipConfirm, setShowSkipConfirm] = useState(false);
  const addressRef = useRef<HTMLInputElement>(null);


  const groupSizeNum = Number(groupSize);
  const groupSizeValid = Number.isInteger(groupSizeNum) && groupSizeNum >= 1;

  const canContinue =
    groupSizeValid &&
    fullName.trim() !== "" &&
    (!isEvent || (event !== "" && isInstructor !== "")) &&
    (!isVolunteering || volunteerFor !== "");

  const handleContinue = () => {
    if (allFields && address.trim() === "") {
      setShowSkipConfirm(true);
      return;
    }
    navigate({ to: "/checked-in" });
  };

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

        {allFields && (
          <>
            <label htmlFor="address" className="text-[32px] font-[500]">
              Your full address
            </label>
            <input
              ref={addressRef}
              id="address"
              type="text"
              autoComplete="street-address"
              placeholder='ex. "1111 Main St, Rockville, MD, 20850"'
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-[720px] h-[64px] rounded-md bg-[#F0F0F0] px-[20px] py-3 text-[28px] text-[#0B7285] font-[500] placeholder:text-[#0B7285]"
            />
            <span className="text-[20px] font-[400]">
              Helps us secure funding, we will never send you mail.
            </span>
          </>
          )}

      </div>

      <div className="mt-auto flex justify-end pt-10">

        {/* TODO: replace with the form's submit once there's somewhere to save answers */}
        <Button
          size="lg"
          disabled={!canContinue}
          onClick={handleContinue}
          className="cursor-pointer rounded-md bg-[#F0F0F0] px-12 py-4 text-[28px] font-medium text-[#565656] shadow-[0_4px_4px_rgba(0,0,0,0.25)] disabled:cursor-not-allowed disabled:bg-[#efefef] disabled:text-neutral-500"
        >
          Continue
        </Button>
      </div>

      {showSkipConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="skip-title"
            className="flex h-[320px] w-[852px] flex-col items-center justify-center gap-[30px] rounded-[11.47px] bg-[#F8FEF8] px-[19.67px] py-[16.39px] font-ubuntu"
          >
            <div className="flex flex-col items-center gap-[10px] text-center">
              <h2
                id="skip-title"
                className="text-[32px] leading-none font-medium text-dark-green"
              >
                Are you sure?
              </h2>
              <p className="max-w-[604px] text-[28px] leading-none font-medium text-[#565656]">
                Your address is only used for funding purposes. We&apos;ll never send you mail.
              </p>
            </div>

            <div className="flex gap-[28px]">
              <Button
                onClick={() => navigate({ to: "/checked-in" })}
                className="cursor-pointer rounded-[10px] border-[1.5px] border-warning bg-white px-[32px] py-[18px] text-[28px] leading-none font-medium text-warning"
              >
                Skip anyway
              </Button>
              <Button
                onClick={() => {
                  setShowSkipConfirm(false);
                  addressRef.current?.focus();
                }}
                className="cursor-pointer rounded-[10px] border border-bright-green bg-dark-green px-[32px] py-[18px] text-[28px] leading-none font-medium text-white shadow-raised"
              >
                Add my address
              </Button>
            </div>
          </div>
        </div>
      )}


    </div>
  );
}
