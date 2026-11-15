import { createFileRoute } from "@tanstack/react-router";
import { NextArrow } from "@frontend/components/ui/NextArrow.tsx";

const PURPOSE_IDS = ["volunteering", "event", "seed-library"] as const;
type PurposeId = (typeof PURPOSE_IDS)[number];

interface AdditionalInfoSearch {
  /** `?allFields=true` shows the extra fields. */
  allFields?: boolean;
  purposes?: PurposeId[];
}

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
  const { allFields } = Route.useSearch();

  return (
    <div className="flex flex-col py-[40px] px-[120px] text-[#FFFFFF] gap-[28px]">
      <h1 className="text-[40px] font-[700]">Last step! We just need a little bit more information.</h1>
      <p className="text-[20px] font-[400]">Your answers help us secure grants for the makerspace!</p>

      <div>

        <label className="text-[32px] font-[500]"></label>
      </div>
      


      <h1>Additional Info{allFields ? " (all fields)" : null}</h1>
      {/* TODO: base fields */}
      {allFields ? <p>{/* TODO: extra fields */}</p> : null}
      {/* TODO: replace with the form's submit */}
      <NextArrow to="/checked-in" />
    </div>
  );
}
