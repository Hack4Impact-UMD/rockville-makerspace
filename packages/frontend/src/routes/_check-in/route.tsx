import { createFileRoute, Outlet } from "@tanstack/react-router";

/** Shared layout for the check-in flow; the "_" keeps it out of the URL. */
export const Route = createFileRoute("/_check-in")({
  component: CheckInLayout,
});

function CheckInLayout() {
  return <Outlet />;
}
