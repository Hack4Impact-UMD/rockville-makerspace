import { createFileRoute, Outlet } from "@tanstack/react-router";

/** Shared layout for the check-out flow; the "_" keeps it out of the URL. */
export const Route = createFileRoute("/_check-out")({
  component: CheckOutLayout,
});

function CheckOutLayout() {
  return <Outlet />;
}
