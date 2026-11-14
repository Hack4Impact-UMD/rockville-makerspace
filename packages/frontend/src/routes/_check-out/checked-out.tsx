import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo } from "react";
import { CheckedOut } from "@frontend/components/check-out/CheckedOut.tsx";

export const Route = createFileRoute("/_check-out/checked-out")({
  // TODO: the member's name will come from the check-out flow once the backend
  // is wired up. Until then it is passed as ?name=... for previewing
  validateSearch: (search: Record<string, unknown>) => ({
    name: typeof search.name === "string" ? search.name : "Priya",
  }),
  component: CheckedOutPage,
});

function CheckedOutPage() {
  const { name } = Route.useSearch();
  const navigate = useNavigate();
  // TODO: use the recorded check-out time once check-outs are saved
  const checkedOutAt = useMemo(() => new Date(), []);

  return (
    <CheckedOut
      firstName={name}
      checkedOutAt={checkedOutAt}
      onGoBack={() => void navigate({ to: "/check-out-purpose" })}
      onDone={() => void navigate({ to: "/" })}
      // TODO: the time-editing flow isn't designed yet. Open it from here once
      // it exists
      onEditTime={() => {}}
    />
  );
}
