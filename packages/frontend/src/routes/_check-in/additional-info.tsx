import { createFileRoute } from "@tanstack/react-router";
import { BackArrow } from "@frontend/components/ui/BackArrow.tsx";
import { NextArrow } from "@frontend/components/ui/NextArrow.tsx";

interface AdditionalInfoSearch {
  /** `?allFields=true` shows the extra fields. */
  allFields?: boolean;
}

export const Route = createFileRoute("/_check-in/additional-info")({
  validateSearch: (search: Record<string, unknown>): AdditionalInfoSearch => ({
    allFields:
      search.allFields === true || search.allFields === "true"
        ? true
        : undefined,
  }),
  component: AdditionalInfo,
});

/** One screen, two modes: the base fields, or every field when `allFields` is set. */
function AdditionalInfo() {
  const { allFields } = Route.useSearch();

  return (
    <>
      <BackArrow to="/member-purpose" />
      <h1>Additional Info{allFields ? " (all fields)" : null}</h1>
      {/* TODO: base fields */}
      {allFields ? <p>{/* TODO: extra fields */}</p> : null}
      {/* TODO: replace with the form's submit */}
      <NextArrow to="/checked-in" />
    </>
  );
}
