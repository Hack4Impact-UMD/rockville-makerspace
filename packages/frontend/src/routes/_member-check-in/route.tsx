import { createFileRoute, Outlet } from "@tanstack/react-router";

/** Shared layout for the member check-in flow; the "_" keeps it out of the URL. */
export const Route = createFileRoute("/_member-check-in")({
  component: CheckInLayout,
});

function CheckInLayout() {
  return <Outlet />;
}
