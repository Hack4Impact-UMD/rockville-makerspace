import { createFileRoute, Outlet } from "@tanstack/react-router";

/**
 * Pathless layout for the check-in flow: the leading "_" adds no URL segment,
 * so its children live at /member-search, /member-purpose, and so on.
 * Shared flow UI (a progress bar, a frame) goes here.
 */
export const Route = createFileRoute("/_check-in")({
  component: CheckInLayout,
});

function CheckInLayout() {
  return <Outlet />;
}
