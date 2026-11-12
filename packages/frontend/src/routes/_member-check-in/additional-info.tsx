import { createFileRoute } from "@tanstack/react-router";
import { NextArrow } from "@frontend/components/ui/NextArrow.tsx";

interface AdditionalInfoSearch {
  /** `?allFields=true` shows the extra fields. */
  allFields?: boolean;
}

export const Route = createFileRoute("/_member-check-in/additional-info")({
  staticData: { backTo: "/check-in-purpose" },
  validateSearch: (search: Record<string, unknown>): AdditionalInfoSearch => ({
    allFields:
      search.allFields === true || search.allFields === "true"
        ? true
        : undefined,
  }),
  component: AdditionalInfo,
});

/** One screen, two modes: base fields, or all fields. */
function AdditionalInfo() {
  const { allFields } = Route.useSearch();

  return (
    <>
      <h1>Additional Info{allFields ? " (all fields)" : null}</h1>
      {/* TODO: base fields */}
      {allFields ? <p>{/* TODO: extra fields */}</p> : null}
      {/* TODO: replace with the form's submit */}
      <NextArrow to="/checked-in" />
    </>
  );
}
