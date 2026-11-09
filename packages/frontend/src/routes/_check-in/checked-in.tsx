import { createFileRoute } from "@tanstack/react-router";
import { NextArrow } from "@frontend/components/ui/NextArrow.tsx";

export const Route = createFileRoute("/_check-in/checked-in")({
  staticData: { backTo: "/additional-info" },
  component: CheckedIn,
});

function CheckedIn() {
  return (
    <>
      <h1>Checked In</h1>
      {/* TODO: screen content */}
      {/* TODO: replace with the screen's real action */}
      <NextArrow to="/" />
    </>
  );
}
